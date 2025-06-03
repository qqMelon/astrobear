<script setup>
import { ref } from 'vue'
import { useToastStore } from '../stores/toast'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const toast = useToastStore()

async function submitPasswordChange() {
  if (newPassword.value !== confirmPassword.value) {
    toast.show('Les mots de passe ne correspondent pas.', 'danger')
    return
  }

  try {
    const token = localStorage.getItem('access_token')

    const res = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/users/me/password', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        old_password: currentPassword.value,
        new_password: newPassword.value,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.errors?.[0]?.message || 'Erreur lors du changement.')
    }

    toast.show('Mot de passe changé avec succès 🎉', 'success')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e) {
    toast.show(e.message || 'Erreur lors de la mise à jour.', 'danger')
  }
}
</script>

<template>
  <div class="uk-text-center uk-container">
    <h3 class="uk-card-title uk-text-center">Changer mon mot de passe</h3>

    <form @submit.prevent="submitPasswordChange" class="uk-form-stacked">
      <div class="uk-margin">
        <label class="uk-form-label">Ancien mot de passe</label>
        <input class="uk-input" type="password" v-model="currentPassword" required />
      </div>

      <div class="uk-margin">
        <label class="uk-form-label">Nouveau mot de passe</label>
        <input class="uk-input" type="password" v-model="newPassword" required />
      </div>

      <div class="uk-margin">
        <label class="uk-form-label">Confirmer le mot de passe</label>
        <input class="uk-input" type="password" v-model="confirmPassword" required />
      </div>

      <div class="uk-margin uk-text-center">
        <button class="uk-button uk-button-primary" type="submit">Valider</button>
        <button class="uk-button uk-button-default uk-margin-left" @click="$emit('close')">
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>
