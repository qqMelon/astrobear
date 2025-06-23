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
  <main class="login-container">
    <section class="login-wrapper">
      <header class="login-header">
        <img src="@/assets/logo-sabotache.png" alt="Sabotache Logo" class="logo" />
        <h1 class="login-title">Connexion</h1>
        <p class="login-subtitle">Connectez-vous à votre compte</p>
      </header>

      <form class="login-form" @submit.prevent="handleLogin">
        <fieldset class="form-fields">
          <legend class="sr-only">Informations de connexion</legend>

          <section class="form-group">
            <label for="email" class="form-label">Adresse e-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              :class="{ 'form-input--error': error }"
              placeholder="votre@email.com"
              required
              autocomplete="email"
            />
          </section>

          <section class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              :class="{ 'form-input--error': error }"
              placeholder="Entrez votre mot de passe"
              required
              autocomplete="current-password"
            />
          </section>
        </fieldset>

        <aside class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" class="checkbox" />
            <span class="checkmark"></span>
            Se souvenir de moi
          </label>
          <a href="#" class="forgot-password">Mot de passe oublié ?</a>
        </aside>

        <button
          type="submit"
          class="login-button"
          :class="{ 'login-button--loading': isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Se connecter</span>
          <span v-else class="loading-spinner" aria-label="Connexion en cours"></span>
        </button>

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

      <footer class="login-footer">
        <p>
          Pas encore de compte ?
          <a href="#" class="register-link">Créer un compte</a>
        </p>
      </footer>
    </section>
  </main>
</template>

<style scoped>
/* Reset pour éviter les problèmes de box-sizing */
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
  background: rgba(43, 27, 24, 0.95); /* Couleur dark avec transparence */
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-label {
  font-weight: 600;
  color: var(--color-light);
  font-size: 14px;
}

.form-input {
  height: 48px;
  padding: 0 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: rgba(245, 224, 185, 0.1);
  color: var(--color-light);
  width: 100%;
}

.form-input::placeholder {
  color: var(--color-gray);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(249, 131, 58, 0.2);
  background: rgba(245, 224, 185, 0.15);
}

.form-input--error {
  border-color: var(--color-danger);
}

.form-input--error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
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

.login-button {
  height: 48px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-orange) 100%);
  color: var(--color-light);
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  width: 100%;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249, 131, 58, 0.4);
  background: linear-gradient(135deg, var(--color-orange) 0%, var(--color-accent) 100%);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(245, 224, 185, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-light);
  animation: spin 1s ease-in-out infinite;
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

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.login-footer p {
  color: var(--color-gray);
  font-size: 14px;
  margin: 0;
}

.register-link {
  color: var(--color-orange);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: var(--color-light);
  text-decoration: underline;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Utility classes */
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

@media (max-width: 360px) {
  .form-input {
    font-size: 14px;
  }

  .login-button {
    font-size: 16px;
  }
}
</style>
