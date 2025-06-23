<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])
const isConfirmed = ref(false)
const confirmationText = ref('')
const isLoading = ref(false)

function handleConfirmation() {
  isConfirmed.value = !isConfirmed.value
}

async function deleteAccount() {
  if (!isConfirmed.value || confirmationText.value !== 'SUPPRIMER') {
    return
  }

  isLoading.value = true

  // Simuler l'appel API
  try {
    // TODO: Implémenter l'appel API de suppression
    console.log('Suppression du compte demandée')

    // Fermer la modal après succès
    setTimeout(() => {
      emit('close')
      isLoading.value = false
    }, 2000)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    isLoading.value = false
  }
}
</script>

<template>
  <div class="delete-form">
    <!-- Header -->
    <header class="form-header">
      <div class="form-icon danger-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <div class="form-title">
        <h2>⚠️ Supprimer définitivement le compte</h2>
        <p>Cette action est irréversible et supprimera toutes vos données</p>
      </div>
    </header>

    <!-- Content -->
    <div class="form-content">
      <div class="warning-section">
        <div class="warning-card">
          <div class="warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div class="warning-content">
            <h3>Que va-t-il se passer ?</h3>
            <ul class="consequences-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Suppression immédiate de votre profil
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Perte de toutes vos données personnelles
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Déconnexion des comptes liés (Discord, Battle.net)
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Impossibilité de récupérer les données
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grace-period">
        <div class="period-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <div class="period-content">
          <h4>⏰ Période de grâce : 7 jours</h4>
          <p>Vous disposez de <strong>7 jours</strong> après la suppression pour :</p>
          <ul>
            <li>Réclamer vos données personnelles</li>
            <li>Réactiver votre compte</li>
            <li>Annuler la suppression</li>
          </ul>
          <p class="period-note">Passé ce délai, la suppression sera définitive.</p>
        </div>
      </div>

      <!-- Confirmation Steps -->
      <div class="confirmation-section">
        <div class="confirmation-step">
          <label class="checkbox-container">
            <input v-model="isConfirmed" type="checkbox" @change="handleConfirmation" />
            <span class="checkmark"></span>
            <span class="checkbox-label">
              Je comprends que cette action est <strong>définitive</strong> et que toutes mes
              données seront supprimées
            </span>
          </label>
        </div>

        <div v-if="isConfirmed" class="confirmation-step">
          <label class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Tapez "SUPPRIMER" pour confirmer
          </label>
          <input
            v-model="confirmationText"
            type="text"
            class="form-input"
            :class="{
              'input-error': confirmationText && confirmationText !== 'SUPPRIMER',
              'input-success': confirmationText === 'SUPPRIMER',
            }"
            placeholder="Tapez SUPPRIMER en majuscules"
            :disabled="isLoading"
          />
          <div
            v-if="confirmationText && confirmationText !== 'SUPPRIMER'"
            class="input-feedback error"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Vous devez taper exactement "SUPPRIMER"
          </div>
          <div v-else-if="confirmationText === 'SUPPRIMER'" class="input-feedback success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Confirmation validée
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="button"
          class="btn btn-danger"
          :disabled="!isConfirmed || confirmationText !== 'SUPPRIMER' || isLoading"
          @click="deleteAccount"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {{ isLoading ? 'Suppression en cours...' : 'Je confirme supprimer mon compte' }}
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
    </div>
  </div>
</template>

<style scoped>
/* === CONTAINER === */
.delete-form {
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
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.danger-icon {
  background: linear-gradient(135deg, var(--color-danger), #b91c1c);
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

/* === CONTENT === */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* === WARNING SECTION === */
.warning-section {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 24px;
}

.warning-card {
  display: flex;
  gap: 16px;
}

.warning-icon {
  width: 48px;
  height: 48px;
  background: var(--color-danger);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.warning-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.warning-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--color-light);
}

.consequences-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.consequences-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-gray);
}

.consequences-list svg {
  width: 16px;
  height: 16px;
  color: var(--color-danger);
  flex-shrink: 0;
}

/* === GRACE PERIOD === */
.grace-period {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(249, 131, 58, 0.1);
  border: 1px solid rgba(249, 131, 58, 0.3);
  border-radius: 12px;
}

.period-icon {
  width: 48px;
  height: 48px;
  background: var(--color-orange);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.period-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.period-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--color-light);
}

.period-content p {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.period-content ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.period-content li {
  font-size: 14px;
  color: var(--color-gray);
  position: relative;
  padding-left: 20px;
}

.period-content li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-orange);
  font-weight: bold;
}

.period-note {
  font-weight: 600;
  color: var(--color-orange) !important;
  font-size: 13px !important;
}

/* === CONFIRMATION === */
.confirmation-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.confirmation-step {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.5;
}

.checkbox-container input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  background: transparent;
}

.checkbox-container input[type='checkbox']:checked + .checkmark {
  background: var(--color-danger);
  border-color: var(--color-danger);
}

.checkbox-container input[type='checkbox']:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  color: var(--color-gray);
}

.checkbox-label strong {
  color: var(--color-light);
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
  color: var(--color-danger);
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
  border-color: var(--color-danger);
  background: rgba(245, 224, 185, 0.1);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
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

.btn-danger {
  background: linear-gradient(135deg, var(--color-danger), #b91c1c);
  color: white;
  flex: 1;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #dc2626, #991b1b);
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

  .warning-card,
  .grace-period {
    flex-direction: column;
    gap: 12px;
  }

  .warning-icon,
  .period-icon {
    width: 40px;
    height: 40px;
  }

  .warning-icon svg,
  .period-icon svg {
    width: 20px;
    height: 20px;
  }
}
</style>
