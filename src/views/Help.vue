<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'

// État pour l'onglet actif
const activeTab = ref(null)

// Fonction pour changer d'onglet
function setActiveTab(tab) {
  activeTab.value = activeTab.value === tab ? null : tab
}

// Définition des onglets avec leurs données
const tabs = [
  {
    id: 'crest',
    label: 'Récompenses en Crest',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    data: [
      { keyLevel: 2, inDungeon: 1, inChest: 2, total: 3 },
      { keyLevel: 3, inDungeon: 2, inChest: 3, total: 5 },
      { keyLevel: 4, inDungeon: 3, inChest: 4, total: 7 },
      { keyLevel: 5, inDungeon: 4, inChest: 5, total: 9 },
      { keyLevel: 6, inDungeon: 5, inChest: 6, total: 11 },
      { keyLevel: 7, inDungeon: 6, inChest: 7, total: 13 },
      { keyLevel: 8, inDungeon: 7, inChest: 8, total: 15 },
      { keyLevel: 9, inDungeon: 8, inChest: 9, total: 17 },
      { keyLevel: 10, inDungeon: 9, inChest: 10, total: 19 },
      { keyLevel: 11, inDungeon: 10, inChest: 11, total: 21 },
      { keyLevel: 12, inDungeon: 11, inChest: 12, total: 23 },
      { keyLevel: 13, inDungeon: 12, inChest: 13, total: 25 },
      { keyLevel: 14, inDungeon: 13, inChest: 14, total: 27 },
      { keyLevel: 15, inDungeon: 14, inChest: 15, total: 29 },
      { keyLevel: 16, inDungeon: 15, inChest: 16, total: 31 },
      { keyLevel: 17, inDungeon: 16, inChest: 17, total: 33 },
      { keyLevel: 18, inDungeon: 17, inChest: 18, total: 35 },
      { keyLevel: 19, inDungeon: 18, inChest: 19, total: 37 },
      { keyLevel: 20, inDungeon: 19, inChest: 20, total: 39 },
    ],
    columns: ['Niveau de clef', 'Dans le donjon', 'Dans le coffre', 'Total'],
  },
  {
    id: 'dungeon',
    label: 'Récompenses Donjons',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1',
    data: [
      { level: 'Heroic', loot: 665, vault: 678, crests: 'Weathered' },
      { level: 'Mythic +2', loot: 681, vault: 691, crests: '15 Carved' },
      { level: 'Mythic +3', loot: 684, vault: 694, crests: '12 Runed' },
      { level: 'Mythic +4', loot: 684, vault: 694, crests: '12 Runed' },
      { level: 'Mythic +5', loot: 687, vault: 694, crests: '15 Runed' },
      { level: 'Mythic +6', loot: 690, vault: 694, crests: '10 Gilded' },
      { level: 'Mythic +7', loot: 694, vault: 694, crests: '10 Gilded' },
      { level: 'Mythic +8', loot: 697, vault: 694, crests: '15 Gilded' },
      { level: 'Mythic +9', loot: 700, vault: 707, crests: '15 Gilded' },
      { level: 'Mythic +10', loot: 704, vault: 710, crests: '15 Gilded' },
      { level: 'Mythic +11', loot: 707, vault: 714, crests: '20 Gilded' },
      { level: 'Mythic +12', loot: 710, vault: 717, crests: '20 Gilded' },
    ],
    columns: ['Niveau', 'Butin', 'Coffre hebdo', 'Crests'],
  },
  {
    id: 'raid',
    label: 'Récompenses Raids',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    data: [
      { difficulty: 'LFR', bosses: '1–3', loot: 671, crests: '10 Weathered' },
      { difficulty: 'LFR', bosses: '4–6', loot: 675, crests: '10 Weathered' },
      { difficulty: 'LFR', bosses: '7–8', loot: 678, crests: '15 Weathered' },
      { difficulty: 'Normal', bosses: '1–3', loot: 684, crests: '10 Carved' },
      { difficulty: 'Normal', bosses: '4–6', loot: 688, crests: '10 Carved' },
      { difficulty: 'Normal', bosses: '7–8', loot: 691, crests: '15 Carved' },
      { difficulty: 'Heroic', bosses: '1–3', loot: 694, crests: '10 Runed' },
      { difficulty: 'Heroic', bosses: '4–6', loot: 697, crests: '10 Runed' },
      { difficulty: 'Heroic', bosses: '7–8', loot: 704, crests: '15 Runed' },
      { difficulty: 'Mythic', bosses: '1–3', loot: 710, crests: '10 Gilded' },
      { difficulty: 'Mythic', bosses: '4–6', loot: 714, crests: '10 Gilded' },
      { difficulty: 'Mythic', bosses: '7–8', loot: 717, crests: '15 Gilded' },
    ],
    columns: ['Difficulté', 'Boss', 'Loot', 'Crests'],
  },
  {
    id: 'crafted',
    label: 'Objets Craftés',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
    data: [
      { quality: 1, weathered: 662, spark: 678, runed: 691, gilded: 707 },
      { quality: 2, weathered: 665, spark: 683, runed: 694, gilded: 710 },
      { quality: 3, weathered: 668, spark: 688, runed: 697, gilded: 714 },
      { quality: 4, weathered: 671, spark: 688, runed: 701, gilded: 717 },
      { quality: 5, weathered: 675, spark: 691, runed: 704, gilded: 720 },
    ],
    columns: ['Qualité', 'Weathered', 'Spark', 'Runed', 'Gilded'],
  },
  {
    id: 'upgrade',
    label: "Paliers d'amélioration",
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    data: [
      { itemLevel: 642, crest: 'Explorer 1', tracks: '' },
      { itemLevel: 645, crest: 'Explorer 2', tracks: '' },
      { itemLevel: 652, crest: 'Explorer 4', tracks: '' },
      { itemLevel: 658, crest: 'Explorer 6', tracks: 'Adventurer 2' },
      { itemLevel: 671, crest: 'Weathered', tracks: 'Adventurer 6 / Veteran 2' },
      { itemLevel: 688, crest: 'Carved', tracks: 'Veteran 7 / Champion 3' },
      { itemLevel: 701, crest: 'Runed', tracks: 'Champion 7 / Hero 3' },
      { itemLevel: 717, crest: 'Gilded', tracks: 'Myth 4' },
    ],
    columns: ['iLvl', 'Crest', 'Tracks'],
  },
]
</script>

