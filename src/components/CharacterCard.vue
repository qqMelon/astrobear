<script setup>
const props = defineProps({
  // Données du personnage (requis)
  character: {
    type: Object,
    required: true,
  },

  // État de sélection
  selected: {
    type: Boolean,
    default: false,
  },

  // Variantes d'affichage
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'compact', 'detailed'].includes(value),
  },

  // Taille
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value),
  },

  // Interactivité
  clickable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click', 'set-main'])

// Couleurs des classes WoW (officielles Blizzard)
const classColors = {
  Guerrier: '#C79C6E',
  Paladin: '#F58CBA',
  Chasseur: '#ABD473',
  Voleur: '#FFF569',
  Prêtre: '#FFFFFF',
  'Chevalier de la mort': '#C41F3B',
  Chaman: '#0070DE',
  Mage: '#69CCF0',
  Démoniste: '#9482C9',
  Moine: '#00FF96',
  Druide: '#FF7D0A',
  'Chasseur de démons': '#A330C9',
  Évocateur: '#33937F',
}

const getClassColor = className => classColors[className] || '#FFFFFF'

// Avatar du personnage via l'API Blizzard
const getCharacterAvatar = (character, size = 'avatar') => {
  if (!character?.name || !character?.realm) return null
  // Formats: avatar (64x64), inset (84x84), main (456x456)
  return `https://render.worldofwarcraft.com/eu/character/${character.realm.toLowerCase().replace(/[^a-z0-9]/g, '')}/${character.name.toLowerCase()}/${size}.jpg`
}

// Gestion des clics
const handleClick = () => {
  if (props.clickable) {
    emit('click', props.character)
  }
}

const handleSetMain = event => {
  event.stopPropagation()
  emit('set-main', props.character)
}
</script>

