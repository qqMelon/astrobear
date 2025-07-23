<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

import CharacterCard from '@/components/CharacterCard.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseFilter from '@/components/ui/BaseFilter.vue'

import { getValidBattlenetToken } from '@/helpers/battlenetToken'

const authStore = useAuthStore()
const token = getValidBattlenetToken()
const authToken = authStore.token || localStorage.getItem('astrobear-user-token')
const bnetLinked = ref(false)
const characters = ref([])
const isLoading = ref(false)
const error = ref(null)
const selectedChar = ref(null)
const alreadyCalled = ref(false)

// 🔍 État du filtre
const searchQuery = ref('')

// Couleurs des classes WoW
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

// Solution finale : Avatar stylisé avec couleur de classe
const getCharacterAvatar = (character, size = 'avatar') => {
  if (!character?.name) {
    return `https://ui-avatars.com/api/?name=WoW&size=120&background=2B1B18&color=F5E0B9&bold=true&format=png&font-size=0.5`
  }

  const name = character.name
  const classColor = getClassColor(character.class)?.replace('#', '') || 'C79C6E'
  const avatarSize = size === 'main' ? '120' : size === 'large' ? '80' : '64'

  // Créer des initiales stylées
  let initials = ''
  if (name.length >= 2) {
    initials = name.substring(0, 2).toUpperCase()
  } else {
    initials = name.charAt(0).toUpperCase()
  }

  // Avatar avec la couleur de classe et style WoW
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${avatarSize}&background=${classColor}&color=000000&bold=true&format=png&font-size=0.4&length=2&rounded=false`
}

// Fonction alternative avec des dégradés plus jolis
const getCharacterAvatarGradient = (character, size = 'avatar') => {
  if (!character?.name) {
    return `https://ui-avatars.com/api/?name=WoW&size=120&background=gradient&color=F5E0B9&bold=true&format=png`
  }

  const name = character.name
  const avatarSize = size === 'main' ? '120' : size === 'large' ? '80' : '64'

  // Choisir une couleur de fond basée sur la classe
  const classBackgrounds = {
    Guerrier: 'C79C6E',
    Paladin: 'F58CBA',
    Chasseur: 'ABD473',
    Voleur: 'FFF569',
    Prêtre: 'FFFFFF',
    'Chevalier de la mort': 'C41F3B',
    Chaman: '0070DE',
    Mage: '69CCF0',
    Démoniste: '9482C9',
    Moine: '00FF96',
    Druide: 'FF7D0A',
    'Chasseur de démons': 'A330C9',
    Évocateur: '33937F',
  }

  const bgColor = classBackgrounds[character.class] || '2B1B18'
  const textColor = ['Prêtre', 'Voleur'].includes(character.class) ? '000000' : 'FFFFFF'

  const initials =
    name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.charAt(0).toUpperCase()

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${avatarSize}&background=${bgColor}&color=${textColor}&bold=true&format=png&font-size=0.4&length=2&rounded=true`
}

// Gestion d'erreur
const handleImageError = (event, character) => {
  console.warn('⚠️ Erreur chargement avatar pour:', character?.name)
  // Fallback simple et fiable
  const fallbackColor = '2B1B18'
  const initial = character?.name?.charAt(0)?.toUpperCase() || 'W'
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&size=120&background=${fallbackColor}&color=F5E0B9&bold=true&format=png&font-size=0.6`
}

const handleImageLoad = (event, character) => {
  console.log('✅ Avatar chargé pour:', character?.name)
}

// 🔍 Logique de filtrage
const filteredCharacters = computed(() => {
  if (!searchQuery.value.trim()) {
    return sortedCharacters.value
  }

  const query = searchQuery.value.toLowerCase().trim()

  return sortedCharacters.value.filter(character => {
    return (
      character.name?.toLowerCase().includes(query) ||
      character.realm?.toLowerCase().includes(query) ||
      character.class?.toLowerCase().includes(query) ||
      character.race?.toLowerCase().includes(query)
    )
  })
})