<template>
  <div class="help-page">
    <div class="help-container">
      <!-- En-tête harmonisé -->
      <div class="help-header">
        <h1 class="page-title">Astuces & Guides</h1>
        <p class="page-subtitle">
          Accédez rapidement aux informations essentielles pour optimiser votre progression
        </p>
      </div>

      <div class="help-content">
        <!-- Navigation par onglets -->
        <section class="tabs-section">
          <BaseCard variant="default" padding="large">
            <h2 class="section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Guides de récompenses
            </h2>
            <p class="section-description">
              Sélectionnez un guide pour afficher les données correspondantes
            </p>

            <!-- Onglets -->
            <div class="tabs-nav">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-button"
                :class="{ active: activeTab === tab.id }"
                @click="setActiveTab(tab.id)"
              >
                <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="tab.icon"
                  />
                </svg>
                <span>{{ tab.label }}</span>
              </button>
            </div>
          </BaseCard>
        </section>

        <!-- Contenu des onglets -->
        <section v-if="activeTab" class="tab-content">
          <BaseCard variant="hover" padding="large">
            <div class="table-header">
              <h3 class="table-title">
                <svg class="table-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="tabs.find(t => t.id === activeTab)?.icon"
                  />
                </svg>
                {{ tabs.find(t => t.id === activeTab)?.label }}
              </h3>

              <!-- Bouton fermer -->
              <button class="close-button" @click="activeTab = null">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th v-for="column in tabs.find(t => t.id === activeTab)?.columns" :key="column">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Tableau Crest -->
                  <template v-if="activeTab === 'crest'">
                    <tr v-for="r in tabs.find(t => t.id === 'crest').data" :key="r.keyLevel">
                      <td class="key-level">{{ r.keyLevel }}</td>
                      <td>{{ r.inDungeon }}</td>
                      <td>{{ r.inChest }}</td>
                      <td class="total-value">{{ r.total }}</td>
                    </tr>
                  </template>

                  <!-- Tableau Donjon -->
                  <template v-if="activeTab === 'dungeon'">
                    <tr v-for="r in tabs.find(t => t.id === 'dungeon').data" :key="r.level">
                      <td class="dungeon-level">{{ r.level }}</td>
                      <td class="loot-value">{{ r.loot }}</td>
                      <td class="vault-value">{{ r.vault }}</td>
                      <td class="crest-value">{{ r.crests }}</td>
                    </tr>
                  </template>

                  <!-- Tableau Raid -->
                  <template v-if="activeTab === 'raid'">
                    <tr
                      v-for="r in tabs.find(t => t.id === 'raid').data"
                      :key="r.difficulty + r.bosses"
                    >
                      <td class="difficulty-value">{{ r.difficulty }}</td>
                      <td>{{ r.bosses }}</td>
                      <td class="loot-value">{{ r.loot }}</td>
                      <td class="crest-value">{{ r.crests }}</td>
                    </tr>
                  </template>

                  <!-- Tableau Crafted -->
                  <template v-if="activeTab === 'crafted'">
                    <tr v-for="r in tabs.find(t => t.id === 'crafted').data" :key="r.quality">
                      <td class="quality-value">{{ r.quality }}</td>
                      <td class="item-level">{{ r.weathered }}</td>
                      <td class="item-level">{{ r.spark }}</td>
                      <td class="item-level">{{ r.runed }}</td>
                      <td class="item-level">{{ r.gilded }}</td>
                    </tr>
                  </template>

                  <!-- Tableau Upgrade -->
                  <template v-if="activeTab === 'upgrade'">
                    <tr v-for="r in tabs.find(t => t.id === 'upgrade').data" :key="r.itemLevel">
                      <td class="item-level">{{ r.itemLevel }}</td>
                      <td class="crest-value">{{ r.crest }}</td>
                      <td class="tracks-value">{{ r.tracks }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </BaseCard>
        </section>

        <!-- État par défaut quand aucun onglet n'est sélectionné -->
        <section v-else class="empty-state-section">
          <BaseCard variant="default" padding="large">
            <div class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3>Sélectionnez un guide</h3>
              <p>Choisissez un guide ci-dessus pour afficher les données correspondantes.</p>
            </div>
          </BaseCard>
        </section>

        <!-- Section FAQ -->
        <section class="faq-section">
          <BaseCard variant="default" padding="large">
            <h2 class="section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Questions fréquentes
            </h2>
            <p class="section-description">Contenu FAQ en cours de développement...</p>
          </BaseCard>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === PAGE HELP === */
.help-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-dark) 0%, #1a1110 100%);
  padding: 32px 0;
}

