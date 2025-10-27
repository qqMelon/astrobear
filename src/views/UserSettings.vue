<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

import { getValidBattlenetToken } from '@/helpers/battlenetToken'

import BaseCard from '@/components/ui/BaseCard.vue'
import Modal from '@/components/Modal.vue'
import ChangePasswordForm from '@/components/ChangePasswordForm.vue'
import LinkBattlenetForm from '@/components/LinkBattlenetForm.vue'
import LinkDiscordForm from '@/components/LinkDiscordForm.vue'
import DeleteAccountForm from '@/components/DeleteAccountForm.vue'

const authStore = useAuthStore()
const user = authStore.user

const bnetLinked = ref(false)

const showModal = ref(false)
const modalContent = ref('')

const defaultAvatar =
  'https://ui-avatars.com/api/?name=User&size=40&background=2B1B18&color=F5E0B9&bold=true&format=png&font-size=0.6'

const fullName = computed(() => {
  return [user.first_name, user.last_name].filter(Boolean).join(' ')
})

const modalComponent = computed(() => {
  switch (modalContent.value) {
    case 'password':
      return ChangePasswordForm
    case 'battlenet':
      return LinkBattlenetForm
    case 'discord':
      return LinkDiscordForm
    case 'delete-account':
      return DeleteAccountForm
    default:
      return null
  }
})

function openModal(type) {
  // Empêcher l'ouverture du modal Battle.net si déjà connecté
  if (type === 'battlenet' && bnetLinked.value) {
    return
  }

  modalContent.value = type
  showModal.value = true
}

onMounted(() => {
  const token = getValidBattlenetToken()
  if (token) bnetLinked.value = true
})
</script>

<template>
  <main class="user-settings">
    <section class="settings-wrapper">
      <!-- Header Section -->
      <header class="settings-header">
        <div class="header-content">
          <div class="user-avatar">
            <img v-if="user.avatar_char_url" :src="user.avatar_char_url" alt="Avatar" class="avatar-image" />
            <div v-else class="avatar-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <div class="user-info">
            <h1 class="user-name">{{ user.main_character.name }}</h1>
            <p class="user-email">{{ user.email }}</p>
            <div class="user-role">
              <span class="role-badge">{{ user.role?.name || 'Membre' }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Settings Content -->
      <section class="settings-content">
        <div class="settings-grid">
          <!-- Account Security Card -->
          <BaseCard variant="hover" padding="none" class="security-card">
            <div class="card-header">
              <div class="card-icon security-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div class="card-title">
                <h2>🔐 Sécurité du compte</h2>
                <p>Gérez votre mot de passe et vos paramètres de sécurité</p>
              </div>
            </div>
            <div class="card-content">
              <button class="settings-button primary" @click="openModal('password')">
                <div class="button-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <div class="button-content">
                  <span class="button-title">Modifier le mot de passe</span>
                  <span class="button-subtitle">Changez votre mot de passe actuel</span>
                </div>
                <div class="button-arrow">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </BaseCard>

          <!-- Integrations Card -->
          <BaseCard variant="hover" padding="none" class="integrations-card">
            <div class="card-header">
              <div class="card-icon integrations-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div class="card-title">
                <h2>🔗 Intégrations</h2>
                <p>Connectez vos comptes externes pour une meilleure expérience</p>
              </div>
            </div>
            <div class="card-content">
              <button class="settings-button secondary" @click="openModal('discord')">
                <div class="button-icon discord-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"
                    />
                  </svg>
                </div>
                <div class="button-content">
                  <span class="button-title">Lier Discord</span>
                  <span class="button-subtitle">Connectez votre compte Discord</span>
                </div>
                <div class="button-arrow">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              <button
                class="settings-button secondary"
                :class="{ connected: bnetLinked }"
                :disabled="bnetLinked"
                @click="openModal('battlenet')"
              >
                <div class="button-icon battlenet-icon">
                  <!-- Icône différente selon l'état -->
                  <svg v-if="!bnetLinked" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M18.5 12c0-2.04-.84-3.88-2.19-5.2L14 9.13c.8.58 1.32 1.52 1.32 2.58 0 1.77-1.43 3.2-3.2 3.2s-3.2-1.43-3.2-3.2c0-1.06.52-2 1.32-2.58L7.93 6.8C6.58 8.12 5.74 9.96 5.74 12c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5z"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="button-content">
                  <span v-if="!bnetLinked" class="button-title">Lier Battle.net</span>
                  <span v-else class="button-title">✅ Battle.net connecté</span>

                  <span v-if="!bnetLinked" class="button-subtitle">
                    Connectez votre compte Blizzard
                  </span>
                  <span v-else class="button-subtitle">
                    Votre compte Battle.net est déjà lié (valable 24h)
                  </span>
                </div>
                <div class="button-arrow">
                  <svg v-if="!bnetLinked" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </BaseCard>

          <!-- Danger Zone Card -->
          <BaseCard variant="hover" padding="none" class="danger-card">
            <div class="card-header">
              <div class="card-icon danger-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div class="card-title">
                <h2>⚠️ Zone de danger</h2>
                <p>Actions irréversibles sur votre compte</p>
              </div>
            </div>
            <div class="card-content">
              <button class="settings-button danger" @click="openModal('delete-account')">
                <div class="button-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div class="button-content">
                  <span class="button-title">Supprimer le compte</span>
                  <span class="button-subtitle">Cette action est irréversible</span>
                </div>
                <div class="button-arrow">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </BaseCard>
        </div>
      </section>
    </section>

    <!-- Modal -->
    <Modal :show="showModal" @close="showModal = false">
      <template #form>
        <component :is="modalComponent" @close="showModal = false" />
      </template>
    </Modal>
  </main>
</template>

<style scoped>
/* Reset et box-sizing */
* {
  box-sizing: border-box;
}

/* === LAYOUT PRINCIPAL === */
.user-settings {
  min-height: 100vh;
  background: var(--color-bg);
  font-family: 'Inter', sans-serif;
  color: var(--color-light);
  padding: 0;
}

.settings-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

/* === HEADER UTILISATEUR === */
.settings-header {
  background: color-mix(in srgb, var(--color-dark) 80%, transparent);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--color-orange);
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
  border-color: var(--color-light);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-orange));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--color-orange);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.avatar-placeholder svg {
  width: 48px;
  height: 48px;
  color: var(--color-light);
}

