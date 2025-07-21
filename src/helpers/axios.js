import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
})

API.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      auth.refreshToken
    ) {
      originalRequest._retry = true
      const success = await auth.refreshAccessToken()
      if (success) {
        originalRequest.headers.Authorization = `Bearer ${auth.token}`
        return axios(originalRequest)
      } else {
        auth.logout()
      }
    }

    return Promise.reject(error)
  }
)

export default API
