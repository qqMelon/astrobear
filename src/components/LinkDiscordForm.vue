<script setup>
const emit = defineEmits(['close'])

const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_FRONTEND_BASE_URL + '/auth/discord/callback'
const SCOPE = 'identify'

const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}`
</script>

<template>
  <div class="discord-form">
    <!-- Header -->
    <header class="form-header">
      <div class="form-icon discord-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"
          />
        </svg>
      </div>
      <div class="form-title">
        <h2>🔗 Lier votre compte Discord</h2>
        <p>Connectez Discord pour accéder aux fonctionnalités exclusives</p>
      </div>
    </header>

    <!-- Content -->
    <div class="form-content">
      <div class="integration-info">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="info-content">
              <h3>Communauté</h3>
              <p>Rejoignez notre serveur Discord et restez connecté</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div class="info-content">
              <h3>Sécurisé</h3>
              <p>Authentification sécurisée via OAuth2</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div class="info-content">
              <h3>Instantané</h3>
              <p>Connexion rapide en un clic</p>
            </div>
          </div>
        </div>
      </div>

      <div class="security-notice">
        <div class="notice-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div class="notice-content">
          <h4>Confidentialité garantie</h4>
          <p>
            Nous n'accédons qu'aux informations de base de votre profil Discord (nom d'utilisateur
            et avatar). Aucune donnée sensible n'est collectée.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <a :href="discordAuthUrl" class="btn btn-primary discord-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"
            />
          </svg>
          Se connecter avec Discord
        </a>

        <button type="button" class="btn btn-secondary" @click="emit('close')">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Plus tard
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === CONTAINER === */
.discord-form {
  width: 100%;
  color: var(--color-light);
  font-family: 'Inter', sans-serif;
}

/* === HEADER === */
.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.form-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(88, 101, 242, 0.3);
}

.discord-icon {
  background: linear-gradient(135deg, #5865f2, #4752c4);
}

.form-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.form-title h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--color-light);
}

.form-title p {
  font-size: 16px;
  color: var(--color-gray);
  margin: 0;
}

/* === CONTENT === */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.integration-info {
  background: rgba(245, 224, 185, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
}

.info-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: rgba(249, 131, 58, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-orange);
}

.info-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--color-light);
}

.info-content p {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0;
  line-height: 1.4;
}

/* === SECURITY NOTICE === */
.security-notice {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(124, 138, 78, 0.1);
  border: 1px solid rgba(124, 138, 78, 0.3);
  border-radius: 12px;
}

.notice-icon {
  width: 48px;
  height: 48px;
  background: var(--color-green);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.notice-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--color-light);
}

.notice-content p {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0;
  line-height: 1.5;
}

/* === ACTIONS === */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 28px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 60px;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #5865f2, #4752c4);
  color: white;
  flex: 1;
  box-shadow: 0 4px 16px rgba(88, 101, 242, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(88, 101, 242, 0.4);
}

.discord-btn:hover {
  background: linear-gradient(135deg, #4752c4, #3c4ae0);
}

.btn-secondary {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-gray);
}

.btn-secondary:hover {
  border-color: var(--color-orange);
  color: var(--color-light);
  background: rgba(249, 131, 58, 0.1);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .form-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .form-icon {
    width: 48px;
    height: 48px;
  }

  .form-icon svg {
    width: 24px;
    height: 24px;
  }

  .form-title h2 {
    font-size: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .security-notice {
    flex-direction: column;
    gap: 12px;
  }

  .notice-icon {
    width: 40px;
    height: 40px;
  }

  .notice-icon svg {
    width: 20px;
    height: 20px;
  }
}
</style>
