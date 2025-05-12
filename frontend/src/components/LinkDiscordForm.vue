<script setup>
// const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID // remplace ça par ton vrai client ID
// const discordAuthUrl = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI)
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
const REDIRECT_URI = 'http://localhost:5173/auth/discord/callback'
const SCOPE = 'identify'

const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}`
</script>

<template>
  <div class="uk-text-center">
    <h3>Lier votre compte Discord</h3>
    <p>Cliquez sur le bouton ci-dessous pour être redirigé vers Discord et autoriser l'accès.</p>
    <a class="uk-button uk-button-primary" :href="discordAuthUrl"> Se connecter avec Discord </a>
    <button class="uk-button uk-button-default uk-margin-left" @click="$emit('close')">
      Annuler
    </button>
  </div>
</template>
