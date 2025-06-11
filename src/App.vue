<script setup>
import Toast from '@/components/Toast.vue'
import Navbar from '@/components/Navbar.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const onLogin = computed(() => {
  return router.currentRoute.value.name == 'login' || router.currentRoute.value.path == '/'
})
</script>

<template>
  <Toast />
  <Navbar v-if="!onLogin" />
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component" />
    </transition>
  </RouterView>
</template>
