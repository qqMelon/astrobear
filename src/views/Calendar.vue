<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import Calendar from '@/components/Calendar.vue'
import EventForm from '@/components/EventForm.vue'

// État pour contrôler l'affichage du formulaire d'événement
const showEventForm = ref(false)
const currentEvent = ref(null)
const isEditMode = ref(false)

// Fonction pour ouvrir le formulaire en mode création
function openCreateForm() {
  currentEvent.value = null
  isEditMode.value = false
  showEventForm.value = true
}

// Fonction pour ouvrir le formulaire en mode édition
function openEditForm(event) {
  currentEvent.value = event
  isEditMode.value = true
  showEventForm.value = true
}

// Fonction pour fermer le formulaire
function closeForm() {
  showEventForm.value = false
}

// Fonction pour sauvegarder un événement (création ou édition)
function saveEvent(eventData) {
  // Ici, vous implémenteriez la logique pour sauvegarder l'événement
  // dans votre source de données (API, store, etc.)
  console.log('Événement sauvegardé:', eventData)
  
  // Fermer le formulaire après sauvegarde
  closeForm()
}
</script>

<template>
  <main class="calendar-page">
    <div class="calendar-container">
      <!-- En-tête de la page -->
      <header class="page-header">
        <div class="header-title">
          <h1>Calendrier des Événements</h1>
          <p>Planifiez et gérez les événements de la guilde</p>
        </div>
        <button @click="openCreateForm" class="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Créer un événement
        </button>
      </header>

      <!-- Calendrier principal -->
      <BaseCard padding="none" class="calendar-card">
        <div class="calendar-wrapper">
          <!-- Utilisation du composant Calendar avec édition activée -->
          <Calendar 
            :is-editable="true"
            @edit-event="openEditForm"
          />
        </div>
      </BaseCard>
    </div>

    <!-- Formulaire d'événement (modal) -->
    <div v-if="showEventForm" class="event-form-overlay" @click.self="closeForm">
      <div class="event-form-container">
        <EventForm 
          :event="currentEvent" 
          :is-edit-mode="isEditMode" 
          @save="saveEvent" 
          @cancel="closeForm" 
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.calendar-page {
  min-height: 100vh;
  background: var(--color-bg);
  font-family: 'Inter', sans-serif;
  color: var(--color-light);
  padding: 32px;
}

.calendar-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* En-tête de la page */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--color-light);
}

.header-title p {
  font-size: 16px;
  color: var(--color-gray);
  margin: 0;
}

/* Bouton principal */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  background: var(--color-orange);
  color: white;
}

.btn-primary:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

/* Carte du calendrier */
.calendar-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.calendar-wrapper {
  padding: 24px;
  min-height: 600px;
}

/* Overlay du formulaire */
.event-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.event-form-container {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
  background: var(--color-dark);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-page {
    padding: 20px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .calendar-wrapper {
    padding: 16px;
  }
}
</style>