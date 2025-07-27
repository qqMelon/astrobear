import { defineStore } from 'pinia'
import axios from 'axios'
import { useToastStore } from '@/stores/toast'
//import { useRouter } from 'vue-router'
import router from '@/router/index.js'

import API from '@/helpers/axios'

//const router = useRouter()

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('astrobear-user-token') || '',
    refreshToken: localStorage.getItem('astrobear-user-refreshToken') || '',
  }),

  actions: {
    async login(email, password) {
      const toastStore = useToastStore()

      try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password })

        this.token = res.data.data.access_token
        this.refreshToken = res.data.data.refresh_token

        localStorage.setItem('astrobear-user-token', this.token)
        localStorage.setItem('astrobear-user-refreshToken', this.refreshToken)

        await this.fetchUser()
        toastStore.showSuccess('Connexion réussie ! Bienvenue 👋')
        return true
      } catch (err) {
        console.error('login failed: ', err)
        toastStore.showError(err)
        return false
      }
    },

    async fetchUser() {
      const res = await API.get('/users/me?fields=id,first_name,last_name,email,role.name,avatar')
      this.user = res.data.data
    },

    async refreshAccessToken() {
      if (!this.refreshToken) return false

      try {
        const res = await API.post('/auth/refresh', {
          refresh_token: this.refreshToken,
        })

        this.token = res.data.data.access_token
        this.refreshToken = res.data.data.refresh_token

        localStorage.setItem('astrobear-user-token', this.token)
        localStorage.setItem('astrobear-user-refreshToken', this.refreshToken)

        return true
      } catch (err) {
        console.error('Echec du refresh token: ', err)
        this.logout()
        return false
      }
    },

    setProfilePicture(blobPicture) {
      this.user.pp = blobPicture
    },

    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('astrobear-user-token')
      router.push({ name: 'login' })
    },

    isAuthenticated() {
      return !!this.token
    },
  },
})
