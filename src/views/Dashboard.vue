<script setup>
import { onMounted, computed, ref } from 'vue'
import { useGuildStore } from '@/stores/guild'
import { getLatestReleases } from '@/services/github'

import BaseCard from '@/components/ui/BaseCard.vue'
import BaseArticles from '@/components/ui/BaseArticles.vue'
import ProgressCard from '@/components/ProgressCard.vue'
import RaidCalendar from '@/components/RaidCalendar.vue'
import CardArticle from '@/components/CardArticle.vue'

import API from '@/helpers/axios'

const guildStore = useGuildStore()
const articles = ref([])

const loadArticles = async function () {
  const res = await API.get(`/items/articles`)
  console.log('receive articles from Directus: ', res.data) 
  articles.value = res.data
}

onMounted(async () => {
  await guildStore.fetchAllData()
  await loadArticles()

  // Articles de démonstration pour tester l'affichage
  const demoArticles = [
    {
      title: "Nouvelle mise à jour de l'interface !",
      date: '2025-01-15',
      body: `# Nouvelle interface utilisateur

Nous avons complètement repensé l'interface pour une **meilleure expérience utilisateur**.

## Nouveautés :
- Design moderne et responsive
- Navigation améliorée
- Thème sombre optimisé
- Intégration Discord améliorée

*Profitez de toutes ces nouveautés dès maintenant !*`,
      isGithubRelease: false,
    },
    {
      title: 'Calendrier des raids M+ saison 1',
      date: '2025-01-10',
      body: `La nouvelle saison des **Mythic+ est lancée** ! 

Rejoignez-nous pour nos sessions hebdomadaires :
- **Mardi 20h** : M+ progression
- **Jeudi 20h** : M+ farming
- **Samedi 19h** : M+ détente

Objectif : Keystone Master pour tous ! 🏆`,
      isGithubRelease: false,
    },
    {
      title: 'Recrutement : Tank & Heal',
      date: '2025-01-05',
      body: `## 🔍 On recrute !

La guilde **Team Sabotâche** recherche :

- **1 Tank** (DK/Warrior de préférence)
- **1 Heal** (Priest/Paladin)

**Profil recherché :**
- Disponible raids 20h-23h
- Expérience M15+ minimum
- Bonne ambiance garantie ! 😊

Contactez un officier en jeu !`,
      isGithubRelease: false,
    },
  ]

  // Toujours utiliser les articles de démo pour le debug
  // articles.value = demoArticles
})

// Computed pour les stats rapides
const quickStats = computed(() => {
  if (!guildStore.ranking) return null
  return {
    progressRegion: guildStore.ranking.guild.zoneRanking.progress.regionRank.number,
    progressServer: guildStore.ranking.guild.zoneRanking.progress.serverRank.number,
    speedRegion: guildStore.ranking.guild.zoneRanking.speed.regionRank.number,
    speedServer: guildStore.ranking.guild.zoneRanking.speed.serverRank.number,
  }
})
</script>

<template>
  <main class="dashboard">
    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Progress Card - Pleine largeur en haut -->
      <section class="grid-item progress-section">
        <ProgressCard />
      </section>

      <!-- Stats Cards -->
      <section class="grid-item stats-cards">
        <div class="cards-row">
          <!-- Card Progression avec BaseCard -->
          <BaseCard variant="hover" padding="default">
            <div class="card-header">
              <div class="card-icon progress-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3>Progression</h3>
            </div>
            <div v-if="quickStats" class="card-content">
              <div class="stat-item">
                <span class="stat-label">🌍 Région</span>
                <span class="stat-value">#{{ quickStats.progressRegion }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">🏅 Serveur</span>
                <span class="stat-value">#{{ quickStats.progressServer }}</span>
              </div>
            </div>
            <div v-else class="card-content">
              <div class="loading-state">
                <div class="spinner"></div>
                <span>Chargement...</span>
              </div>
            </div>
          </BaseCard>

          <!-- Card Vitesse avec BaseCard -->
          <BaseCard variant="hover" padding="default">
            <div class="card-header">
              <div class="card-icon speed-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3>Vitesse</h3>
            </div>
            <div v-if="quickStats" class="card-content">
              <div class="stat-item">
                <span class="stat-label">🌍 Région</span>
                <span class="stat-value">#{{ quickStats.speedRegion }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">🏅 Serveur</span>
                <span class="stat-value">#{{ quickStats.speedServer }}</span>
              </div>
            </div>
            <div v-else class="card-content">
              <div class="loading-state">
                <div class="spinner"></div>
                <span>Chargement...</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>

      <!-- BaseArticles Section -->
      <section class="grid-item articles-section">
        <BaseCard padding="none">
          <div class="section-header">
            <div class="section-title">
              <div class="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h2>📰 Derniers Articles</h2>
            </div>
            <button class="btn-secondary">Voir tout</button>
          </div>
          <div class="section-content">
            <div v-if="articles.length > 0" class="base-articles">
              <div class="articles-list">
                <div v-for="(article, index) in articles" :key="index" class="articles-item">
                  <CardArticle />
                </div>
              </div>
            </div>
            <div v-else class="articles-placeholder">
              <div class="placeholder-item">
                <div class="placeholder-avatar"></div>
                <div class="placeholder-content">
                  <div class="placeholder-title"></div>
                  <div class="placeholder-text"></div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Calendar Section avec BaseCard -->
      <section class="grid-item calendar-section">
        <BaseCard padding="none">
          <div class="section-header">
            <div class="section-title">
              <div class="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2>🗓️ Calendrier des Raids</h2>
            </div>
            <button class="btn-secondary">Programmer</button>
          </div>
          <div class="section-content">
            <RaidCalendar />
          </div>
        </BaseCard>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* === DASHBOARD LAYOUT === */
