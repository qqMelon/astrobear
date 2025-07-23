<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Rechercher...',
  },
  modelValue: {
    type: String,
    default: '',
  },
  // Options de filtres avancés (optionnel)
  showAdvancedFilters: {
    type: Boolean,
    default: false,
  },
  classOptions: {
    type: Array,
    default: () => [],
  },
  raceOptions: {
    type: Array,
    default: () => [],
  },
  realmOptions: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'filter-change'])

// État local
const searchInput = ref(props.modelValue)
const showFilters = ref(false)
const selectedClass = ref('')
const selectedRace = ref('')
const selectedRealm = ref('')

// Computed pour la valeur de recherche
const searchValue = computed({
  get: () => searchInput.value,
  set: value => {
    searchInput.value = value
    emit('update:modelValue', value)
    emitFilterChange()
  },
})

// Fonction pour émettre les changements de filtre
function emitFilterChange() {
  emit('filter-change', {
    search: searchInput.value,
    class: selectedClass.value,
    race: selectedRace.value,
    realm: selectedRealm.value,
  })
}

// Watchers pour les filtres avancés
watch([selectedClass, selectedRace, selectedRealm], () => {
  emitFilterChange()
})

// Fonction pour réinitialiser les filtres
function clearFilters() {
  searchInput.value = ''
  selectedClass.value = ''
  selectedRace.value = ''
  selectedRealm.value = ''
  emit('update:modelValue', '')
  emitFilterChange()
}

// Fonction pour basculer l'affichage des filtres avancés
function toggleAdvancedFilters() {
  showFilters.value = !showFilters.value
}

// Computed pour savoir si des filtres sont actifs
const hasActiveFilters = computed(() => {
  return searchInput.value || selectedClass.value || selectedRace.value || selectedRealm.value
})
</script>

<template>
  <div class="base-filter">
    <!-- Barre de recherche principale -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input v-model="searchValue" type="text" :placeholder="placeholder" class="search-input" />

        <!-- Bouton pour effacer -->
        <button
          v-if="hasActiveFilters"
          class="clear-button"
          title="Effacer les filtres"
          @click="clearFilters"
        >
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

      <!-- Bouton filtres avancés (si activé) -->
      <button
        v-if="showAdvancedFilters"
        class="filter-toggle"
        :class="{ 'filter-toggle-active': showFilters }"
        title="Filtres avancés"
        @click="toggleAdvancedFilters"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
          />
        </svg>
        <span v-if="hasActiveFilters" class="filter-count">{{
          [selectedClass, selectedRace, selectedRealm].filter(Boolean).length
        }}</span>
      </button>
    </div>

    <!-- Filtres avancés (si activés et visibles) -->
    <div v-if="showAdvancedFilters && showFilters" class="advanced-filters">
      <div class="filters-grid">
        <!-- Filtre par classe -->
        <div v-if="classOptions.length" class="filter-group">
          <label class="filter-label">Classe</label>
          <select v-model="selectedClass" class="filter-select">
            <option value="">Toutes les classes</option>
            <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
              {{ classOption }}
            </option>
          </select>
        </div>

        <!-- Filtre par race -->
        <div v-if="raceOptions.length" class="filter-group">
          <label class="filter-label">Race</label>
          <select v-model="selectedRace" class="filter-select">
            <option value="">Toutes les races</option>
            <option v-for="raceOption in raceOptions" :key="raceOption" :value="raceOption">
              {{ raceOption }}
            </option>
          </select>
        </div>

        <!-- Filtre par royaume -->
        <div v-if="realmOptions.length" class="filter-group">
          <label class="filter-label">Royaume</label>
          <select v-model="selectedRealm" class="filter-select">
            <option value="">Tous les royaumes</option>
            <option v-for="realmOption in realmOptions" :key="realmOption" :value="realmOption">
              {{ realmOption }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === CONTAINER PRINCIPAL === */
.base-filter {
  width: 100%;
}

/* === BARRE DE RECHERCHE === */
.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 12px 16px 12px 48px;
  background: rgba(43, 27, 24, 0.6);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-light);
  font-size: 16px;
  font-family: inherit;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-orange);
  background: rgba(43, 27, 24, 0.8);
  box-shadow: 0 0 0 4px rgba(249, 131, 58, 0.1);
}

.search-input::placeholder {
  color: var(--color-gray);
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: var(--color-gray);
  pointer-events: none;
}

.clear-button {
  position: absolute;
  right: 12px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: var(--color-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: var(--color-orange);
  background: rgba(249, 131, 58, 0.1);
}

.clear-button svg {
  width: 16px;
  height: 16px;
}

/* === BOUTON FILTRES AVANCÉS === */
.filter-toggle {
  position: relative;
  height: 48px;
  padding: 12px 16px;
  background: rgba(43, 27, 24, 0.6);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.filter-toggle:hover,
.filter-toggle-active {
  border-color: var(--color-orange);
  color: var(--color-orange);
  background: rgba(43, 27, 24, 0.8);
}

.filter-toggle svg {
  width: 20px;
  height: 20px;
}

.filter-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--color-orange);
  color: var(--color-light);
  font-size: 11px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-bg);
}

/* === FILTRES AVANCÉS === */
.advanced-filters {
  margin-top: 16px;
  padding: 20px;
  background: rgba(43, 27, 24, 0.4);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-light);
}

.filter-select {
  height: 40px;
  padding: 8px 12px;
  background: rgba(43, 27, 24, 0.6);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-light);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-orange);
  box-shadow: 0 0 0 2px rgba(249, 131, 58, 0.1);
}

.filter-select option {
  background: var(--color-dark);
  color: var(--color-light);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    gap: 12px;
  }

  .filter-toggle {
    width: 100%;
    justify-content: center;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .search-input {
    font-size: 16px; /* Évite le zoom sur iOS */
  }
}
</style>
