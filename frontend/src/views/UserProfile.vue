<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

import Modal from '@/components/Modal.vue'
import ChangePasswordForm from '@/components/ChangePasswordForm.vue'
import LinkBattlenetForm from '@/components/LinkBattlenetForm.vue'

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
    case 'delete-account':
      return DeleteAccountConfirm
    default:
      return null
  }
})

function openModal(type) {
  modalContent.value = type
  showModal.value = true
}

function getAvatarUrl(fileId) {
  return `import.meta.env.VITE_BACKEND_BASE_URL/assets/${fileId}`
}
</script>

<template>
  <div>
    <h3 class="uk-card-title uk-text-center">{{ fullName }}</h3>
  </div>
</template>
