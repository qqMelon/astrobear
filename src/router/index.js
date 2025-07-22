import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'dashboard' },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/user-settings',
      name: 'user-settings',
      component: () => import('./../views/UserSettings.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('./../views/UserProfile.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/oauth/callback',
      name: 'battlenet-callback',
      component: () => import('./../views/callbacks/BattlenetCallback.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/auth/discord/callback',
      name: 'discord-callback',
      component: () => import('./../views/callbacks/DiscordCallback.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/help',
      name: 'helps',
      component: () => import('./../views/Help.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated()) {
      console.log('Non authentifié → login')
      return next({ name: 'login' })
    }

    try {
      if (!auth.user) {
        console.log('Pas de user, tentative de récupération...')
        await auth.fetchUser()
      }
      return next()
    } catch (err) {
      console.warn('❌ Token peut-être expiré, tentative de refresh...')

      const refreshed = await auth.refreshAccessToken()
      if (refreshed) {
        try {
          await auth.fetchUser()
          return next()
        } catch {
          return next({ name: 'login' })
        }
      } else {
        return next({ name: 'login' })
      }
    }
  }

  return next()
})

export default router
