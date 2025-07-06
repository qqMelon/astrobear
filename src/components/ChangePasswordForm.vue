<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'

// État local pour les champs
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errors = ref({})
const isLoading = ref(false)

// Validation et soumission
const handleSubmit = async () => {
  errors.value = {}

  // Validation basique
  if (!currentPassword.value) {
    errors.value.currentPassword = 'Mot de passe actuel requis'
  }

  if (!newPassword.value) {
    errors.value.newPassword = 'Nouveau mot de passe requis'
  } else if (newPassword.value.length < 8) {
    errors.value.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
  }

  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Les mots de passe ne correspondent pas'
  }

  if (Object.keys(errors.value).length === 0) {
    isLoading.value = true

    try {
      // Appel API ici
      console.log('Changement de mot de passe...')

      // Simulation délai
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Reset du formulaire
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

      // Notification de succès
      console.log('Mot de passe changé avec succès')
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <form class="change-password-form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <h2>Changer le mot de passe</h2>
      <p>Modifiez votre mot de passe actuel</p>
    </div>

    <div class="form-fields">
      <BaseInput
        v-model="currentPassword"
        label="Mot de passe actuel"
        type="password"
        placeholder="Entrez votre mot de passe actuel"
        :error="!!errors.currentPassword"
        :error-message="errors.currentPassword"
        :required="true"
        autocomplete="current-password"
      />

      <BaseInput
        v-model="newPassword"
        label="Nouveau mot de passe"
        type="password"
        placeholder="Entrez votre nouveau mot de passe"
        :error="!!errors.newPassword"
        :error-message="errors.newPassword"
        :required="true"
        autocomplete="new-password"
      />

      <BaseInput
        v-model="confirmPassword"
        label="Confirmer le nouveau mot de passe"
        type="password"
        placeholder="Confirmez votre nouveau mot de passe"
        :error="!!errors.confirmPassword"
        :error-message="errors.confirmPassword"
        :required="true"
        autocomplete="new-password"
      />
    </div>

    <button
      type="submit"
      class="submit-button"
      :disabled="isLoading"
      :class="{ 'submit-button--loading': isLoading }"
    >
      <span v-if="!isLoading">Changer le mot de passe</span>
      <span v-else class="loading-spinner" aria-label="Changement en cours"></span>
    </button>
  </form>
</template>

<style scoped>
.change-password-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  background: var(--color-dark);
  border-radius: 12px;
  border: 2px solid var(--color-border);
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.form-header h2 {
  color: var(--color-light);
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.form-header p {
  color: var(--color-gray);
  margin: 0;
  font-size: 14px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.submit-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-orange) 100%);
  color: var(--color-light);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249, 131, 58, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(245, 224, 185, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-light);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