.dashboard {
  min-height: 100vh;
  background: var(--color-bg);
  font-family: 'Inter', sans-serif;
  color: var(--color-light);
  padding: 0;
}

/* === GRID DASHBOARD === */
.dashboard-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr 400px;
  grid-template-rows: auto auto 1fr;
  gap: 24px;
  min-height: calc(100vh - 120px);
}

.grid-item {
  border-radius: 12px;
  overflow: hidden;
}

/* === SECTIONS GRID === */
.progress-section {
  grid-column: 1 / -1;
}

.stats-cards {
  grid-column: 1 / 3;
}

.articles-section {
  grid-column: 1 / 3;
  grid-row: 3;
}

.calendar-section {
  grid-column: 3;
  grid-row: 2 / 4;
}

/* === CARDS STYLES === */
.cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 5px;
}

/* === CONTENU DES CARTES === */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-icon {
  background: linear-gradient(135deg, var(--color-green), #5a6b3a);
}

.speed-icon {
  background: linear-gradient(135deg, var(--color-orange), #cc6a2a);
}

.card-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.card-header h3 {
  font-size: 18px;
  margin: 0;
  color: var(--color-light);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(245, 224, 185, 0.1);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: var(--color-gray);
  font-size: 14px;
}

.stat-value {
  font-weight: 700;
  font-size: 18px;
  color: var(--color-orange);
}

/* === SECTIONS PRINCIPALES === */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-orange));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon svg {
  width: 16px;
  height: 16px;
  color: white;
}

.section-title h2 {
  font-size: 20px;
  margin: 0;
  color: var(--color-light);
}

.section-content {
  padding: 24px;
}

/* === BOUTONS === */
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  background: rgba(245, 224, 185, 0.1);
  color: var(--color-light);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: rgba(249, 131, 58, 0.2);
  border-color: var(--color-orange);
}

/* === LOADING & PLACEHOLDERS === */
.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gray);
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(245, 224, 185, 0.2);
  border-radius: 50%;
  border-top-color: var(--color-orange);
  animation: spin 1s linear infinite;
}

.articles-placeholder {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.placeholder-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(245, 224, 185, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(245, 224, 185, 0.1);
}

.placeholder-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    rgba(245, 224, 185, 0.1) 0%,
    rgba(249, 131, 58, 0.2) 50%,
    rgba(245, 224, 185, 0.1) 100%
  );
  animation: shimmer 1.5s infinite;
}

.placeholder-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placeholder-title {
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(245, 224, 185, 0.1) 0%,
    rgba(249, 131, 58, 0.2) 50%,
    rgba(245, 224, 185, 0.1) 100%
  );
  border-radius: 4px;
  width: 70%;
  animation: shimmer 1.5s infinite;
}

.placeholder-text {
  height: 12px;
  background: linear-gradient(
    90deg,
    rgba(245, 224, 185, 0.1) 0%,
    rgba(249, 131, 58, 0.2) 50%,
    rgba(245, 224, 185, 0.1) 100%
  );
  border-radius: 4px;
  width: 90%;
  animation: shimmer 1.5s infinite;
}

/* === OVERRIDE POUR DASHBOARD === */
.section-content :deep(.base-articles .articles-list) {
  gap: 16px; /* Espacement plus serré pour le dashboard */
}

.section-content :deep(.base-articles .article-card) {
  border: none; /* Pas de bordure supplémentaire car déjà dans BaseCard */
  background: rgba(245, 224, 185, 0.03);
  border-radius: 8px;
}

.section-content :deep(.base-articles .article-title) {
  font-size: 18px; /* Titre plus petit pour le dashboard */
}

.section-content :deep(.base-articles .article-footer) {
  padding-top: 12px; /* Padding plus petit */
}

/* === ANIMATIONS === */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* === RESPONSIVE === */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
  }

  .progress-section {
    grid-column: 1 / -1;
  }

  .stats-cards {
    grid-column: 1 / -1;
  }

  .articles-section {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .calendar-section {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    padding: 20px;
    gap: 16px;
  }

  .cards-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .section-content :deep(.base-articles .article-title) {
    font-size: 16px; /* Encore plus petit sur mobile */
  }
}

@media (max-width: 480px) {
  .dashboard-grid {
    padding: 16px;
  }
}
</style>