.avatar-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: var(--color-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--color-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.avatar-badge svg {
  width: 16px;
  height: 16px;
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-family: 'Archivo Black', sans-serif;
  font-size: 32px;
  margin: 0 0 8px 0;
  color: var(--color-light);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.user-email {
  font-size: 18px;
  color: var(--color-gray);
  margin: 0 0 16px 0;
}

.role-badge {
  background: linear-gradient(135deg, var(--color-accent), var(--color-orange));
  color: var(--color-light);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 8px rgba(249, 131, 58, 0.3);
}

/* === GRID DES PARAMÈTRES === */
.settings-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

/* === CARDS - Supprimé les styles de base car maintenant géré par BaseCard === */
.security-card:hover {
  border-color: var(--color-green);
}

.integrations-card:hover {
  border-color: var(--color-orange);
}

.danger-card:hover {
  border-color: var(--color-danger);
}

/* === HEADERS DES CARDS === */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.security-icon {
  background: linear-gradient(135deg, var(--color-green), #5a6b3a);
}

.integrations-icon {
  background: linear-gradient(135deg, var(--color-orange), #cc6a2a);
}

.danger-icon {
  background: linear-gradient(135deg, var(--color-danger), #b91c1c);
}

.card-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.card-title h2 {
  font-size: 20px;
  margin: 0 0 4px 0;
  color: var(--color-light);
}

.card-title p {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0;
  line-height: 1.4;
}

/* === CONTENU DES CARDS === */
.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* === BOUTONS === */
.settings-button {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background: rgba(245, 224, 185, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.settings-button:hover {
  background: rgba(245, 224, 185, 0.1);
  transform: translateX(4px);
}

.settings-button.primary:hover {
  border-color: var(--color-green);
  box-shadow: 0 4px 16px rgba(124, 138, 78, 0.3);
}

.settings-button.secondary:hover {
  border-color: var(--color-orange);
  box-shadow: 0 4px 16px rgba(249, 131, 58, 0.3);
}

.settings-button.danger:hover {
  border-color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

/* === ÉTAT CONNECTÉ === */
.settings-button.connected {
  border-color: var(--color-green) !important;
  background: rgba(124, 138, 78, 0.1) !important;
  cursor: not-allowed !important;
  opacity: 0.8;
}

.settings-button.connected:hover {
  transform: none !important;
  box-shadow: 0 4px 16px rgba(124, 138, 78, 0.2) !important;
}

.settings-button.connected .button-icon {
  background: rgba(124, 138, 78, 0.2) !important;
}

.settings-button.connected .button-icon svg {
  color: var(--color-green) !important;
}

.settings-button.connected .button-title {
  color: var(--color-green) !important;
}

.settings-button.connected .button-arrow svg {
  color: var(--color-green) !important;
}

.button-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(245, 224, 185, 0.1);
}

.button-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-light);
}

.discord-icon {
  background: rgba(88, 101, 242, 0.2) !important;
}

.discord-icon svg {
  color: var(--color-accent-hover) !important;
}

.battlenet-icon {
  background: rgba(0, 174, 255, 0.2) !important;
}

.battlenet-icon svg {
  color: #00aeff !important;
}

.button-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.button-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-light);
}

.button-subtitle {
  font-size: 14px;
  color: var(--color-gray);
}

.button-arrow {
  width: 20px;
  height: 20px;
  color: var(--color-gray);
  transition: all 0.2s ease;
}

.settings-button:hover .button-arrow {
  color: var(--color-orange);
  transform: translateX(4px);
}

.settings-button.danger:hover .button-arrow {
  color: var(--color-danger);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .settings-wrapper {
    padding: 20px;
  }

  .settings-header {
    padding: 24px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .user-name {
    font-size: 24px;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-button {
    padding: 16px;
  }

  .user-avatar .avatar-image,
  .user-avatar .avatar-placeholder {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .settings-wrapper {
    padding: 16px;
  }

  .settings-header {
    padding: 20px;
  }

  .card-header,
  .card-content {
    padding: 20px;
  }

  .button-content {
    gap: 2px;
  }

  .button-title {
    font-size: 15px;
  }

  .button-subtitle {
    font-size: 13px;
  }
}
</style>
