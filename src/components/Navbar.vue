<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const user = auth.user
const beurl = import.meta.env.VITE_BACKEND_BASE_URL
const showMobile = ref(false)
const showUserMenu = ref(false)
const isScrolled = ref(false)

const defaultAvatar = 'https://via.placeholder.com/40x40.png?text=👤'

const userAvatar = ref(defaultAvatar)

async function fetchAvatar() {
  if (!user.avatar || !auth.token) return

  try {
    const response = await fetch(`${beurl}/assets/${user.avatar}`, {
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

// Gestion du scroll pour effet glassmorphism
function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  fetchAvatar()
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
        <router-link to="/dashboard" class="brand-link" @click="closeMenus">
          <div class="brand-logo">
            <img src="@/assets/logo-sabotache.png" alt="Team Sabotache" class="logo-image" />
          </div>
          <div class="brand-text">
            <span class="brand-name">Team Sabotache</span>
            <span class="brand-subtitle">Dashboard</span>
          </div>
        </router-link>
      </div>

      <!-- Navigation principale (Desktop) -->

      <!-- User menu (Desktop) -->
      <div v-if="user" class="navbar-user">
        <button class="user-button" @click="toggleUserMenu">
          <div class="user-info">
            <span class="user-name">{{ user.first_name }}</span>
            <span class="user-role">Membre</span>
          </div>
          <img :src="userAvatar" :alt="user.first_name" class="user-avatar" />
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
            <img :src="userAvatar" :alt="user.first_name" class="dropdown-avatar" />
            <div class="dropdown-user-info">
              <span class="dropdown-name">{{ user.first_name }} {{ user.last_name }}</span>
              <span class="dropdown-email">membre@teamsabotache.com</span>
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
          :class="{ 'mobile-nav-link-active': route.name === 'dashboard' }"
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
          :class="{ 'mobile-nav-link-active': route.name === 'user-profile' }"
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
          <img :src="userAvatar" :alt="user.first_name" class="mobile-user-avatar" />
          <div class="mobile-user-details">
            <span class="mobile-user-name">{{ user.first_name }} {{ user.last_name }}</span>
            <span class="mobile-user-email">membre@teamsabotache.com</span>
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
  border-bottom: 2px solid var(--color-border);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background: rgba(43, 27, 24, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
  color: var(--color-light);
  transition: all 0.3s ease;
}

.brand-link:hover {
  transform: translateX(4px);
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-accent), var(--color-orange));
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.brand-link:hover .brand-logo {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 20px rgba(249, 131, 58, 0.4);
}

.logo-image {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 8px;
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
  color: var(--color-gray);
  font-weight: 500;
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
  color: var(--color-gray);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--color-light);
  background: rgba(245, 224, 185, 0.1);
  transform: translateY(-2px);
}

.nav-link-active {
  color: var(--color-orange);
  background: rgba(249, 131, 58, 0.1);
  border: 1px solid rgba(249, 131, 58, 0.3);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

/* === USER MENU === */
.navbar-user {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(245, 224, 185, 0.1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-button:hover {
  background: rgba(245, 224, 185, 0.15);
  border-color: var(--color-orange);
  transform: translateY(-2px);
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
  line-height: 1;
}

.user-role {
  font-size: 12px;
  color: var(--color-gray);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
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

/* === USER DROPDOWN === */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: rgba(43, 27, 24, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
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
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-light);
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
  color: var(--color-gray);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  color: var(--color-light);
  background: rgba(245, 224, 185, 0.1);
}

.logout-item:hover {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-icon {
  width: 18px;
  height: 18px;
}

/* === MOBILE === */
.mobile-menu-button {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: none;
  border: none;
  color: var(--color-light);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-menu-button:hover {
  background: rgba(245, 224, 185, 0.1);
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
  backdrop-filter: blur(20px);
  border-bottom: 2px solid var(--color-border);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.mobile-menu-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  color: var(--color-gray);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-nav-link:hover {
  color: var(--color-light);
  background: rgba(245, 224, 185, 0.1);
}

.mobile-nav-link-active {
  color: var(--color-orange);
  background: rgba(249, 131, 58, 0.1);
  border: 1px solid rgba(249, 131, 58, 0.3);
}

.logout-mobile:hover {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.mobile-nav-icon {
  width: 20px;
  height: 20px;
}

.mobile-user {
  border-top: 1px solid var(--color-border);
  padding: 20px;
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
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-light);
}

.mobile-user-email {
  font-size: 13px;
  color: var(--color-gray);
}

.mobile-divider {
  height: 1px;
  background: var(--color-border);
  margin: 16px 0;
}

/* === OVERLAY === */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 20px;
    height: 70px;
  }

  .navbar-nav,
  .navbar-user {
    display: none;
  }

  .mobile-menu-button {
    display: flex;
  }

  .brand-text {
    display: none;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .logo-image {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 16px;
  }

  .mobile-nav,
  .mobile-user {
    padding: 16px;
  }
}
</style>