<template>
  <div
    :class="[
      'character-card',
      `character-card--${variant}`,
      `character-card--${size}`,
      {
        'character-card--selected': selected,
        'character-card--clickable': clickable,
      },
    ]"
    @click="handleClick"
  >
    <!-- Version DEFAULT (liste, sélection) -->
    <template v-if="variant === 'default'">
      <!-- Avatar avec niveau -->
      <div class="card-avatar">
        <img
          :src="getCharacterAvatar(character, 'avatar')"
          :alt="character.name"
          class="avatar-image"
          @error="$event.target.src = 'https://via.placeholder.com/64x64/2B1B18/F5E0B9?text=WoW'"
        />
        <div class="level-badge">{{ character.level }}</div>
      </div>

      <!-- Informations principales -->
      <div class="card-content">
        <div class="character-header">
          <h4 class="character-name" :style="{ color: getClassColor(character.class) }">
            {{ character.name }}
          </h4>

          <!-- Badge Main -->
          <div v-if="character.is_main" class="main-badge" title="Personnage principal">
            ⭐ Main
          </div>
        </div>

        <div class="character-details">
          <span class="character-class" :style="{ color: getClassColor(character.class) }">
            {{ character.class }}
          </span>
          <span class="separator">•</span>
          <span class="character-race">{{ character.race }}</span>
        </div>

        <div class="character-realm">
          <svg class="realm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
            />
          </svg>
          {{ character.realm }}
        </div>
      </div>

      <!-- Indicateur de sélection -->
      <div v-if="selected" class="selection-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </template>

    <!-- Version COMPACT (dashboard, widget) -->
    <template v-else-if="variant === 'compact'">
      <div class="compact-avatar">
        <img
          :src="getCharacterAvatar(character, 'avatar')"
          :alt="character.name"
          class="compact-image"
          @error="$event.target.src = 'https://via.placeholder.com/48x48/2B1B18/F5E0B9?text=WoW'"
        />
        <div class="compact-level">{{ character.level }}</div>
      </div>

      <div class="compact-info">
        <div class="compact-name" :style="{ color: getClassColor(character.class) }">
          {{ character.name }}
        </div>
        <div class="compact-class" :style="{ color: getClassColor(character.class) }">
          {{ character.class }}
        </div>
      </div>
    </template>

    <!-- Version DETAILED (profil complet) -->
    <template v-else-if="variant === 'detailed'">
      <div class="detailed-header">
        <img
          :src="getCharacterAvatar(character, 'main')"
          :alt="character.name"
          class="detailed-image"
          @error="$event.target.src = 'https://via.placeholder.com/120x120/2B1B18/F5E0B9?text=WoW'"
        />
        <div class="detailed-info">
          <h3 class="detailed-name" :style="{ color: getClassColor(character.class) }">
            {{ character.name }}
          </h3>
          <div class="detailed-stats">
            <div class="stat-item">
              <span class="stat-label">Niveau</span>
              <span class="stat-value">{{ character.level }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Classe</span>
              <span class="stat-value" :style="{ color: getClassColor(character.class) }">
                {{ character.class }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Race</span>
              <span class="stat-value">{{ character.race }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Royaume</span>
              <span class="stat-value">{{ character.realm }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions pour version détaillée -->
      <div v-if="!character.is_main" class="detailed-actions">
        <button class="set-main-btn" @click="handleSetMain">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Définir comme principal
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* === BASE === */
.character-card {
  position: relative;
  background: rgba(43, 27, 24, 0.8);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
}

.character-card--clickable {
  cursor: pointer;
}

.character-card--clickable:hover {
  border-color: var(--color-orange);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.character-card--selected {
  border-color: var(--color-accent);
  background: rgba(249, 131, 58, 0.1);
  box-shadow: 0 4px 15px rgba(249, 131, 58, 0.2);
}

/* === TAILLES === */
.character-card--small {
  padding: 12px;
}

.character-card--medium {
  padding: 16px;
}

.character-card--large {
  padding: 24px;
}

/* === VARIANT DEFAULT === */
.character-card--default {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%; /* 👈 FIX : Force la largeur complète */
}

.card-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid var(--color-border);
  background: var(--color-dark);
}

.level-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--color-accent);
  color: var(--color-light);
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  min-width: 24px;
  text-align: center;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.character-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.character-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1f2937;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 6px;
  flex-shrink: 0;
}

.character-details {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.character-class {
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.separator {
  color: var(--color-gray);
}

.character-race {
  color: var(--color-gray);
}

.character-realm {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-gray);
}

.realm-icon {
  width: 14px;
  height: 14px;
}

.selection-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-light);
}

.selection-indicator svg {
  width: 14px;
  height: 14px;
}

/* === VARIANT COMPACT === */
.character-card--compact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.compact-avatar {
  position: relative;
  flex-shrink: 0;
}

.compact-image {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.compact-level {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: var(--color-accent);
  color: var(--color-light);
  font-size: 10px;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
}

.compact-info {
  flex: 1;
}

.compact-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.compact-class {
  font-size: 12px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* === VARIANT DETAILED === */
.character-card--detailed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detailed-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.detailed-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid var(--color-border);
  flex-shrink: 0;
}

.detailed-info {
  flex: 1;
}

.detailed-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.detailed-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.stat-label {
  color: var(--color-gray);
  font-weight: 500;
}

.stat-value {
  color: var(--color-light);
  font-weight: 600;
}

.detailed-actions {
  padding-top: 8px;
}

.set-main-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: var(--color-light);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.set-main-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.set-main-btn svg {
  width: 16px;
  height: 16px;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .character-card--default {
    gap: 12px;
  }

  .avatar-image {
    width: 48px;
    height: 48px;
  }

  .character-name {
    font-size: 16px;
  }

  .detailed-header {
    flex-direction: column;
    text-align: center;
  }

  .detailed-image {
    align-self: center;
  }
}

@media (max-width: 480px) {
  .character-card--medium,
  .character-card--large {
    padding: 12px;
  }

  .character-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .separator {
    display: none;
  }
}
</style>
