<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const user = auth.user

const router = useRouter()
const showMobile = ref(false)

const defaultAvatar = 'https://via.placeholder.com/32x32.png?text=👤'

function toggleMobileMenu() {
  showMobile.value = !showMobile.value
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="uk-navbar-container uk-navbar" uk-navbar>
    <div class="uk-navbar-left">
      <router-link
        to="/dashboard"
        class="uk-navbar-item uk-logo uk-flex uk-flex-middle min-logo-float"
      >
        <img
          src="@/assets/astrobear_logo.png"
          alt="Astrobear Logo"
          width="52"
          height="52"
          class="uk-margin-small-right uk-margin-small-left"
        />
        <span class="uk-text-bold">Astrobear</span>
      </router-link>

      <ul class="uk-navbar-nav uk-nav uk-visible@s">
        <li :class="{ 'uk-active': $route.name == 'dashboard' }">
          <router-link to="/dashboard" class="uk-link-reset">Dashboard</router-link>
        </li>
        <li :class="{ 'uk-active': $route.name == 'user-profile' }">
          <router-link to="/user-profile" class="uk-link-reset">Profil</router-link>
        </li>
      </ul>
    </div>

    <div class="uk-navbar-right uk-visible@s uk-margin-small-right">
      <div v-if="user" class="uk-navbar-item">
        <div class="uk-inline">
          <button class="uk-button uk-button-text" type="button">
            {{ user.first_name }}
            <img
              :src="`import.meta.env.VITE_BACKEND_BASE_URL/assets/${user.avatar}` || defaultAvatar"
              class="uk-border-circle"
              width="32"
              height="32"
              style="object-fit: cover; margin-right: 8px; margin-left: 8px"
              alt="avatar"
            />
          </button>
          <div class="uk-dropdown uk-dropdown-right" uk-dropdown="mode: click">
            <ul class="uk-nav uk-dropdown-nav">
              <li><router-link to="/user-settings">Paramètres</router-link></li>
              <li class="uk-nav-divider"></li>
              <li><a @click.prevent="logout">Déconnexion</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile toggle -->
    <div class="uk-navbar-toggle uk-hidden@s" uk-navbar-toggle-icon @click="toggleMobileMenu"></div>
  </nav>

  <!-- Mobile menu -->
  <div v-if="showMobile" class="uk-navbar-dropdown uk-hidden@s">
    <ul class="uk-nav uk-navbar-dropdown-nav">
      <li><router-link to="/" @click="toggleMobileMenu">Dashboard</router-link></li>
      <li><router-link to="/user-settings" @click="toggleMobileMenu">Profil</router-link></li>
      <li class="uk-nav-divider"></li>
      <li v-if="user"><a @click="logout">Déconnexion</a></li>
    </ul>
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

.min-logo-float > img {
  border-radius: 50%;
  overflow: hidden;
  object-position: center;
}

.min-logo-float:hover > img {
  /* animation: float 3s ease-in-out infinite; */
  transform: scale(1.3) rotate(5deg);
  transition: transform 0.3s ease-out;
}
</style>
