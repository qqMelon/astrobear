<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

// Types d'événements disponibles
const eventTypes = [
  { value: 'progression', label: 'Progression', icon: '⚔️' },
  { value: 'reroll', label: 'Reroll', icon: '🎭' },
  { value: 'clear', label: 'Clear', icon: '🏆' },
  { value: 'other', label: 'Autre', icon: '📅' }
]

// Formulaire réactif
const title = ref('')
const content = ref('')
const startDate = ref('')
const endDate = ref('')
const type = ref('progression')

// Titre du formulaire selon le mode
const formTitle = computed(() => {
  return props.isEditMode ? 'Modifier l\'événement' : 'Créer un nouvel événement'
})

// Initialiser le formulaire avec les données de l'événement si en mode édition
onMounted(() => {
  if (props.event && props.isEditMode) {
    title.value = props.event.title
    content.value = props.event.content
    
    // Formatage des dates pour l'input date
    const formatDate = (date) => {
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    }
    
    startDate.value = formatDate(props.event.start)
    endDate.value = formatDate(props.event.end)
    type.value = props.event.type
  } else {
    // Valeurs par défaut pour un nouvel événement
    const today = new Date()
    startDate.value = today.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
  }
})

// Validation du formulaire
const isFormValid = computed(() => {
  return title.value.trim() !== '' && 
         startDate.value !== '' && 
         endDate.value !== '' && 
         type.value !== ''
})

// Soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return
  
  const eventData = {
    title: title.value,
    content: content.value,
    start: new Date(startDate.value),
    end: new Date(endDate.value),
    type: type.value,
    id: props.event?.id || Date.now() // Générer un ID si c'est un nouvel événement
  }
  
  emit('save', eventData)
}

// Annuler et fermer le formulaire
function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="event-form">
    <!-- En-tête du formulaire -->
    <div class="form-header">
      <div class="form-icon" :class="`event-${type}`">
        <span v-if="type === 'progression'">⚔️</span>
        <span v-else-if="type === 'reroll'">🎭</span>
        <span v-else-if="type === 'clear'">🏆</span>
        <span v-else>📅</span>
      </div>
      <div class="form-title">
        <h2>{{ formTitle }}</h2>
        <p>Remplissez les informations de l'événement</p>
      </div>
    </div>

    <!-- Corps du formulaire -->
    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Titre de l'événement -->
      <div class="form-group">
        <label for="event-title">Titre de l'événement</label>
        <input 
          id="event-title" 
          v-model="title" 
          type="text" 
          placeholder="Ex: Liberation Of Undermine - Progression"
          required
        />
      </div>

      <!-- Description de l'événement -->
      <div class="form-group">
        <label for="event-content">Description</label>
        <textarea 
          id="event-content" 
          v-model="content" 
          placeholder="Ex: Rendez-vous à 20h45 sur Discord"
          rows="3"
        ></textarea>
      </div>

      <!-- Dates de l'événement -->
      <div class="form-row">
        <div class="form-group">
          <label for="event-start">Date de début</label>
          <input 
            id="event-start" 
            v-model="startDate" 
            type="date" 
            required
          />
        </div>
        <div class="form-group">
          <label for="event-end">Date de fin</label>
          <input 
            id="event-end" 
            v-model="endDate" 
            type="date" 
            required
          />
        </div>
      </div>

      <!-- Type d'événement -->
      <div class="form-group">
        <label>Type d'événement</label>
        <div class="event-type-selector">
          <div 
            v-for="eventType in eventTypes" 
            :key="eventType.value"
            class="event-type-option"
            :class="{ active: type === eventType.value }"
            @click="type = eventType.value"
          >
            <span class="event-type-icon">{{ eventType.icon }}</span>
            <span class="event-type-label">{{ eventType.label }}</span>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="form-actions">
        <BaseButton 
          type="button" 
          variant="secondary" 
          @click="handleCancel"
        >
          Annuler
        </BaseButton>
        <BaseButton 
          type="submit" 
          variant="primary" 
          :disabled="!isFormValid"
        >
          {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.event-form {
  width: 100%;
  color: var(--color-light);
  font-family: 'Inter', sans-serif;
}

/* En-tête du formulaire */
.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--color-border);
}

.form-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.event-progression {
  background: linear-gradient(135deg, var(--color-orange), #cc6a2a);
}

.event-reroll {
  background: linear-gradient(135deg, var(--color-info), var(--color-info-dark));
}

.event-clear {
  background: linear-gradient(135deg, var(--color-green), #5a6b3a);
}

.event-other {
  background: linear-gradient(135deg, var(--color-gray), #555555);
}

.form-title h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--color-light);
}

.form-title p {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0;
}

/* Corps du formulaire */
.form-content {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-light);
}

input, textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: rgba(245, 224, 185, 0.05);
  color: var(--color-light);
  font-size: 14px;
  transition: all 0.2s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-orange);
  background: rgba(245, 224, 185, 0.1);
}

/* Sélecteur de type d'événement */
.event-type-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.event-type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: rgba(245, 224, 185, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-type-option:hover {
  background: rgba(245, 224, 185, 0.1);
}

.event-type-option.active {
  border-color: var(--color-orange);
  background: rgba(249, 131, 58, 0.1);
}

.event-type-icon {
  font-size: 20px;
}

.event-type-label {
  font-size: 12px;
  font-weight: 600;
}

/* Boutons d'action */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .event-type-selector {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>