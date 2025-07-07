<script setup>
import { computed, useAttrs } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()

// Générer un ID unique si pas fourni
const inputId = computed(() => {
  return props.id || `input-${Math.random().toString(36).substr(2, 9)}`
})

// Classes dynamiques pour l'input
const inputClasses = computed(() => {
  return [
    'form-input',
    {
      'form-input--error': props.error,
      'form-input--disabled': props.disabled,
    },
  ]
})

// Gestion de la valeur
const handleInput = event => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="form-group">
    <label :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-asterisk" aria-label="Champ obligatoire">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      v-bind="attrs"
      @input="handleInput"
    />

    <!-- Message d'erreur -->
    <div v-if="error && errorMessage" class="error-text" role="alert">
      <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%; /* 👈 Assure que le groupe prend toute la largeur */
}

.form-label {
  font-weight: 600;
  color: var(--color-light);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required-asterisk {
  color: var(--color-danger);
  font-size: 16px;
}

.form-input {
  height: 48px;
  padding: 0 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: rgba(245, 224, 185, 0.1);
  color: var(--color-light);
  width: 100%; /* 👈 L'input prend toute la largeur du parent */
  box-sizing: border-box; /* 👈 Important pour inclure padding et border */
  font-family: inherit;
}

.form-input::placeholder {
  color: var(--color-gray);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(249, 131, 58, 0.2);
  background: rgba(245, 224, 185, 0.15);
}

.form-input--error {
  border-color: var(--color-danger);
}

.form-input--error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.form-input--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(245, 224, 185, 0.05);
}

.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-danger);
  font-size: 13px;
  margin-top: 2px;
}

.error-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .form-input {
    font-size: 14px;
  }
}
</style>