.help-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

/* === EN-TÊTE HARMONISÉ === */
.help-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(135deg, var(--color-accent), var(--color-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 18px;
  color: var(--color-text-muted);
  margin: 16px 0 0 0;
  line-height: 1.6;
}

/* === CONTENU === */
.help-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* === SECTIONS === */
.tabs-section,
.tab-content,
.empty-state-section,
.faq-section {
  animation: fadeInUp 0.6s ease-out;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.section-icon {
  width: 28px;
  height: 28px;
  color: var(--color-accent);
  flex-shrink: 0;
}

.section-description {
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

/* === NAVIGATION ONGLETS === */
.tabs-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: color-mix(in srgb, var(--color-dark) 60%, transparent);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  text-align: left;
}

.tab-button:hover {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-dark) 80%, transparent);
  transform: translateY(-2px);
}

.tab-button.active {
  border-color: var(--color-orange);
  background: rgba(255, 122, 0, 0.1);
  color: var(--color-orange);
  transform: translateY(-2px);
}

.tab-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* === CONTENU TABLEAU === */
.tab-content {
  animation: slideInUp 0.5s ease-out;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.table-icon {
  width: 24px;
  height: 24px;
  color: var(--color-accent);
  flex-shrink: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 122, 0, 0.1);
  border-color: var(--color-orange);
}

.close-button svg {
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
  transition: color 0.3s ease;
}

.close-button:hover svg {
  color: var(--color-orange);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(43, 27, 24, 0.4);
}

.data-table thead th {
  background: rgba(0, 0, 0, 0.3);
  color: var(--color-accent);
  font-weight: 600;
  padding: 16px 20px;
  text-align: left;
  border-bottom: 2px solid var(--color-border);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table tbody td {
  padding: 14px 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--color-dark) 50%, transparent);
  color: var(--color-text);
  font-size: 15px;
}

.data-table tbody tr:hover {
  background: rgba(255, 122, 0, 0.05);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* === ÉTAT VIDE === */
.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: rgba(255, 122, 0, 0.1);
  border-radius: 50%;
  color: var(--color-orange);
}

.empty-icon svg {
  width: 36px;
  height: 36px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.6;
}

/* === CELLULES SPÉCIALES === */
.key-level,
.total-value,
.loot-value,
.vault-value,
.item-level {
  font-weight: 600;
  color: var(--color-accent);
}

.dungeon-level {
  font-weight: 600;
  color: var(--color-orange);
}

.difficulty-value {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.crest-value {
  color: var(--color-text-muted);
  font-size: 14px;
}

.quality-value {
  font-weight: 700;
  color: var(--color-orange);
  text-align: center;
}

.tracks-value {
  color: var(--color-text-muted);
  font-size: 14px;
}

/* === ANIMATIONS === */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .help-container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .tabs-nav {
    grid-template-columns: 1fr;
  }

  .tab-button {
    padding: 14px 16px;
    font-size: 14px;
  }

  .section-title {
    font-size: 20px;
  }

  .table-title {
    font-size: 18px;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .data-table thead th,
  .data-table tbody td {
    padding: 12px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .help-page {
    padding: 16px 0;
  }

  .page-title {
    font-size: 28px;
  }

  .help-content {
    gap: 24px;
  }

  .tab-button {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    padding: 16px;
  }

  .data-table thead th,
  .data-table tbody td {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
&&&
