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

  console.log('user is authenticated ?', auth.isAuthenticated())

  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    console.log('First condition with nothing in store')
    next({ name: 'login' })
  } else if (to.meta.requiresAuth && auth.isAuthenticated() && !auth.user) {
    console.log('snd condition with authenticated but no user infos')
    try {
      console.log('Try to retreive user')
      await auth.fetchUser()
      console.log('Retrivied user success')
      next()
    } catch (err) {
      console.error('Error return to login: ', err)
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
