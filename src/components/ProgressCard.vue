<script setup>
import { onMounted, computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useGuildStore } from '@/stores/guild'

const guildStore = useGuildStore()

onMounted(async () => {
  guildStore.fetchAllData()
})

// Computed pour le formatage de la date
const formattedKillDate = computed(() => {
  if (!guildStore.lastEncounter?.killedAtTimestamp) return null
  return format(new Date(guildStore.lastEncounter.killedAtTimestamp), 'dd MMMM yyyy à HH:mm', {
    locale: fr,
  })
})

// Computed pour le statut du boss
const isFinished = computed(() => {
  return guildStore.lastEncounter?.status === 'finished'
})

// Computed pour le pourcentage de vie restante
const healthPercent = computed(() => {
  if (!guildStore.lastEncounter?.bestPercent) return 0
  return Math.max(0, 100 - guildStore.lastEncounter.bestPercent)
})
</script>

<template>
  <div class="progress-card">
    <!-- Loading State -->
    <div v-if="guildStore.isLoadingProgress" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">Chargement des données de progression...</p>
    </div>

    <!-- Boss Data -->
    <div v-else-if="guildStore.lastEncounter" class="boss-encounter">
      <!-- Boss Image Section -->
      <div class="boss-image-container">
        <div class="boss-image-wrapper">
          <img
            :src="guildStore.lastEncounter.transparentImageUrl"
            :alt="guildStore.lastEncounter.name"
            class="boss-image"
          />

          <!-- Health Bar (si pas fini) -->
          <div v-if="!isFinished" class="health-bar-container">
            <div class="health-bar">
              <div class="health-fill" :style="{ width: `${healthPercent}%` }"></div>
              <span class="health-text"
                >{{ guildStore.lastEncounter.bestPercent }}% de vie restante</span
              >
            </div>
          </div>

          <!-- Badge Finished -->
          <div v-else class="finished-badge">
            <svg class="finished-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>VAINCU</span>
          </div>
        </div>
      </div>

      <!-- Boss Info Section -->
      <div class="boss-info">
        <div class="boss-header">
          <div class="boss-title">
            <h2>{{ guildStore.lastEncounter.name || 'Boss Inconnu' }}</h2>
            <div
              class="boss-status"
              :class="{
                'status-killed': isFinished,
                'status-progress': !isFinished,
              }"
            >
              <div class="status-indicator"></div>
              <span>{{ isFinished ? 'Terminé' : 'En Cours' }}</span>
            </div>
          </div>
        </div>

        <div class="boss-stats">
          <!-- Stat: Meilleur Pull / Date de Kill -->
          <div class="stat-item primary-stat">
            <div
              class="stat-icon"
              :class="{
                'icon-success': isFinished,
                'icon-progress': !isFinished,
              }"
            >
              <svg v-if="isFinished" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">{{ isFinished ? 'Vaincu le' : 'Meilleur Pull' }}</span>
              <span class="stat-value">
                {{ isFinished ? formattedKillDate : `${guildStore.lastEncounter.bestPercent}%` }}
              </span>
            </div>
          </div>

          <!-- Stat: Nombre de Pulls -->
          <div class="stat-item">
            <div class="stat-icon icon-pulls">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Tentatives</span>
              <span class="stat-value">{{ guildStore.lastEncounter.pullCount }}</span>
            </div>
          </div>

          <!-- Stat: Difficulté (si disponible) -->
          <div class="stat-item">
            <div class="stat-icon icon-difficulty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Difficulté</span>
              <span class="stat-value">Mythique</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar (version alternative pour la section info) -->
        <div v-if="!isFinished" class="progress-summary">
          <div class="progress-bar-mini">
            <div class="progress-track">
              <div
                class="progress-thumb"
                :style="{ left: `${guildStore.lastEncounter.bestPercent}%` }"
              ></div>
            </div>
            <span class="progress-label"
              >{{ guildStore.lastEncounter.bestPercent }}% de progression</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="no-data-container">
      <div class="no-data-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3>Aucune donnée de progression</h3>
      <p>Les informations de raid seront affichées ici une fois disponibles.</p>
    </div>
  </div>
