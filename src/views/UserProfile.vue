<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

import CharacterCard from '@/components/CharacterCard.vue'

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

const syncCharacters = async function () {
  if (alreadyCalled.value === true) return
  console.log('To update')
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
    let res = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + `/items/wow_characters?filter[user][_eq]=${
authStore.user.id
}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )

    if (!res.ok) throw new Error('Erreur lors du chargement des personnages depuis Directus.')

    console.log('chars data exist from Directus')

    let data = await res.json()

    if (data.data && data.data.length > 0) {
      characters.value = data.data
    } else {
      console.log('chars data doesnt exist, pull from Blizzard API')
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
      const formattedData = data.wow_accounts[0].characters.map((char) => ({
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

      await uploadToDirectus(formattedData)
      characters.value = formattedData
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

const uploadToDirectus = async function (charactersList) {
  try {
    const res = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/items/wow_characters?batch=all', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(charactersList)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Erreur Directus')
  } catch (err) {
    console.error('❌ Erreur de synchro Directus: ', err)
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
      <button class="uk-button uk-button-primary uk-button-disable" @click="syncCharacters">
        Votre compte n'est pas lié à Battle.net
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
                'uk-card-primary': selectedChar?.id === char.char_id,
              }"
              style="   cursor: pointer"
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
                <p><strong>Nom :</strong> {{ selectedChar.name }}</p>
                <p><strong>Niveau :</strong> {{ selectedChar.level }}</p>
                <p><strong>Classe :</strong> {{ selectedChar.class }}</p>
                <p><strong>Race :</strong> {{ selectedChar.race }}</p>
                <p><strong>Royaume :</strong> {{ selectedChar.realm }}</p>
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
