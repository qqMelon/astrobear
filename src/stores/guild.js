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
    const nmAwait = await getGuildProgress(2)
    const hmAwait = await getGuildProgress(3)
    progress.value = nmAwait
    progress.value?.progressRaceData.progressRace.push(hmAwait.progressRaceData.progressRace?.[0])
    extractLastEncounter()
  }

  const extractLastEncounter = () => {
    console.log('Check data from progressData: ', progress.value.progressRaceData)
    const nm = progress.value.progressRaceData.progressRace?.[0]
    const hm = progress.value.progressRaceData.progressRace?.[1]

    if (nm?.encounters && nm.encounters.find(e => !e.isKilled)) {
      console.log('Pass here on NM difficulty')
      lastEncounter.value = nm.encounters.find(e => !e.isKilled)
      lastEncounter.value.difficulty = 'normal'
    } else if (hm?.encounters && hm.encounters.find(e => !e.isKilled)) {
      lastEncounter.value = hm.encounters.find(e => !e.isKilled)
      lastEncounter.value.difficulty = 'heroic'
    } else {
      console.log('Error on detect difficulties, pass default values')
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