</template>

<style scoped>
/* === PROGRESS CARD CONTAINER === */
.progress-card {
  background: rgba(43, 27, 24, 0.8);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 380px; /* Augmenté de 280px à 380px */
  height: auto; /* Permet l'expansion automatique */
}

.progress-card:hover {
  border-color: var(--color-orange);
  box-shadow: 0 8px 30px rgba(249, 131, 58, 0.2);
}

/* === LOADING STATE === */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 380px; /* Cohérent avec la card */
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(249, 131, 58, 0.2);
  border-radius: 50%;
  border-top-color: var(--color-orange);
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--color-gray);
  font-size: 16px;
  margin: 0;
}

/* === BOSS ENCOUNTER === */
.boss-encounter {
  display: grid;
  grid-template-columns: 320px 1fr;
  min-height: 380px; /* Augmenté pour plus d'espace */
  height: auto; /* Permet l'expansion */
}

/* === BOSS IMAGE SECTION === */
.boss-image-container {
  position: relative;
  background: linear-gradient(135deg, var(--color-accent), var(--color-dark));
  overflow: hidden;
  min-height: 380px; /* Assure une hauteur minimale */
}

.boss-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 380px; /* Même hauteur que le conteneur */
  display: flex;
  align-items: center;
  justify-content: center;
}

.boss-image {
  max-width: 200%; /* Légèrement réduit pour laisser de l'espace */
  max-height: 300px; /* Hauteur maximale pour l'image */
  object-fit: contain;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
}

/* === HEALTH BAR === */
.health-bar-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
}

.health-bar {
  position: relative;
  height: 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-danger) 0%, #ff6b6b 100%);
  transition: width 0.3s ease;
  border-radius: 6px;
}

.health-text {
  position: absolute;
  top: -25px;
  left: 0;
  color: var(--color-light);
  font-size: 12px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* === FINISHED BADGE === */
.finished-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  background: linear-gradient(135deg, var(--color-green), #5a7c32);
  color: white;
  padding: 16px 28px; /* Légèrement plus grand */
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 20px; /* Plus grand pour être plus visible */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.finished-icon {
  width: 28px; /* Plus grand */
  height: 28px;
}

/* === BOSS INFO SECTION === */
.boss-info {
  padding: 32px; /* Plus de padding pour plus d'espace */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Changé de space-between à flex-start */
  gap: 24px; /* Espacement uniforme entre les sections */
  min-height: 380px;
}

.boss-header {
  /* margin-bottom retiré car on utilise gap maintenant */
}

.boss-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap; /* Permet le wrap sur petits écrans */
}

.boss-title h2 {
  font-family: 'Archivo Black', sans-serif;
  font-size: 26px; /* Légèrement plus grand */
  margin: 0;
  color: var(--color-light);
  line-height: 1.2;
  flex: 1; /* Prend l'espace disponible */
  min-width: 200px; /* Largeur minimale */
}

.boss-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px; /* Plus de padding */
  border-radius: 20px;
  font-size: 13px; /* Légèrement plus grand */
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0; /* Ne se réduit pas */
}

.status-killed {
  background: rgba(124, 138, 78, 0.2);
  color: var(--color-green);
  border: 1px solid rgba(124, 138, 78, 0.3);
}

