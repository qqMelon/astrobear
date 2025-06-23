<script setup>
import { ref, computed } from 'vue'

const raidEvents = ref([
  {
    start: new Date(2025, 3, 30),
    end: new Date(2025, 3, 30),
    title: 'Liberation Of Undermine - Progression',
    content: 'Rendez-vous à 20h45 sur Discord',
    type: 'progression',
  },
  {
    start: new Date(2025, 4, 4),
    end: new Date(2025, 4, 4),
    title: 'Liberation Of Undermine - Reroll',
    content: 'Transmo + succès + Gearing rerolls',
    type: 'reroll',
  },
  {
    start: new Date(2025, 4, 7),
    end: new Date(2025, 4, 7),
    title: 'Nerub-ar Palace - Clear',
    content: 'Clear hebdomadaire + farm stuff',
    type: 'clear',
  },
])

// Attributs pour v-calendar avec le style harmonisé
const calendarAttributes = computed(() =>
  raidEvents.value.map(raid => ({
    key: raid.title,
    highlight: {
      color: getEventColor(raid.type),
      fillMode: 'light',
    },
    dates: { start: raid.start, end: raid.end },
    popover: {
      label: `${raid.title}`,
      slot: 'event-popover',
    },
    customData: raid,
  }))
)

// Couleurs selon le type d'événement
function getEventColor(type) {
  switch (type) {
    case 'progression':
      return 'orange'
    case 'reroll':
      return 'blue'
    case 'clear':
      return 'green'
    default:
      return 'gray'
  }
}

// Événements du jour actuel
const todayEvents = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return raidEvents.value.filter(event => {
    const eventDate = new Date(event.start)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() === today.getTime()
  })
})

// Prochains événements (7 prochains jours)
const upcomingEvents = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  return raidEvents.value
    .filter(event => event.start >= today && event.start <= nextWeek)
    .sort((a, b) => a.start - b.start)
    .slice(0, 3)
})

function formatEventDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function getEventTypeIcon(type) {
  switch (type) {
    case 'progression':
      return '⚔️'
    case 'reroll':
      return '🎭'
    case 'clear':
      return '🏆'
    default:
      return '📅'
  }
}
</script>

<template>
  <div class="raid-calendar">
    <!-- Événements du jour (si il y en a) -->
    <div v-if="todayEvents.length > 0" class="today-events">
      <div class="today-header">
        <div class="today-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3>Aujourd'hui</h3>
      </div>
      <div class="events-list">
        <div
          v-for="event in todayEvents"
          :key="event.title"
          class="event-item today-event"
          :class="`event-${event.type}`"
        >
          <span class="event-icon">{{ getEventTypeIcon(event.type) }}</span>
          <div class="event-details">
            <span class="event-title">{{ event.title }}</span>
            <span class="event-content">{{ event.content }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendrier principal -->
    <div class="calendar-wrapper">
      <v-calendar
        ref="calendar"
        is-expanded
        :attributes="calendarAttributes"
        class="custom-calendar"
        title-position="left"
        :first-day-of-week="2"
      >
        <!-- Slot pour les popovers personnalisés -->
        <template #day-popover="{ day, attributes }">
          <div class="custom-popover">
            <div v-for="attr in attributes" :key="attr.key" class="popover-event">
              <div class="popover-header">
                <span class="popover-icon">{{ getEventTypeIcon(attr.customData.type) }}</span>
                <span class="popover-title">{{ attr.customData.title }}</span>
              </div>
              <p class="popover-content">{{ attr.customData.content }}</p>
            </div>
          </div>
        </template>
      </v-calendar>
    </div>

    <!-- Prochains événements -->
    <div v-if="upcomingEvents.length > 0" class="upcoming-events">
      <div class="upcoming-header">
        <div class="upcoming-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3>Prochainement</h3>
      </div>
      <div class="events-list">
        <div
          v-for="event in upcomingEvents.slice(0, 2)"
          :key="event.title"
          class="event-item upcoming-event"
          :class="`event-${event.type}`"
        >
          <div class="event-date">
            <span class="event-day">{{ formatEventDate(event.start) }}</span>
          </div>
          <div class="event-details">
            <span class="event-title">{{ event.title }}</span>
            <span class="event-content">{{ event.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === CONTAINER PRINCIPAL === */
.raid-calendar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

/* === ÉVÉNEMENTS AUJOURD'HUI === */
.today-events {
  background: rgba(249, 131, 58, 0.1);
  border: 1px solid rgba(249, 131, 58, 0.3);
  border-radius: 8px;
  padding: 16px;
}

.today-header,
.upcoming-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.today-icon,
.upcoming-icon {
  width: 20px;
  height: 20px;
  color: var(--color-orange);
}

.today-header h3,
.upcoming-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-orange);
  margin: 0;
}

/* === LISTE D'ÉVÉNEMENTS === */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(245, 224, 185, 0.05);
  border-radius: 6px;
  border-left: 3px solid;
  transition: all 0.2s ease;
}

