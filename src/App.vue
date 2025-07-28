<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import BaseToast from '@/components/ui/BaseToast.vue'
import Navbar from '@/components/Navbar.vue'

const auth = useAuthStore()
const route = useRoute()

const showNavbar = computed(() => {
  return auth.isAuthenticated() && route.name !== 'login'
})
</script>

<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <RouterView />
    <BaseToast />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background: var(--color-dark);
}
</style>
