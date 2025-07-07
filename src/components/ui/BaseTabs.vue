<script setup>
import { ref } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    // Format: [{ id: 'tab1', name: 'Onglet 1', icon: 'svg-path' }]
  },
  modelValue: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref(props.modelValue || props.tabs[0]?.id)

function selectTab(tabId) {
  activeTab.value = tabId
  emit('update:modelValue', tabId)
}
</script>

<template>
  <div class="base-tabs">
    <div class="tabs-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ 'tab-active': activeTab === tab.id }"
        @click="selectTab(tab.id)"
      >
        <svg v-if="tab.icon" class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
        </svg>
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <div class="tabs-content">
      <slot :active-tab="activeTab" />
    </div>
  </div>
</template>

<style scoped>
/* === NAVIGATION DES ONGLETS === */
.tabs-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px;
  background: rgba(43, 27, 24, 0.6);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--color-gray);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.tab-button:hover {
  color: var(--color-light);
  background: rgba(245, 224, 185, 0.1);
}

.tab-active {
  color: var(--color-orange);
  background: rgba(249, 131, 58, 0.15);
  border: 1px solid rgba(249, 131, 58, 0.3);
}

.tab-icon {
  width: 18px;
  height: 18px;
}

/* === CONTENU === */
.tabs-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .tabs-nav {
    flex-direction: column;
  }

  .tab-button {
    justify-content: flex-start;
  }
}
</style>
