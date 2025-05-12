<script setup>
import { ref } from 'vue'

const raidEvents = ref([
  {
    start: new Date(2025, 3, 30),
    end: new Date(2025, 3, 30),
    title: 'Liberation Of Undermine - Progression',
    content: 'Rendez-vous à 20h45 sur Discord',
  },
  {
    start: new Date(2025, 4, 4),
    end: new Date(2025, 4, 4),
    title: 'Liberation Of Undermine - Reroll',
    content: 'Transmo + succès + Gearing rerolls',
  },
])
</script>
<template>
  <v-calendar
    is-expanded
    :attributes="
      raidEvents.map((raid) => ({
        key: raid.title,
        highlight: true,
        dates: { start: raid.start, end: raid.end },
        popover: {
          label: `${raid.title} - ${raid.content}`,
        },
      }))
    "
  />
</template>