const syncCharacters = async function () {
  if (alreadyCalled.value === true) return

  const updateCharList = await pullFromBlizzard()
  const { toCreate, toUpdate } = mergeCharacters(updateCharList, characters.value)

  await syncToDirectus(toCreate, toUpdate)

  characters.value = updateCharList
  alreadyCalled.value = true
  setTimeout(() => {
    alreadyCalled.value = false
  }, 15000)
}

const loadChars = async function () {
  isLoading.value = true
  error.value = null

  if (!token) {
    error.value = 'Token Battlenet invalide ou expiré.'
    isLoading.value = false
    return
  }

  try {
    const data = await pullFromDirectus()
    if (data.data && data.data.length > 0) {
      console.log('📦 Personnages chargés depuis Directus')
      characters.value = data.data
    } else {
      console.log('🔄 Récupération depuis Blizzard API')
      const toUpload = await pullFromBlizzard()
      await uploadToDirectus(toUpload)
      characters.value = toUpload
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
    alreadyCalled.value = true
    setTimeout(() => {
      alreadyCalled.value = false
    }, 15000)
  }
}

const pullFromDirectus = async function () {
  const res = await fetch(
    import.meta.env.VITE_BACKEND_BASE_URL +
      `/items/wow_characters?filter[user][_eq]=${authStore.user.id}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error('Erreur lors du chargement des personnages depuis Directus.')
  }

  const data = await res.json()
  return data
}

const pullFromBlizzard = async function () {
  const res = await fetch(
    'https://eu.api.blizzard.com/profile/user/wow?namespace=profile-eu&local=fr_FR',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error('Impossible de charger les personnages.')
  }

  const data = await res.json()
  const formattedData = data.wow_accounts[0].characters.map(char => ({
    char_id: char.id,
    name: char.name,
    level: char.level,
    realm: char.realm.name.fr_FR,
    class: char.playable_class.name.fr_FR,
    race: char.playable_race.name.fr_FR,
    faction: char.faction.name.fr_FR,
    is_main: false,
    href: char.character.href,
    user: authStore.user.id,
  }))

  return formattedData
}

const syncToDirectus = async function (toCreate, toUpdate) {
  try {
    if (toCreate.length > 0) {
      const resCreate = await fetch(
        import.meta.env.VITE_BACKEND_BASE_URL + '/items/wow_characters?batch=all',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toCreate),
        }
      )

      if (!resCreate.ok) {
        const err = await resCreate.json()
        throw new Error(err.error?.message || 'Erreur création Directus')
      }
    }

    if (toUpdate.length > 0) {
      const resUpdate = await fetch(
        import.meta.env.VITE_BACKEND_BASE_URL + '/items/wow_characters?batch=all',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toUpdate),
        }
      )

      if (!resUpdate.ok) {
        const err = await resUpdate.json()
        throw new Error(err.error?.message || 'Erreur mise à jour Directus')
      }
    }
  } catch (err) {
    console.error('❌ Erreur synchro Directus:', err)
  }
}

const uploadToDirectus = async function (charactersList) {
  try {
    const res = await fetch(
      import.meta.env.VITE_BACKEND_BASE_URL + '/items/wow_characters?batch=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(charactersList),
      }
    )

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Erreur Directus')
  } catch (err) {
    console.error('❌ Erreur de synchro Directus: ', err)
  }
}

const mergeCharacters = function (blizzardChars, existingChar) {
  const toCreate = []
  const toUpdate = []

  for (const char of blizzardChars) {
    const match = existingChar.find(c => c.char_id === char.char_id)

    if (!match) {
      toCreate.push(char)
    } else {
      const hasChanged =
        char.level !== match.level ||
        char.realm !== match.realm ||
        char.race !== match.race ||
        char.name !== match.name

      if (hasChanged) {
        toUpdate.push({
          ...match,
          ...char,
          id: match.id,
        })
      }
    }
  }

  return { toCreate, toUpdate }
}

const setAsMainCharacter = async char => {
  if (!char || !authToken) return

  try {
    const updates = characters.value.map(c => ({
      id: c.id,
      is_main: c.id === char.id,
    }))

    const res = await fetch(
      import.meta.env.VITE_BACKEND_BASE_URL + '/items/wow_characters?batch=all',
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.message || 'Erreur lors de la mise à jour')
    }

    characters.value = characters.value.map(c => ({
      ...c,
      is_main: c.id === char.id,
    }))
    selectedChar.value = { ...char, is_main: true }

    console.log(`✅ ${char.name} est maintenant le personnage principal.`)
  } catch (err) {
    console.error('❌ Erreur lors de la définition du personnage principal:', err)
  }
}

const sortedCharacters = computed(() => [...characters.value].sort((a, b) => b.level - a.level))

// 🧹 Fonction pour nettoyer la recherche
const clearSearch = () => {
  searchQuery.value = ''
}

onMounted(() => {
  if (token) bnetLinked.value = true
  loadChars()
})
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- En-tête -->
      <div class="profile-header">
        <h1 class="page-title">Mes Personnages</h1>
        <p class="page-subtitle">
          Gérez vos personnages World of Warcraft et définissez votre main
        </p>
      </div>

      <!-- État non lié -->
      <BaseCard v-if="!bnetLinked" variant="hover" padding="large">
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3>Compte Battle.net non lié</h3>
          <p>Vous devez lier votre compte Battle.net pour synchroniser vos personnages.</p>
          <BaseButton variant="battlenet" disabled> Lier votre compte Battle.net </BaseButton>
        </div>
      </BaseCard>

      <!-- Interface principale -->
      <div v-else class="profile-content">
        <!-- Bouton de synchronisation -->
        <div class="sync-section">
          <BaseButton
            variant="primary"
            :loading="isLoading"
            :disabled="alreadyCalled"
            @click="syncCharacters"
          >
            <svg
              v-if="!isLoading && !alreadyCalled"
              class="button-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{
              isLoading
                ? 'Synchronisation...'
                : alreadyCalled
                  ? 'Patientez avant de relancer'
                  : 'Synchroniser mes personnages'
            }}
          </BaseButton>
        </div>

        <!-- Erreur -->
        <BaseCard v-if="error" variant="default" padding="default">
          <div class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ error }}</span>
          </div>
        </BaseCard>

        <!-- Layout principal -->
        <div class="characters-layout">
          <!-- Liste des personnages -->
          <div class="characters-list">
            <BaseCard variant="default" padding="large">
              <div class="characters-header">
                <h2 class="section-title">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Vos personnages ({{ filteredCharacters.length }}/{{ sortedCharacters.length }})
                </h2>

                <!-- 🔍 Barre de recherche -->
                <div class="search-section">
                  <BaseFilter
                    v-model="searchQuery"
                    placeholder="Rechercher par nom, royaume, classe, race..."
                    variant="default"
                    :disabled="isLoading || sortedCharacters.length === 0"
                    @clear="clearSearch"
                  />

                  <!-- Indicateur de recherche active -->
                  <div
                    v-if="searchQuery && filteredCharacters.length !== sortedCharacters.length"
                    class="search-info"
                  >
                    <svg
                      class="search-info-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span
                      >{{ filteredCharacters.length }} résultat{{
                        filteredCharacters.length > 1 ? 's' : ''
                      }}
                      pour "{{ searchQuery }}"</span
                    >
                  </div>
                </div>
              </div>

              <!-- État vide -->
              <div v-if="sortedCharacters.length === 0 && !isLoading" class="empty-characters">
                <div class="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3>Aucun personnage trouvé</h3>
                <p>Cliquez sur "Synchroniser" pour charger vos personnages depuis Battle.net.</p>
              </div>

              <!-- Aucun résultat de recherche -->
              <div
                v-else-if="filteredCharacters.length === 0 && searchQuery"
                class="empty-characters"
              >
                <div class="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3>Aucun personnage trouvé</h3>
                <p>Aucun personnage ne correspond à votre recherche "{{ searchQuery }}".</p>
                <BaseButton variant="secondary" @click="clearSearch">
                  Effacer la recherche
                </BaseButton>
              </div>

              <!-- 🔧 Liste des cartes - CORRECTIF ALIGNEMENT -->
              <div v-else class="characters-grid">
                <CharacterCard
                  v-for="char in filteredCharacters"
                  :key="char.char_id"
                  :character="char"
                  :selected="selectedChar?.char_id === char.char_id"
                  variant="default"
                  size="medium"
                  @click="selectedChar = char"
                  @set-main="setAsMainCharacter"
                />
              </div>
            </BaseCard>
          </div>

          <!-- Détails du personnage -->
          <div class="character-details">
            <BaseCard variant="default" padding="large">
              <transition name="fade" mode="out-in">
                <!-- Personnage sélectionné -->
                <div v-if="selectedChar" key="selected">
                  <h2 class="section-title">
                    <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Détails du personnage
                  </h2>

                  <div class="character-profile">
                    <!-- Avatar principal -->
                    <div class="profile-avatar">
                      <img
                        :src="getCharacterAvatarGradient(selectedChar, 'main')"
                        :alt="selectedChar.name"
                        class="profile-image"
                        @error="e => handleImageError(e, selectedChar)"
                        @load="e => handleImageLoad(e, selectedChar)"
                      />

                      <div class="profile-level">{{ selectedChar.level }}</div>

                      <!-- Badge Main si applicable -->
                      <div v-if="selectedChar.is_main" class="profile-main-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Main
                      </div>

                      <!-- Badge classe -->
                      <div class="profile-class-badge">
                        {{ selectedChar.class }}
                      </div>
                    </div>

                    <!-- Informations détaillées -->
                    <div class="profile-info">
                      <div class="info-row">
                        <span class="info-label">
                          <svg
                            class="info-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Nom
                        </span>
                        <span
                          class="info-value character-name"
                          :style="{ color: getClassColor(selectedChar.class) }"
                        >
                          {{ selectedChar.name }}
                        </span>
                      </div>

                      <div class="info-row">
                        <span class="info-label">
                          <svg
                            class="info-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Niveau
                        </span>
                        <span class="info-value level-value">{{ selectedChar.level }}</span>
                      </div>

                      <div class="info-row">
                        <span class="info-label">
                          <svg
                            class="info-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Classe
                        </span>
                        <span
                          class="info-value class-value"
                          :style="{ color: getClassColor(selectedChar.class) }"
                        >
                          {{ selectedChar.class }}
                        </span>
                      </div>

                      <div class="info-row">
                        <span class="info-label">
                          <svg
                            class="info-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          Race
                        </span>
                        <span class="info-value">{{ selectedChar.race }}</span>
                      </div>

                      <div class="info-row">
                        <span class="info-label">
                          <svg
                            class="info-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                            />
                          </svg>
                          Royaume
                        </span>
                        <span class="info-value">{{ selectedChar.realm }}</span>
                      </div>

                      <div class="info-row">
                        <span class="info-label">
                          <svg
                            class="info-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                          Statut
                        </span>
                        <span v-if="selectedChar.is_main" class="info-value main-status">
                          <svg
                            class="status-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Personnage principal
                        </span>
                        <span v-else class="info-value secondary-status"
                          >Personnage secondaire</span
                        >
                      </div>
                    </div>

                    <!-- Action -->
                    <div v-if="!selectedChar.is_main" class="profile-actions">
                      <BaseButton
                        variant="success"
                        full-width
                        @click="setAsMainCharacter(selectedChar)"
                      >
                        <svg
                          class="button-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Définir comme personnage principal
                      </BaseButton>
                    </div>
                  </div>
                </div>

                <!-- État par défaut -->
                <div v-else key="empty" class="select-character">
                  <div class="select-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3>Sélectionnez un personnage</h3>
                  <p>Cliquez sur l'un de vos personnages pour voir ses détails et le gérer.</p>
                </div>
              </transition>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-dark) 0%, #1a1110 100%);
  padding: 32px 0;
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

/* === EN-TÊTE === */
.profile-header {
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
  color: var(--color-gray);
  margin: 16px 0 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 🔧 === CORRECTIONS ALIGNEMENT - SECTION SYNCHRONISATION === */
.sync-section {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.button-icon {
  width: 18px;
  height: 18px;
}

/* === ERREURS === */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ef4444;
  font-weight: 500;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 🔧 === CORRECTIONS ALIGNEMENT - LAYOUT === */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.characters-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

/* 🔧 === CORRECTIONS ALIGNEMENT - CONTENEUR LISTE DES PERSONNAGES === */
.characters-list {
  width: 100%;
  min-width: 0; /* Permet au conteneur de rétrécir si nécessaire */
  overflow: hidden; /* Empêche le débordement */
}

/* 🔧 === CORRECTIONS ALIGNEMENT - BASECARD DANS LA LISTE === */
.characters-list :deep(.base-card) {
  width: 100%;
  box-sizing: border-box;
}

/* 🔧 === CORRECTIONS ALIGNEMENT - HEADER PERSONNAGES AVEC RECHERCHE === */
.characters-header {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}

.search-section {
  margin-top: 20px;
  width: 100%;
}

/* 🔧 Force le BaseFilter à prendre toute la largeur */
.search-section :deep(.base-filter) {
  width: 100%;
  box-sizing: border-box;
}

.search-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(249, 131, 58, 0.1);
  border-radius: 8px;
  color: var(--color-orange);
  font-size: 14px;
}

.search-info-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* === SECTIONS === */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  color: var(--color-light);
  margin: 0;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: var(--color-orange);
}

/* 🔧 === CORRECTIONS ALIGNEMENT - GRILLE DES PERSONNAGES === */
.characters-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  align-items: stretch; /* Force tous les enfants à prendre la même largeur */
}

/* 🔧 Force chaque CharacterCard à s'aligner parfaitement */
.characters-grid > * {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
}

/* === ÉTATS VIDES === */
.empty-characters,
.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon,
.select-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  color: var(--color-gray);
}

.empty-characters h3,
.empty-state h3,
.select-character h3 {
  font-size: 20px;
  color: var(--color-light);
  margin: 0 0 8px;
}

.empty-characters p,
.empty-state p,
.select-character p {
  color: var(--color-gray);
  margin: 0 0 24px;
}

/* === DÉTAILS DU PERSONNAGE === */
.character-details {
  width: 100%;
  min-width: 0;
  max-width: 400px; /* 🔧 Empêche l'expansion */
}

.character-profile {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid var(--color-border);
  background: var(--color-dark);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.profile-level {
  position: absolute;
  bottom: -8px;
  right: 50%;
  transform: translateX(50%);
  background: linear-gradient(135deg, var(--color-accent), var(--color-orange));
  color: var(--color-light);
  font-size: 16px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
  border: 2px solid var(--color-dark);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.profile-main-badge {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-green);
  color: var(--color-light);
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  border: 2px solid var(--color-dark);
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.profile-main-badge svg {
  width: 12px;
  height: 12px;
}

.profile-class-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(43, 27, 24, 0.9);
  color: var(--color-light);
  padding: 4px 8px;
  border-radius: 8px;
  border: 2px solid var(--color-border);
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-gray);
  font-weight: 500;
}

.info-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-light);
}

.character-name {
  font-size: 18px;
  font-weight: bold;
}

.level-value {
  background: linear-gradient(135deg, var(--color-accent), var(--color-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}

.main-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-green);
}

.status-icon {
  width: 14px;
  height: 14px;
}

.secondary-status {
  color: var(--color-gray);
}

.profile-actions {
  padding-top: 8px;
}

/* === TRANSITIONS === */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 🔧 === CORRECTIONS ALIGNEMENT - RESPONSIVE === */
@media (max-width: 1200px) {
  .characters-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  /* 🔧 En responsive, tout prend la largeur complète */
  .characters-list,
  .character-details {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 0 20px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .search-section {
    margin-top: 16px;
  }

  .characters-header {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 20px;
  }

  .profile-image {
    width: 100px;
    height: 100px;
  }

  .profile-level {
    font-size: 14px;
    padding: 2px 8px;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .empty-characters,
  .empty-state {
    padding: 32px 16px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 16px 0;
  }

  .info-value {
    align-self: flex-end;
  }
}
</style>
