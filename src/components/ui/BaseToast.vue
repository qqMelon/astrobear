<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToastStore } from '../../stores/toast.js'

const toast = useToastStore()
const { visible, message, type, duration } = storeToRefs(toast)

const close = () => {
  toast.hide()
}

// Watcher pour gérer les nouveaux toasts
watch(visible, newVisible => {
  if (newVisible) {
    setTimeout(() => {
      toast.hide()
    }, duration.value)
  }
})
</script>

<template>
  <Transition name="toast" appear>
    <div
      v-if="visible"
      class="toast-container"
      :class="[`toast-${type}`, { 'toast-visible': visible }]"
    >
      <div class="toast-content">
        <div class="toast-icon">
          <!-- Success Icon -->
          <svg v-if="type === 'success'" class="icon-svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>

          <!-- Danger Icon -->
          <svg
            v-else-if="type === 'danger'"
            class="icon-svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>

          <!-- Warning Icon -->
          <svg
            v-else-if="type === 'warning'"
            class="icon-svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>

          <!-- Info Icon (primary) -->
          <svg v-else class="icon-svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <p class="toast-message">{{ message }}</p>

        <button class="toast-close" aria-label="Fermer la notification" @click="close">
          <svg class="close-svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 320px;
  max-width: 400px;
  font-family: 'Inter', sans-serif;
  pointer-events: auto;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 2px solid;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🎯 Styles explicites pour les icônes */
.icon-svg {
  width: 20px;
  height: 20px;
  display: block;
}

.toast-message {
  flex: 1;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  display: flex;
  align-items: center;
}

.toast-close {
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 🎯 Style explicite pour l'icône de fermeture */
.close-svg {
  width: 16px;
  height: 16px;
  display: block;
}

/* === Types de BaseToast === */
.toast-success {
  background: rgba(124, 138, 78, 0.95);
  border-color: var(--color-green);
  color: var(--color-light);
}

.toast-danger {
  background: rgba(239, 68, 68, 0.95);
  border-color: var(--color-danger);
  color: var(--color-light);
}

.toast-warning {
  background: rgba(249, 131, 58, 0.95);
  border-color: var(--color-orange);
  color: var(--color-dark);
}

.toast-primary {
  background: rgba(139, 58, 47, 0.95);
  border-color: var(--color-accent);
  color: var(--color-light);
}

/* === Animations === */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

/* === Responsive === */
@media (max-width: 480px) {
  .toast-container {
    bottom: 20px;
    right: 16px;
    left: 16px;
    min-width: auto;
    max-width: none;
  }

  .toast-content {
    padding: 14px 16px;
  }

  .toast-message {
    font-size: 13px;
  }
}

/* === Animation améliorée === */
@keyframes slideInBounce {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateX(-10px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.toast-visible {
  animation: slideInBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
