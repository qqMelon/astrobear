<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

import CharacterCard from '@/components/CharacterCard.vue'

import { getValidBattlenetToken } from '@/helpers/battlenetToken'

const authStore = useAuthStore()
const router = useRouter()

const token = getValidBattlenetToken()

const authToken = authStore.token || localStorage.getItem('astrobear-user-token')
const bnetLinked = ref(false)
const characters = ref([])
const isLoading = ref(false)
const error = ref(null)
const selectedChar = ref(null)
const alreadyCalled = ref(false)

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

  try {
    const data = await pullFromDirectus()
    if ((data.data && data.data.length > 0) || !token) {
      console.log('chars data exist from Directus')
      characters.value = data.data
    } else {
      console.log('chars data doesnt exist, pull from Blizzard API')
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
    `/items/wow_characters?filter[user][_eq]=${
authStore.user.id
}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error('Erreur lors du chargement des personnages depuis Directus.')
  }

  return await res.json()
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
  return data.wow_accounts[0].characters.map(char => ({
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

const setAsMainCharacter = async function (char) {
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

    console.log(`✅ ${
char.name
} est maintenant le personnage principal.`)
  } catch (err) {
    console.error('❌ Erreur lors de la définition du personnage principal:', err)
  }
}

const sortedCharacters = computed(() => [...characters.value].sort((a, b) => b.level - a.level))

onMounted(() => {
  if (token) bnetLinked.value = true
  loadChars()
})
</script>

<template>
  <main class="uk-container uk-margin-top">
    <div v-if="!bnetLinked">
      Votre compte n'est pas lié à Battle.net
      <button class="uk-button uk-button-primary" @click="router.push({ name: 'user-settings' })">
        Recupéré un jeton Blizzard
      </button>
    </div>

    <div v-else>
      <button class="uk-button uk-button-primary" @click="syncCharacters">
        {{
        !alreadyCalled
        ? 'Synchroniser mes personnages'
        : 'Patientez avant de relancer une synchronisation'
        }}
      </button>
      <div class="uk-grid-large" uk-grid>
        <!-- Liste des persos -->
        <div class="uk-width-1-2@s">
          <h3>Vos personnages</h3>
          <div v-if="sortedCharacters.length === 0">Aucun personnage trouvé.</div>
          <div class="uk-grid-small" uk-grid>
            <CharacterCard
              v-for="char in sortedCharacters"
              :key="char.char_id"
              :character="char"
              :class=" {
                'uk-card-primary': selectedChar?.char_id === char.char_id,
              }"
              style="      cursor: pointer"
              @click="selectedChar = char"
            />
          </div>
        </div>

        <!-- Détails à droite -->
        <div class="uk-width-1-2@s">
          <transition name="fade">
            <div v-if="selectedChar">
              <h3>Détails du personnage</h3>
              <div class="uk-card uk-card-default uk-card-body">
                <div class="uk-card uk-card-default uk-card-body">
                  <p><strong>Nom :</strong> {{ selectedChar.name }}</p>
                  <p><strong>Niveau :</strong> {{ selectedChar.level }}</p>
                  <p><strong>Classe :</strong> {{ selectedChar.class }}</p>
                  <p><strong>Race :</strong> {{ selectedChar.race }}</p>
                  <p><strong>Royaume :</strong> {{ selectedChar.realm }}</p>
                  <p>
                    <strong>Statut :</strong>
                    <span v-if="selectedChar.is_main">Personnage principal ✅</span>
                  </p>

                  <button
                    v-if="!selectedChar.is_main"
                    class="uk-button uk-button-secondary uk-margin-top"
                    @click="setAsMainCharacter(selectedChar)"
                  >
                    Définir comme personnage principal
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Sélectionnez un personnage pour voir les détails.</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </main>
</template>
