<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const loading = ref(false)

const error = ref(null)
const countdown = ref(5)

onMounted(async () => {
  loading.value = true
  const code = route.query.code

  if (!code) {
    toast.show("Code d'authentification manquant", 'danger')
    return
  }

  try {
    const clientId = import.meta.env.VITE_BATTLENET_CLIENT_ID
    const clientSecret = import.meta.env.VITE_BATTLENET_CLIENT_SECRET
    const redirectUri = import.meta.env.VITE_BATTLENET_REDIRECT_URI

    const basicAuth = btoa(`${clientId}:${clientSecret}`)

    const res = await fetch('https://oauth.battle.net/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await res.json()

    if (!res.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Impossible de récupérer le token Battle.net')
    }

    const expiryTimestamp = Date.now() + tokenData.expires_in * 1000

    localStorage.setItem(
      'astro_battlenet_access',
      JSON.stringify({
        ...tokenData,
        expiry: expiryTimestamp,
      })
    )

    const interval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(interval)
        router.push({ name: 'user-settings' })
      }
    }, 1000)
  } catch (err) {
    error.value = err.message || 'Échec de la connexion à Battle.net.'
  }
})
</script>

<template>
  <div class="uk-container uk-text-center uk-margin-large-top">
    <p v-if="!error" class="uk-margin-top">Connexion à Battle.net réussie !</p>
    <p v-if="!error">
      Redirection dans {{ countdown }} seconde<span v-if="countdown > 1">s</span>...
    </p>
    <BaseButton type="submit" variant="primary" :full-width="true">
      Partir tout de suite !
    </BaseButton>

    <p v-if="error" class="uk-text-danger">❌ {{ error }}</p>
  </div>
</template>
