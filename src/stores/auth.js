import { defineStore } from 'pinia'
import axios from 'axios'
import { useToastStore } from '@/stores/toast'

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('astrobear-user-token') || '',
  }),

  actions: {
    // Dans ta méthode login :
    async login(email, password) {
      const toastStore = useToastStore()

      try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password })
        this.token = res.data.data.access_token
        localStorage.setItem('astrobear-user-token', this.token)

        await this.fetchUser()
        toastStore.showSuccess('Connexion réussie ! Bienvenue 👋')
        return true
      } catch (err) {
        console.error('login failed: ', err)
        toastStore.showError(err) // 🎯 Utilise la nouvelle méthode
        return false
      }
    },

    async fetchUser() {
      const res = await axios.get(
        `${API_URL}/users/me?fields=id,first_name,last_name,email,role.name,avatar`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      )
      this.user = res.data.data
    },

    setProfilePicture(blobPicture) {
      this.user.pp = blobPicture
    },

    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('astrobear-user-token')
    },

    isAuthenticated() {
      return !!this.token
    },
  },
})
