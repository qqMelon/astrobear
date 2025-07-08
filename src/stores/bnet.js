import { defineStore } from 'pinia'

export const useBnetStore = defineStore('bnet', {
  state: () => ({
    token: localStorage.getItem('astro_battlenet_access') || '',
  }),

  actions: {
    setToken(tokenData) {
      this.token = tokenData
    },
  },
})
