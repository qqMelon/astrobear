<script setup>
defineProps({
  // Variantes basiques
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'hover'].includes(value),
  },
  // Padding interne
  padding: {
    type: String,
    default: 'default',
    validator: value => ['none', 'small', 'default', 'large'].includes(value),
  },
})
</script>

<template>
  <div :class="['base-card', `base-card--${variant}`, `base-card--padding-${padding}`]">
    <slot />
  </div>
</template>

<style scoped>
/* === BASE CARD === */
.base-card {
  /* Reprise exacte du style des cartes du Dashboard */
  background: color-mix(in srgb, var(--color-dark) 80%, transparent);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/* === VARIANTES === */
.base-card--default {
  /* Style de base - pas de changement */
}

.base-card--hover:hover {
  /* Effet hover comme les stat-cards */
  border-color: var(--color-orange);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

/* === PADDING === */
.base-card--padding-none {
  padding: 0;
}

.base-card--padding-small {
  padding: 16px;
}

.base-card--padding-default {
  padding: 24px;
}

.base-card--padding-large {
  padding: 32px;
}
</style>
