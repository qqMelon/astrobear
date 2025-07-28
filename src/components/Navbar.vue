<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

//  Utilise computed pour la réactivité
const user = computed(() => auth.user)
const beurl = import.meta.env.VITE_BACKEND_BASE_URL
const showMobile = ref(false)
const showUserMenu = ref(false)
const isScrolled = ref(false)

// Avatar par défaut fiable qui ne génère pas d'erreur
const defaultAvatar =
  'https://ui-avatars.com/api/?name=User&size=40&background=2B1B18&color=F5E0B9&bold=true&format=png&font-size=0.6'
const userAvatar = ref(defaultAvatar)

async function fetchAvatar() {
  if (!user.value?.avatar || !auth.token) {
    userAvatar.value = defaultAvatar
    return
  }

  try {
    const response = await fetch(`${beurl}/assets/${user.value.avatar}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    if (!response.ok) throw new Error('Erreur chargement avatar')

    const blob = await response.blob()
    userAvatar.value = URL.createObjectURL(blob)
    auth.setProfilePicture(userAvatar.value)
  } catch (err) {
    console.error('Erreur chargement avatar: ', err)
    userAvatar.value = defaultAvatar
  }
}

//  Watcher pour rafraîchir l'avatar quand l'utilisateur change
watch(
  user,
  newUser => {
    if (newUser) {
      fetchAvatar()
    }
  },
  { immediate: true }
)

// Gestion du scroll pour effet glassmorphism
function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function toggleMobileMenu() {
  showMobile.value = !showMobile.value
  showUserMenu.value = false
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  showMobile.value = false
}

function logout() {
  auth.logout()
  router.push('/login')
  showUserMenu.value = false
}

// Fermer les menus quand on clique ailleurs
function closeMenus() {
  showMobile.value = false
  showUserMenu.value = false
}
</script>

<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo et titre -->
      <div class="navbar-brand">
        <router-link to="/dashboard" class="brand-link">
          <div class="brand-logo">
            <img src="@/assets/logo-sabotache.png" alt="Team Sabotache" class="logo-image" />
          </div>
          <div class="brand-text">
            <span class="brand-name">Team Sabotache</span>
            <span class="brand-subtitle">Dashboard</span>
          </div>
        </router-link>
      </div>

      <!-- Navigation principale (Desktop uniquement) -->
      <div v-if="user" class="navbar-nav">
        <router-link to="/dashboard" class="nav-link" active-class="nav-link-active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/user-profile" class="nav-link" active-class="nav-link-active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Profil</span>
        </router-link>
      </div>

      <!-- User menu (Desktop) -->
      <div v-if="user" class="navbar-user">
        <button class="user-button" @click="toggleUserMenu">
          <div class="user-info">
            <span class="user-name">{{ user.first_name }}</span>
            <span class="user-role">Membre</span>
          </div>
          <img :src="userAvatar" :alt="user.first_name || 'Utilisateur'" class="user-avatar" />
          <svg
            class="chevron-icon"
            :class="{ 'chevron-rotated': showUserMenu }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div class="user-dropdown" :class="{ 'user-dropdown-open': showUserMenu }">
          <div class="dropdown-header">
            <img
              :src="userAvatar"
              :alt="user.first_name || 'Utilisateur'"
              class="dropdown-avatar"
            />
            <div class="dropdown-user-info">
              <span class="dropdown-name">{{ user.first_name }} {{ user.last_name }}</span>
              <span class="dropdown-email">{{ user.email }}</span>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <router-link to="/user-settings" class="dropdown-item" @click="closeMenus">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Paramètres</span>
          </router-link>

          <router-link to="/help" class="dropdown-item" @click="closeMenus">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Aide</span>
          </router-link>

          <div class="dropdown-divider"></div>

          <button class="dropdown-item logout-item" @click="logout">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu button -->
      <button class="mobile-menu-button" @click="toggleMobileMenu">
        <svg
          v-if="!showMobile"
          class="mobile-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg v-else class="mobile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ 'mobile-menu-open': showMobile }">
      <div class="mobile-nav">
        <router-link
          to="/dashboard"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="closeMenus"
        >
          <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/user-profile"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="closeMenus"
        >
          <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Profil</span>
        </router-link>
      </div>

      <div v-if="user" class="mobile-user">
        <div class="mobile-user-info">
          <img
            :src="userAvatar"
            :alt="user.first_name || 'Utilisateur'"
            class="mobile-user-avatar"
          />
          <div class="mobile-user-details">
            <span class="mobile-user-name">{{ user.first_name }} {{ user.last_name }}</span>
            <span class="mobile-user-email">{{ user.email }}</span>
          </div>
        </div>

        <div class="mobile-divider"></div>

        <router-link to="/user-settings" class="mobile-nav-link" @click="closeMenus">
          <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Paramètres</span>
        </router-link>

        <button class="mobile-nav-link logout-mobile" @click="logout">
          <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>

    <!-- Overlay pour fermer les menus -->
    <div v-if="showMobile || showUserMenu" class="menu-overlay" @click="closeMenus"></div>
  </nav>
</template>

<style scoped>
/* === NAVBAR CONTAINER === */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(43, 27, 24, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background: rgba(43, 27, 24, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

/* === BRAND === */
.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--color-border);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: 'Archivo Black', sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: var(--color-light);
  line-height: 1;
}

.brand-subtitle {
  font-size: 12px;
  color: var(--color-orange);
  font-weight: 500;
  line-height: 1;
}

/* === NAVIGATION === */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: var(--color-light);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 15px;
}

.nav-link:hover {
  background: rgba(249, 131, 58, 0.1);
  color: var(--color-orange);
}

.nav-link-active {
  background: rgba(249, 131, 58, 0.15);
  color: var(--color-orange);
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* === USER MENU === */
.navbar-user {
  position: relative;
  display: flex;
  align-items: center;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(43, 27, 24, 0.6);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-light);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.user-button:hover {
  border-color: var(--color-orange);
  background: rgba(43, 27, 24, 0.8);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-light);
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: var(--color-gray);
  line-height: 1.2;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: var(--color-gray);
  transition: transform 0.2s ease;
}

.chevron-rotated {
  transform: rotate(180deg);
}

/* === DROPDOWN === */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: rgba(43, 27, 24, 0.95);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 1000;
}

.user-dropdown-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.dropdown-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dropdown-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-light);
  margin-bottom: 4px;
}

.dropdown-email {
  font-size: 13px;
  color: var(--color-gray);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0 20px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--color-light);
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.dropdown-item:hover {
  background: rgba(249, 131, 58, 0.1);
  color: var(--color-orange);
}

.dropdown-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.logout-item {
  color: #ef4444;
  border-top: 1px solid var(--color-border);
  margin-top: 8px;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* === MOBILE MENU === */
.mobile-menu-button {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-light);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-menu-button:hover {
  background: rgba(249, 131, 58, 0.1);
  color: var(--color-orange);
}

.mobile-icon {
  width: 24px;
  height: 24px;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(43, 27, 24, 0.95);
  border-bottom: 2px solid var(--color-border);
  backdrop-filter: blur(20px);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 999;
}

.mobile-menu-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mobile-nav {
  padding: 20px 32px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--color-light);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 8px;
}

.mobile-nav-link:hover,
.mobile-nav-link-active {
  background: rgba(249, 131, 58, 0.1);
  color: var(--color-orange);
}

.mobile-nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.mobile-user {
  border-top: 1px solid var(--color-border);
  padding: 20px 32px;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.mobile-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.mobile-user-details {
  flex: 1;
}

.mobile-user-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-light);
  margin-bottom: 4px;
}

.mobile-user-email {
  display: block;
  font-size: 13px;
  color: var(--color-gray);
}

.mobile-divider {
  height: 1px;
  background: var(--color-border);
  margin: 16px 0;
}

.logout-mobile {
  color: #ef4444;
  border-top: 1px solid var(--color-border);
  margin-top: 8px;
  padding-top: 16px;
}

.logout-mobile:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* === OVERLAY === */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .navbar-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .user-info {
    display: none;
  }

  .user-button {
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 20px;
    height: 70px;
  }

  .brand-text {
    display: none;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .user-dropdown {
    width: 260px;
  }

  .mobile-nav,
  .mobile-user {
    padding: 16px 20px;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 16px;
    height: 60px;
  }

  .brand-logo {
    width: 32px;
    height: 32px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .user-dropdown {
    width: 240px;
  }
}
</style>
