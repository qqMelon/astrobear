import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getGuildProgress, getGuildRank } from '@/services/warcraftlogs'

export const useGuildStore = defineStore('guild', () => {
  const ranking = ref(null)
  const progress = ref(null)
  const lastEncounter = ref(null)

  const getRanking = async () => {
    ranking.value = await getGuildRank()
  }

  const getProgress = async () => {
    progress.value = await getGuildProgress(3)
    const hmAwait = await getGuildProgress(4)
    progress.value?.progressRaceData.progressRace.push(hmAwait.progressRaceData.progressRace?.[0])
    extractLastEncounter()
  }

  const extractLastEncounter = () => {
    const nm = progress.value.progressRaceData.progressRace?.[0]
    const hm = progress.value.progressRaceData.progressRace?.[1]

    if (nm?.encounters && nm.encounters.find(e => !e.isKilled)) {
      lastEncounter.value = nm.encounters.find(e => !e.isKilled)
      lastEncounter.value.difficulty = 'normal'
    } else if (hm?.encounters && hm.encounters.find(e => !e.isKilled)) {
      lastEncounter.value = nm.encounters.find(e => !e.isKilled)
      lastEncounter.value.difficulty = 'heroic'
    } else {
      lastEncounter.value = hm?.encounters.slice(-1).pop()
      lastEncounter.value.difficulty = 'heroic'
      lastEncounter.value.status = 'finished'
    }
  }

  const fetchAllData = async () => {
    await Promise.all([getRanking(), getProgress()])
  }

  return {
    ranking,
    progress,
    lastEncounter,
    getRanking,
    getProgress,
    fetchAllData,
  }
})
