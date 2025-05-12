<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

import Modal from '@/components/Modal.vue'
import ChangePasswordForm from '@/components/ChangePasswordForm.vue'
import LinkBattlenetForm from '@/components/LinkBattlenetForm.vue'
import LinkDiscordForm from '@/components/LinkDiscordForm.vue'
import DeleteAccountForm from '@/components/DeleteAccountForm.vue'

const authStore = useAuthStore()
const user = authStore.user

const showModal = ref(false)
const modalContent = ref('')

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
  modalContent.value = type
  showModal.value = true
}

function getAvatarUrl(fileId) {
  return `http://localhost:8055/assets/${fileId}`
}
</script>

<template>
  <div
    class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto uk-margin-large-top"
  >
    <div class="uk-flex uk-flex-middle uk-flex-center uk-margin-bottom">
      <img
        v-if="user?.avatar"
        :src="getAvatarUrl(user.avatar)"
        alt="Avatar"
        class="uk-border-circle"
        width="100"
        height="100"
      />
      <div v-else class="uk-icon-button uk-border-circle" uk-icon="user"></div>
    </div>

    <h3 class="uk-card-title uk-text-center">{{ fullName }}</h3>
    <p class="uk-text-center uk-text-muted">{{ user.email }}</p>
    <p class="uk-text-center"><strong>Rôle :</strong> {{ user.role?.name || '—' }}</p>

    <div class="uk-text-center uk-margin-top actions-container">
      <button class="uk-button uk-button-primary" @click="openModal('password')">
        Modifier le mot de passe
      </button>
      <button class="uk-button uk-button-primary" @click="openModal('discord')">
        Lier son compte Discord
      </button>
      <button class="uk-button uk-button-primary" @click="openModal('battlenet')">
        Lier son compte Battle.net
      </button>
      <button class="uk-button uk-button-danger" @click="openModal('delete-account')">
        Supprimer les données et le compte
      </button>
    </div>
    <Modal :show="showModal" @close="showModal = false">
      <template #form>
        <component :is="modalComponent" @close="showModal = false" />
      </template>
    </Modal>
  </div>
</template>

<style>
div.actions-container {
  display: flex;
  flex-direction: column;
}

div.actions-container > button {
  margin: 15px auto 0 auto;
}

div.actions-container > button.uk-button-danger {
  margin-top: 45px;
}
</style>
