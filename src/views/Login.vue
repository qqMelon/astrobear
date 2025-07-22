<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const auth = useAuthStore()
const toastStore = useToastStore()

const storedEmail = localStorage.getItem('astrobear-last-email')

const email = ref(storedEmail || 'john@doe.com')
const password = ref('test') // Temporaire pour les tests
const keepDataLogin = ref(!!storedEmail)
const error = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = false
  isLoading.value = true

  if (keepDataLogin.value) {
    localStorage.setItem('astrobear-last-email', email.value)
  } else {
    localStorage.removeItem('astrobear-last-email')
  }

  const success = await auth.login(email.value, password.value)
  if (success) {
    toastStore.showSuccess('Connexion réussie ! Bienvenue 👋')
    router.push('/dashboard')
  } else {
    toastStore.showError('Identifiants incorrects 😕')
    error.value = true
  }

  isLoading.value = false
}
</script>

<template>
  <main class="login-container">
    <section class="login-wrapper">
      <header class="login-header">
        <img src="@/assets/logo-sabotache.png" alt="Sabotache Logo" class="logo" />
        <h1 class="login-title">Connexion</h1>
        <p class="login-subtitle">Accès réservé aux membres de la guilde</p>
      </header>

      <form class="login-form" @submit.prevent="handleLogin">
        <fieldset class="form-fields">
          <legend class="sr-only">Informations de connexion</legend>

          <BaseInput
            v-model="email"
            label="Adresse e-mail"
            type="email"
            placeholder="votre@email.com"
            :error="error"
            :required="true"
            autocomplete="email"
          />

          <BaseInput
            v-model="password"
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            :error="error"
            :required="true"
            autocomplete="current-password"
          />
        </fieldset>

        <aside class="form-options">
          <label class="checkbox-container">
            <input v-model="keepDataLogin" type="checkbox" class="checkbox" value="true" />
            <span class="checkmark"></span>
            Se souvenir de moi
          </label>
          <a href="#" class="forgot-password">Mot de passe oublié ?</a>
        </aside>

        <BaseButton
          type="submit"
          variant="primary"
          size="large"
          :loading="isLoading"
          :full-width="true"
        >
          Se connecter
        </BaseButton>

        <output v-if="error" class="error-message" role="alert" aria-live="polite">
          <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          Identifiants incorrects. Veuillez réessayer.
        </output>
      </form>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-dark) 100%);
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.login-wrapper {
  background: rgba(43, 27, 24, 0.95);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
  transition: transform 0.3s ease;
  border: 3px solid var(--color-orange);
}

.logo:hover {
  transform: scale(1.05) rotate(2deg);
  border-color: var(--color-light);
}

.login-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 28px;
  font-weight: bold;
  color: var(--color-light);
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.login-subtitle {
  color: var(--color-gray);
  font-size: 16px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-fields {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-light);
}

.checkbox {
  margin-right: 8px;
  width: auto;
  accent-color: var(--color-orange);
}

.forgot-password {
  color: var(--color-orange);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: var(--color-light);
  text-decoration: underline;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-danger);
  font-size: 14px;
  background: rgba(239, 68, 68, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  width: 100%;
}

.error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  main {
    padding: 16px;
  }

  .login-wrapper {
    padding: 24px;
    max-width: 100%;
  }

  .logo {
    width: 100px;
    height: 100px;
  }

  .login-title {
    font-size: 24px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
