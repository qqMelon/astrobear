<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const toast = useToastStore()

onMounted(async () => {
  const code = route.query.code

  if (!code) {
    toast.show("Code d'authentification manquant", 'danger')
    return
  }

  try {
    const token = localStorage.getItem('astrobear-user-token')
    const res = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/battlenet-link', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    console.log('Test check token bnet: ', await res.json())

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.errors?.[0]?.message || 'Erreur inconnue.')
    }

    toast.show('Compte Battle.net lié avec succès !', 'success')
  } catch (e) {
    toast.show(e.message, 'danger')
  }
})
</script>

<template>
  <div class="uk-container uk-text-center uk-margin-large-top">
    <div uk-spinner="ratio: 3"></div>
    <p class="uk-margin-top">Connexion à Battle.net...</p>
  </div>
</template>
