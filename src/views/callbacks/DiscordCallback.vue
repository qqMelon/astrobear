<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

onMounted(async () => {
  const code = route.query.code

  if (!code) {
    toast.show("Code d'authentification manquant", 'danger')
    return
  }

  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_BASE_URL + '/functions/link-discord',
      { code }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.errors?.[0]?.message || 'Erreur inconnue.')
    }

    toast.show('Compte Discord lié avec succès !', 'success')
  } catch (e) {
    toast.show(e.message, 'danger')
  } finally {
    router.push('/profile')
  }
})
</script>

<template>
  <div class="uk-container uk-text-center uk-margin-large-top">
    <div uk-spinner="ratio: 3"></div>
    <p class="uk-margin-top">Connexion à Discord ...</p>
  </div>
</template>
