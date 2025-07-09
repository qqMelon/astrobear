<script setup>
import { ref, onMounted, computed } from 'vue'

import CharacterCard from '@/components/CharacterCard.vue'

import { getValidBattlenetToken } from '@/helpers/battlenetToken'

const token = getValidBattlenetToken()

const bnetLinked = ref(false)
const characters = ref([])
const isLoading = ref(false)
const error = ref(null)
const selectedChar = ref(null)

const loadChars = async function () {
  isLoading.value = true
  error.value = null

  if (!token) {
    error.value = 'Token Battlenet invalide ou expiré.'
    isLoading.value = false
    return
  }

  try {
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
    console.log(data)
    characters.value = data.wow_accounts[0].characters || []
  } catch (err) {
    error.value = err.messgage
  } finally {
    isLoading.value = false
  }
}

const sortedCharacters = computed(() => [...characters.value].sort((a, b) => b.level - a.level))

onMounted(() => {
  if (token) {
    bnetLinked.value = true
    // loadChars()
  }
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
        Synchroniser mes personnages
      </button>
      <div class="uk-grid-large" uk-grid>
        <!-- Liste des persos -->
        <div class="uk-width-1-2@s">
          <h3>Vos personnages</h3>
          <div v-if="sortedCharacters.length === 0">Aucun personnage trouvé.</div>
          <div class="uk-grid-small" uk-grid>
            <CharacterCard
              v-for="char in sortedCharacters"
              :key="char.id"
              :character="char"
              :class="{
                'uk-card-primary': selectedChar?.id === char.id,
              }"
              style="cursor: pointer"
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
                <p><strong>Classe :</strong> {{ selectedChar.playable_class.name.fr_FR }}</p>
                <p><strong>Race :</strong> {{ selectedChar.playable_race.name.fr_FR }}</p>
                <p><strong>Royaume :</strong> {{ selectedChar.realm.name.fr_FR }}</p>
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