.event-item:hover {
  background: rgba(245, 224, 185, 0.1);
  transform: translateX(2px);
}

/* Types d'événements */
.event-progression {
  border-left-color: var(--color-orange);
}

.event-reroll {
  border-left-color: #3b82f6;
}

.event-clear {
  border-left-color: var(--color-green);
}

.today-event {
  background: rgba(249, 131, 58, 0.1);
}

.event-icon {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-light);
  line-height: 1.2;
}

.event-content {
  font-size: 11px;
  color: var(--color-gray);
  line-height: 1.3;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(245, 224, 185, 0.1);
  border-radius: 4px;
  padding: 8px;
  min-width: 60px;
  flex-shrink: 0;
}

.event-day {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-orange);
  text-align: center;
  line-height: 1;
}

/* === WRAPPER CALENDRIER === */
.calendar-wrapper {
  flex: 1;
  min-height: 280px;
}

/* === PROCHAINS ÉVÉNEMENTS === */
.upcoming-events {
  background: rgba(245, 224, 185, 0.05);
  border: 1px solid rgba(245, 224, 185, 0.1);
  border-radius: 8px;
  padding: 16px;
}

/* === STYLES V-CALENDAR PERSONNALISÉS === */
:deep(.custom-calendar) {
  --vc-border-color: var(--color-border);
  --vc-bg: transparent;
  --vc-text-color: var(--color-light);
  --vc-border-radius: 8px;
  background: transparent;
  border: none;
}

:deep(.vc-container) {
  background: transparent;
  border: none;
}

:deep(.vc-header) {
  background: transparent;
  padding: 12px 16px;
}

:deep(.vc-title) {
  color: var(--color-light);
  font-weight: 600;
  font-size: 16px;
}

:deep(.vc-arrow) {
  color: var(--color-gray);
  transition: color 0.2s ease;
}

:deep(.vc-arrow:hover) {
  color: var(--color-orange);
}

:deep(.vc-weeks) {
  margin-top: 24px;
  padding: 0 16px 16px;
}

:deep(.vc-weekday) {
  color: var(--color-gray);
  font-size: 11px;
  font-weight: 600;
  padding: 8px 0;
}

:deep(.vc-day) {
  position: relative;
  margin: 1px;
}

:deep(.vc-day-content) {
  color: var(--color-light);
  font-size: 13px;
  font-weight: 500;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.vc-day-content:hover) {
  background: rgba(249, 131, 58, 0.1);
  color: var(--color-orange);
}

:deep(.vc-day.is-today .vc-day-content) {
  background: var(--color-orange);
  color: white;
  font-weight: 700;
}

:deep(.vc-day.is-not-in-month .vc-day-content) {
  color: var(--color-gray);
  opacity: 0.4;
}

/* Highlights des événements */
:deep(.vc-highlight) {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  right: 2px;
}

:deep(.vc-highlight.vc-highlight-base-start) {
  background: currentColor;
}

/* === POPOVER PERSONNALISÉ === */
.custom-popover {
  background: rgba(43, 27, 24, 0.95);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  max-width: 280px;
}

.popover-event:not(:last-child) {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.popover-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.popover-icon {
  font-size: 14px;
}

.popover-title {
  font-weight: 600;
  color: var(--color-light);
  font-size: 14px;
}

.popover-content {
  color: var(--color-gray);
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .raid-calendar {
    gap: 16px;
  }

  .today-events,
  .upcoming-events {
    padding: 12px;
  }

  .event-item {
    padding: 10px;
  }

  .event-title {
    font-size: 12px;
  }

  .event-content {
    font-size: 10px;
  }

  :deep(.vc-day-content) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  :deep(.vc-header) {
    padding: 8px 12px;
  }

  :deep(.vc-weeks) {
    padding: 0 12px 12px;
  }
}
</style>
