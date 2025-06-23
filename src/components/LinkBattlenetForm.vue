<script setup>
const emit = defineEmits(['close'])

const clientId = import.meta.env.VITE_BATTLENET_CLIENT_ID
const redirectUri = encodeURIComponent(import.meta.env.VITE_BATTLENET_REDIRECT_URI)
const battleNetAuthUrl = `https://oauth.battle.net/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=astro&response_type=code&scope=wow.profile`
</script>

<template>
  <div class="battlenet-form">
    <!-- Header -->
    <header class="form-header">
      <div class="form-icon battlenet-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M18.5 12c0-2.04-.84-3.88-2.19-5.2L14 9.13c.8.58 1.32 1.52 1.32 2.58 0 1.77-1.43 3.2-3.2 3.2s-3.2-1.43-3.2-3.2c0-1.06.52-2 1.32-2.58L7.93 6.8C6.58 8.12 5.74 9.96 5.74 12c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5z"
          />
          <circle cx="12" cy="12" r="2" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          />
        </svg>
      </div>
      <div class="form-title">
        <h2>⚔️ Lier votre compte Battle.net</h2>
        <p>Connectez Battle.net pour synchroniser vos données de jeu</p>
      </div>
    </header>

    <!-- Content -->
    <div class="form-content">
      <div class="integration-info">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon wow-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <div class="info-content">
              <h3>World of Warcraft</h3>
              <p>Accédez à vos données de personnages et guildes</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon stats-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="info-content">
              <h3>Statistiques</h3>
              <p>Suivez vos performances et progressions</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon sync-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div class="info-content">
              <h3>Synchronisation</h3>
              <p>Mise à jour automatique de vos données</p>
            </div>
          </div>
        </div>
      </div>

      <div class="game-showcase">
        <div class="showcase-header">
          <h3>🎮 Jeux supportés</h3>
          <p>Connectez votre compte Battle.net pour débloquer ces fonctionnalités</p>
        </div>
        <div class="games-grid">
          <div class="game-card wow-card">
            <div class="game-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <div class="game-info">
              <h4>World of Warcraft</h4>
              <p>Personnages, guildes, achievements</p>
            </div>
          </div>
          <div class="game-card">
            <div class="game-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div class="game-info">
              <h4>Plus de jeux</h4>
              <p>Prochainement disponible</p>
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div class="notice-content">
          <h4>Sécurité Blizzard</h4>
          <p>
            Authentification sécurisée via Battle.net OAuth. Seules les données de profil public
            sont accessibles selon les autorisations que vous accordez.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <a :href="battleNetAuthUrl" class="btn btn-primary battlenet-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18.5 12c0-2.04-.84-3.88-2.19-5.2L14 9.13c.8.58 1.32 1.52 1.32 2.58 0 1.77-1.43 3.2-3.2 3.2s-3.2-1.43-3.2-3.2c0-1.06.52-2 1.32-2.58L7.93 6.8C6.58 8.12 5.74 9.96 5.74 12c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5z"
            />
          </svg>
          Se connecter avec Battle.net
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
.battlenet-form {
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
  box-shadow: 0 8px 20px rgba(0, 174, 255, 0.3);
}

.battlenet-icon {
  background: linear-gradient(135deg, #00aeff, #0087cc);
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
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wow-icon {
  background: linear-gradient(135deg, #f4d03f, #d4af37);
}

.stats-icon {
  background: rgba(249, 131, 58, 0.1);
}

.sync-icon {
  background: rgba(0, 174, 255, 0.1);
}

.info-icon svg {
  width: 20px;
  height: 20px;
}

.wow-icon svg {
  color: #8b4513;
}

.stats-icon svg {
  color: var(--color-orange);
}

.sync-icon svg {
  color: #00aeff;
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

/* === GAME SHOWCASE === */
.game-showcase {
  background: rgba(245, 224, 185, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
}

.showcase-header {
  margin-bottom: 20px;
}

.showcase-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--color-light);
}

.showcase-header p {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0;
}

.games-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.game-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(245, 224, 185, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.game-card:hover {
  background: rgba(245, 224, 185, 0.1);
  transform: translateY(-2px);
}

.wow-card:hover {
  border-color: #d4af37;
}

.game-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f4d03f, #d4af37);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.game-icon svg {
  width: 18px;
  height: 18px;
  color: #8b4513;
}

.game-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--color-light);
}

.game-info p {
  font-size: 12px;
  color: var(--color-gray);
  margin: 0;
}

/* === SECURITY NOTICE === */
.security-notice {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 174, 255, 0.1);
  border: 1px solid rgba(0, 174, 255, 0.3);
  border-radius: 12px;
}

.notice-icon {
  width: 48px;
  height: 48px;
  background: #00aeff;
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
  background: linear-gradient(135deg, #00aeff, #0087cc);
  color: white;
  flex: 1;
  box-shadow: 0 4px 16px rgba(0, 174, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 174, 255, 0.4);
}

.battlenet-btn:hover {
  background: linear-gradient(135deg, #0087cc, #006ba3);
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

  .games-grid {
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
