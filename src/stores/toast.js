import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref('primary')
  const duration = ref(3000)
  const code = ref(null)

  function show(msg, t = 'primary', d = 3000, errorCode = null) {
    message.value = msg
    type.value = t
    duration.value = d
    code.value = errorCode
    visible.value = true
  }

  function hide() {
    visible.value = false
    code.value = null
  }

  // Méthodes spécialisées pour les erreurs HTTP
  function showError(error) {
    let message = ''
    let code = null

    if (error.response) {
      // Erreur avec réponse du serveur
      code = error.response.status
      switch (code) {
        case 400:
          message = 'Requête invalide - Vérifiez vos données'
          break
        case 401:
          message = 'Non autorisé - Veuillez vous reconnecter'
          break
        case 403:
          message = 'Accès interdit - Permissions insuffisantes'
          break
        case 404:
          message = 'Ressource non trouvée'
          break
        case 422:
          message = 'Données invalides - Vérifiez votre saisie'
          break
        case 429:
          message = 'Trop de requêtes - Veuillez patienter'
          break
        case 500:
          message = 'Erreur serveur - Veuillez réessayer'
          break
        case 502:
          message = 'Service temporairement indisponible'
          break
        case 503:
          message = 'Service en maintenance'
          break
        default:
          message = `Erreur ${code} - ${error.response.statusText}`
      }
    } else if (error.request) {
      // Erreur réseau
      message = 'Erreur réseau - Vérifiez votre connexion'
      code = 'NETWORK'
    } else {
      // Autre erreur
      message = "Une erreur inattendue s'est produite"
      code = 'UNKNOWN'
    }

    show(message, 'danger', 5000, code)
  }

  function showSuccess(msg) {
    show(msg, 'success', 3000)
  }

  function showWarning(msg) {
    show(msg, 'warning', 4000)
  }

  function showInfo(msg) {
    show(msg, 'primary', 3000)
  }

  return {
    visible,
    message,
    type,
    duration,
    code,
    show,
    hide,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  }
})
