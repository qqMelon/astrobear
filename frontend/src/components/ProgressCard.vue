<script setup>
import { onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useGuildStore } from '@/stores/guild'

const guildStore = useGuildStore()

onMounted(async () => {
  guildStore.fetchAllData()
})
</script>

<template>
  <div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
    <div class="uk-card-media-left uk-cover-container">
      <div
        v-if="guildStore.isLoadingProgress"
        class="uk-flex uk-flex-center uk-flex-middle"
        style="height: 300px"
      >
        <div uk-spinner="ratio: 2"></div>
      </div>
      <div v-else-if="guildStore.lastEncounter">
        <img
          :src="guildStore.lastEncounter.transparentImageUrl"
          alt="Boss"
          uk-cover
          class="floating-image"
        />
        <progress
          v-if="!guildStore.lastEncounter?.status == 'finished'"
          class="uk-progress uk-position-absolute healthboss-progress"
          style=""
          :value="guildStore.lastEncounter?.bestPercent"
          max="100"
        ></progress>
        <span class="finished-text" v-else>Finished</span>
        <canvas width="600" height="300"></canvas>
      </div>
    </div>
    <div class="uk-card-body bossdata-container">
      <h3 class="uk-card-title">{{ guildStore.lastEncounter?.name || 'Boss inconnu' }}</h3>
      <p v-if="!guildStore.lastEncounter?.status == 'finished'">
        Meilleur Pull:
        <strong>{{ guildStore.lastEncounter?.bestPercent }}%</strong>
      </p>
      <p v-else>
        Tombé le:
        <strong>{{ new Date(guildStore.lastEncounter?.killedAtTimestamp) }}</strong>
      </p>
      <p>
        Pulls:
        <strong>{{ guildStore.lastEncounter?.pullCount }}</strong>
      </p>
    </div>
  </div>
</template>

<style>
.floating-image {
  animation: float 6s ease-in-out infinite;
  height: 300px;
  object-fit: cover;
}

.bossdata-container {
  padding-left: 15px;
}

.healthboss-progress {
  bottom: 10px;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 5%;
  width: 90%;
  -webkit-box-shadow: 0px 0px 25px 7px rgba(0, 0, 0, 0.27);
  box-shadow: 0px 0px 25px 7px rgba(0, 0, 0, 0.27);
}

span.finished-text {
  color: red;
  rotate: -27deg;
  font-size: 4rem;
  text-shadow: 2px 2px #ff0000;
  font-weight: bold;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
