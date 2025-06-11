<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useGuildStore } from '@/stores/guild'

import Articles from '@/components/Articles.vue'
import ProgressCard from '@/components/ProgressCard.vue'
import RaidCalendar from '@/components/RaidCalendar.vue'

const guildStore = useGuildStore()

onMounted(async () => {
  guildStore.fetchAllData()
})
</script>

<template>
  <div class="dashboard-container uk-container-expand">
    <ProgressCard />
    <div class="uk-card uk-card-secondary uk-card-body leaderboard-container">
      <h3 class="uk-card-title">Classement de guilde</h3>
      <div v-if="!guildStore.ranking" class="uk-flex uk-flex-center">
        <div uk-spinner="ratio: 2"></div>
      </div>
      <div v-else class="uk-grid-small uk-child-width-1-2@s uk-text-center" uk-grid>
        <div>
          <h4>Progression</h4>
          <p>🌍Région : {{ guildStore.ranking.guild.zoneRanking.progress.regionRank.number }}</p>
          <p>🏅Serveur : {{ guildStore.ranking.guild.zoneRanking.progress.serverRank.number }}</p>
        </div>
        <div>
          <h4>Vitesse</h4>
          <p>🌍Région : {{ guildStore.ranking.guild.zoneRanking.speed.regionRank.number }}</p>
          <p>🏅Serveur : {{ guildStore.ranking.guild.zoneRanking.speed.serverRank.number }}</p>
        </div>
      </div>
    </div>
    <div class="uk-container-expand articles-container">
      <div class="uk-margin">
        <h3 class="uk-heading-line"><span>Derniers articles</span></h3>
        <!-- <Articles /> -->
      </div>
    </div>
    <div class="uk-container-expand calendar-container">
      <div class="uk-container uk-margin">
        <h3 class="uk-heading-line"><span>Calendrier des Raids</span></h3>
        <RaidCalendar />
      </div>
    </div>
  </div>
</template>

<style>
div.dashboard-container {
  padding: 0.7rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
}
div.leaderboard-container {
  grid-column-start: 3;
}

div.calendar-container {
  grid-row: span 2 / span 2;
  grid-column-start: 3;
  grid-row-start: 2;
}

div.articles-container {
  grid-column: span 2 / span 2;
  grid-row: span 2 / span 2;
  grid-column-start: 1;
  grid-row-start: 2;
}
</style>
