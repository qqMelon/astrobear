<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Type de bouton
  variant: {
    type: String,
    default: 'primary',
    validator: value =>
      ['primary', 'secondary', 'danger', 'success', 'battlenet', 'discord'].includes(value),
  },
  // Taille du bouton
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value),
  },
  // États
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // Type HTML
  type: {
    type: String,
    default: 'button',
    validator: value => ['button', 'submit', 'reset'].includes(value),
  },
  // Largeur complète
  fullWidth: {
    type: Boolean,
    default: false,
  },
  // Icône (slot ou prop)
  icon: {
    type: String,
    default: null,
  },
  // Position de l'icône
  iconPosition: {
    type: String,
    default: 'left',
    validator: value => ['left', 'right'].includes(value),
  },
})

const emit = defineEmits(['click'])

// Classes dynamiques du bouton
const buttonClasses = computed(() => {
  return [
    'base-button',
    `base-button--${props.variant}`,
    `base-button--${props.size}`,
    {
      'base-button--loading': props.loading,
      'base-button--disabled': props.disabled,
      'base-button--full-width': props.fullWidth,
    },
  ]
})

// Gestion du clic
const handleClick = event => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled || loading" @click="handleClick">
    <!-- Icône à gauche -->
    <span v-if="icon && iconPosition === 'left' && !loading" class="button-icon button-icon--left">
      <i :class="icon"></i>
    </span>

    <!-- Spinner de chargement -->
    <span v-if="loading" class="loading-spinner" aria-label="Chargement en cours"></span>

    <!-- Contenu du bouton -->
    <span v-if="!loading" class="button-content">
      <slot />
    </span>

    <!-- Icône à droite -->
    <span
      v-if="icon && iconPosition === 'right' && !loading"
      class="button-icon button-icon--right"
    >
      <i :class="icon"></i>
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* Tailles */
.base-button--small {
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
}

.base-button--medium {
  height: 48px;
  padding: 0 20px;
  font-size: 16px;
}

.base-button--large {
  height: 56px;
  padding: 0 24px;
  font-size: 18px;
}

/* Largeur complète */
.base-button--full-width {
  width: 100%;
}

/* Variantes de couleur */
.base-button--primary {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-orange) 100%);
  color: var(--color-light);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.base-button--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249, 131, 58, 0.4);
  background: linear-gradient(135deg, var(--color-orange) 0%, var(--color-accent) 100%);
}

.base-button--secondary {
  background: transparent;
  color: var(--color-light);
  border: 2px solid var(--color-border);
}

.base-button--secondary:hover:not(:disabled) {
  background: rgba(245, 224, 185, 0.1);
  border-color: var(--color-orange);
  transform: translateY(-1px);
}

.base-button--danger {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: var(--color-light);
}

.base-button--danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.base-button--success {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: var(--color-light);
}

.base-button--success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.base-button--battlenet {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: var(--color-light);
}

.base-button--battlenet:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.base-button--discord {
  background: linear-gradient(135deg, #5865f2 0%, #7289da 100%);
  color: var(--color-light);
}

.base-button--discord:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(114, 137, 218, 0.4);
}

/* États */
.base-button--disabled,
.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.base-button--loading {
  cursor: not-allowed;
}

.base-button:active:not(:disabled):not(.base-button--loading) {
  transform: translateY(0);
}

/* Icônes */
.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.button-icon--left {
  margin-right: 4px;
}

.button-icon--right {
  margin-left: 4px;
}

/* Contenu */
.button-content {
  flex-grow: 1;
  text-align: center;
}

/* Spinner de chargement */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s ease-in-out infinite;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .base-button--small {
    height: 32px;
    padding: 0 12px;
    font-size: 13px;
  }

  .base-button--medium {
    height: 44px;
    padding: 0 16px;
    font-size: 15px;
  }

  .base-button--large {
    height: 52px;
    padding: 0 20px;
    font-size: 17px;
  }
}

/* Animation de rotation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Focus pour l'accessibilité */
.base-button:focus {
  outline: 2px solid var(--color-orange);
  outline-offset: 2px;
}
</style>
