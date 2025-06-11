<script setup>
const clientId = import.meta.env.VITE_BATTLENET_CLIENT_ID // remplace ça par ton vrai client ID
const redirectUri = encodeURIComponent(import.meta.env.VITE_BATTLENET_REDIRECT_URI)
const battleNetAuthUrl = `https://oauth.battle.net/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=astro&response_type=code&scope=wow.profile`
</script>

<template>
  <div class="uk-text-center">
    <h3>Lier votre compte Battle.net</h3>
    <p>Cliquez sur le bouton ci-dessous pour être redirigé vers Battle.net et autoriser l'accès.</p>
    <a class="uk-button uk-button-primary" :href="battleNetAuthUrl">
      Se connecter avec Battle.net
    </a>
    <button class="uk-button uk-button-default uk-margin-left" @click="$emit('close')">
      Annuler
    </button>
  </div>
</template>
