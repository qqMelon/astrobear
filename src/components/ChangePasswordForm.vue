<script setup>
import { ref } from 'vue'
import { useToastStore } from '../stores/toast'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const toast = useToastStore()

const emit = defineEmits(['close'])

async function submitPasswordChange() {
  if (newPassword.value !== confirmPassword.value) {
    toast.show('Les mots de passe ne correspondent pas.', 'danger')
    return
  }

  if (newPassword.value.length < 8) {
    toast.show('Le mot de passe doit contenir au moins 8 caractères.', 'danger')
    return
  }

  isLoading.value = true

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
    emit('close')
  } catch (e) {
    toast.show(e.message || 'Erreur lors de la mise à jour.', 'danger')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="password-form">
    <!-- Header -->
    <header class="form-header">
      <div class="form-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      </div>
      <div class="form-title">
        <h2>🔐 Changer mon mot de passe</h2>
        <p>Modifiez votre mot de passe pour sécuriser votre compte</p>
      </div>
    </header>

    <!-- Form -->
    <form class="form-content" @submit.prevent="submitPasswordChange">
      <div class="form-group">
        <label class="form-label" for="current-password">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <circle cx="12" cy="16" r="1" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Mot de passe actuel
        </label>
        <div class="input-wrapper">
          <input
            id="current-password"
            v-model="currentPassword"
            type="password"
            class="form-input"
            placeholder="Saisissez votre mot de passe actuel"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="new-password">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          Nouveau mot de passe
        </label>
        <div class="input-wrapper">
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            class="form-input"
            placeholder="Minimum 8 caractères"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="password-strength">
          <div class="strength-bar">
            <div
              class="strength-fill"
              :class="{
                weak: newPassword.length > 0 && newPassword.length < 8,
                medium: newPassword.length >= 8 && newPassword.length < 12,
                strong: newPassword.length >= 12,
              }"
            ></div>
          </div>
          <span class="strength-text">
            {{ newPassword.length < 8 ? 'Faible' : newPassword.length < 12 ? 'Moyen' : 'Fort' }}
          </span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="confirm-password">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Confirmer le mot de passe
        </label>
        <div class="input-wrapper">
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            :class="{
              'input-error': confirmPassword && newPassword !== confirmPassword,
              'input-success': confirmPassword && newPassword === confirmPassword,
            }"
            placeholder="Confirmez votre nouveau mot de passe"
            required
            :disabled="isLoading"
          />
          <div
            v-if="confirmPassword && newPassword !== confirmPassword"
            class="input-feedback error"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Les mots de passe ne correspondent pas
          </div>
          <div
            v-else-if="confirmPassword && newPassword === confirmPassword"
            class="input-feedback success"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Les mots de passe correspondent
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="
            isLoading ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          "
        >
          <svg
            v-if="isLoading"
            class="btn-icon spinning"
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
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ isLoading ? 'Modification...' : 'Modifier le mot de passe' }}
        </button>

        <button
          type="button"
          class="btn btn-secondary"
          :disabled="isLoading"
          @click="emit('close')"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* === CONTAINER === */
.password-form {
  width: 100%;
  color: var(--color-light);
  font-family: 'Inter', sans-serif;
}

/* === HEADER === */
.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.form-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-green), #5a6b3a);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(124, 138, 78, 0.3);
}

.form-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.form-title h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--color-light);
}

.form-title p {
  font-size: 16px;
  color: var(--color-gray);
  margin: 0;
}

/* === FORM === */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-light);
  margin-bottom: 4px;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: var(--color-orange);
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(245, 224, 185, 0.05);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-light);
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-orange);
  background: rgba(245, 224, 185, 0.1);
  box-shadow: 0 0 0 4px rgba(249, 131, 58, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--color-gray);
}

.input-error {
  border-color: var(--color-danger) !important;
}

.input-error:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
}

.input-success {
  border-color: var(--color-green) !important;
}

.input-success:focus {
  box-shadow: 0 0 0 4px rgba(124, 138, 78, 0.1) !important;
}

/* === PASSWORD STRENGTH === */
.password-strength {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: rgba(245, 224, 185, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  width: 0%;
}

.strength-fill.weak {
  width: 33%;
  background: var(--color-danger);
}

.strength-fill.medium {
  width: 66%;
  background: var(--color-orange);
}

.strength-fill.strong {
  width: 100%;
  background: var(--color-green);
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-gray);
  min-width: 40px;
}

/* === INPUT FEEDBACK === */
.input-feedback {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

.input-feedback svg {
  width: 16px;
  height: 16px;
}

.input-feedback.error {
  color: var(--color-danger);
}

.input-feedback.success {
  color: var(--color-green);
}

/* === ACTIONS === */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 56px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-green), #5a6b3a);
  color: white;
  flex: 1;
  box-shadow: 0 4px 16px rgba(124, 138, 78, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 138, 78, 0.4);
}

.btn-secondary {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-gray);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--color-orange);
  color: var(--color-light);
  background: rgba(249, 131, 58, 0.1);
}

/* === ANIMATIONS === */
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .form-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .form-icon {
    width: 48px;
    height: 48px;
  }

  .form-icon svg {
    width: 24px;
    height: 24px;
  }

  .form-title h2 {
    font-size: 20px;
  }
}
</style>
