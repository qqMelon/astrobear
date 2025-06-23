<script setup>
import { onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

function handleEscape(event) {
  if (event.key === 'Escape' && props.show) {
    close()
  }
}

// Gérer le blur de l'arrière-plan
function toggleBackgroundBlur(shouldBlur) {
  const mainElement = document.querySelector('main')
  const bodyElement = document.body

  if (shouldBlur) {
    // Ajouter le flou à l'arrière-plan
    if (mainElement) {
      mainElement.style.filter = 'blur(4px)'
      mainElement.style.transition = 'filter 0.3s ease'
    }
    // Empêcher le scroll
    bodyElement.style.overflow = 'hidden'
  } else {
    // Retirer le flou
    if (mainElement) {
      mainElement.style.filter = 'none'
    }
    // Restaurer le scroll
    bodyElement.style.overflow = 'unset'
  }
}

// Watcher pour gérer l'ouverture/fermeture
watch(
  () => props.show,
  newValue => {
    nextTick(() => {
      toggleBackgroundBlur(newValue)
    })
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  // S'assurer que le flou est retiré au démontage
  toggleBackgroundBlur(false)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="show" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <div class="modal-content">
            <!-- Header avec bouton de fermeture -->
            <header class="modal-header">
              <button class="modal-close" type="button" aria-label="Fermer la modal" @click="close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            <!-- Contenu de la modal -->
            <main class="modal-body">
              <slot name="form" />
            </main>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* === OVERLAY === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  /* Arrière-plan avec effet glassmorphism */
  background: rgba(27, 15, 15, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* === CONTAINER === */
.modal-container {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  position: relative;
}

/* === CONTENU === */
.modal-content {
  background: rgba(43, 27, 24, 0.95);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(249, 131, 58, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
  position: relative;

  /* Effet de glow subtil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249, 131, 58, 0.5), transparent);
  }
}

/* === HEADER === */
.modal-header {
  position: relative;
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: flex-end;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: absolute;
  top: -8px;
  right: 16px;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.modal-close:active {
  transform: scale(0.95);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

/* === BODY === */
.modal-body {
  padding: 32px;
  color: var(--color-light);
  font-family: 'Inter', sans-serif;
}

/* === ANIMATIONS === */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-enter-from .modal-content {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-content {
    border-radius: 16px;
  }

  .modal-body {
    padding: 24px;
  }

  .modal-close {
    width: 36px;
    height: 36px;
    top: -6px;
    right: 12px;
  }

  .modal-close svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .modal-container {
    max-height: 90vh;
  }

  .modal-content {
    border-radius: 20px 20px 0 0;
  }

  .modal-body {
    padding: 20px;
  }
}

/* === STYLE POUR LE SCROLL === */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(245, 224, 185, 0.1);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--color-orange);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}
</style>
