<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '@/stores/toast'

const email = ref('john@doe.com')
const password = ref('test')
const error = ref(false)
const router = useRouter()
const auth = useAuthStore()
const toastStore = useToastStore()

const handleLogin = async () => {
  error.value = false
  const success = await auth.login(email.value, password.value)
  if (success) {
    toastStore.show('Connexion réussie ! Bienvenue 👋', 'success')
    router.push('/dashboard')
  } else {
    toastStore.show('Identifiants incorrects 😕', 'danger')
    error.value = true
  }
}
</script>

<template>
  <div class="uk-container uk-margin-top">
    <div class="uk-container">
      <img
        src="@/assets/astrobear_logo.png"
        alt="Astrobear Logo"
        width="182"
        height="182"
        class="logo-float"
      />
    </div>
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <div class="uk-margin">
        <input class="uk-input" type="email" v-model="email" placeholder="Email" />
      </div>
      <div class="uk-margin">
        <input class="uk-input" type="password" v-model="password" placeholder="Mot de passe" />
      </div>
      <button class="uk-button uk-button-primary">Se connecter</button>
    </form>
    <p v-if="error" class="uk-text-danger">Erreur de connexion</p>
  </div>
</template>

<style>
@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-4px) rotate(1deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.logo-float {
  animation: float 3s ease-in-out infinite;
  border-radius: 50%;
  overflow: hidden;
  object-position: center;
}

.logo-float:hover {
  transform: scale(1.05) rotate(2deg);
  transition: transform 0.3s ease;
}
</style>