.status-progress {
  background: rgba(249, 131, 58, 0.2);
  color: var(--color-orange);
  border: 1px solid rgba(249, 131, 58, 0.3);
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* === BOSS STATS === */
.boss-stats {
  display: flex;
  flex-direction: column;
  gap: 18px; /* Plus d'espace entre les stats */
  flex: 1; /* Prend l'espace disponible */
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px; /* Plus d'espace entre l'icône et le contenu */
  padding: 16px; /* Plus de padding */
  background: rgba(245, 224, 185, 0.05);
  border-radius: 10px; /* Coins plus arrondis */
  border: 1px solid rgba(245, 224, 185, 0.1);
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: rgba(245, 224, 185, 0.1);
  border-color: rgba(249, 131, 58, 0.3);
  transform: translateX(4px); /* Petit effet de hover */
}

.primary-stat {
  background: rgba(249, 131, 58, 0.1);
  border-color: rgba(249, 131, 58, 0.2);
}

.stat-icon {
  width: 42px; /* Plus grand */
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-success {
  background: linear-gradient(135deg, var(--color-green), #5a6b3a);
}

.icon-progress {
  background: linear-gradient(135deg, var(--color-orange), #cc6a2a);
}

.icon-pulls {
  background: linear-gradient(135deg, var(--color-accent), #6b2e24);
}

.icon-difficulty {
  background: linear-gradient(135deg, #8b3a2f, #6b2e24);
}

.stat-icon svg {
  width: 20px; /* Plus grand */
  height: 20px;
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Plus d'espace */
  flex: 1;
}

.stat-label {
  color: var(--color-gray);
  font-size: 14px; /* Plus grand */
  font-weight: 500;
}

.stat-value {
  color: var(--color-light);
  font-size: 18px; /* Plus grand */
  font-weight: 700;
  word-break: break-word; /* Évite le débordement */
}

/* === PROGRESS SUMMARY === */
.progress-summary {
  margin-top: auto; /* Pousse vers le bas */
  padding-top: 16px; /* Espace au-dessus */
  border-top: 1px solid rgba(245, 224, 185, 0.1); /* Séparateur visuel */
}

.progress-bar-mini {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Plus d'espace */
}

.progress-track {
  position: relative;
  height: 6px; /* Plus épais */
  background: rgba(245, 224, 185, 0.2);
  border-radius: 3px;
}

.progress-thumb {
  position: absolute;
  top: -3px; /* Ajusté pour la nouvelle hauteur */
  width: 12px; /* Plus grand */
  height: 12px;
  background: var(--color-orange);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 8px rgba(249, 131, 58, 0.4);
}

.progress-label {
  color: var(--color-gray);
  font-size: 13px; /* Plus grand */
  text-align: center;
  font-weight: 500;
}

/* === NO DATA STATE === */
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 380px; /* Cohérent */
}

.no-data-icon {
  width: 56px; /* Plus grand */
  height: 56px;
  color: var(--color-gray);
  margin-bottom: 20px; /* Plus d'espace */
}

.no-data-container h3 {
  font-size: 20px; /* Plus grand */
  color: var(--color-gray);
  margin: 0 0 12px 0;
}

.no-data-container p {
  color: var(--color-gray);
  margin: 0;
  font-size: 15px; /* Plus grand */
  line-height: 1.5;
}

/* === ANIMATIONS === */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .boss-encounter {
    grid-template-columns: 1fr;
    grid-template-rows: 280px 1fr; /* Plus d'espace pour l'image */
    min-height: auto;
  }

  .boss-image-container {
    min-height: 280px;
  }

  .boss-image-wrapper {
    min-height: 280px;
  }

  .boss-info {
    padding: 24px;
    min-height: auto;
  }

  .boss-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .boss-title h2 {
    font-size: 22px;
    min-width: auto;
  }

  .boss-stats {
    gap: 14px;
  }

  .stat-item {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .progress-card {
    min-height: auto;
  }

  .boss-encounter {
    grid-template-rows: 220px 1fr;
  }

  .boss-image-container,
  .boss-image-wrapper {
    min-height: 220px;
  }

  .boss-info {
    padding: 20px;
    gap: 20px;
  }

  .stat-item {
    padding: 12px;
    gap: 12px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
  }

  .stat-icon svg {
    width: 18px;
    height: 18px;
  }

  .finished-badge {
    font-size: 16px;
    padding: 12px 20px;
  }

  .finished-icon {
    width: 20px;
    height: 20px;
  }

  .boss-title h2 {
    font-size: 20px;
  }
}
</style>
