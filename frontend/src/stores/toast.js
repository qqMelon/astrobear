import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref('primary')
  const duration = ref(3000)

  function show(msg, t, d) {
    message.value = msg
    type.value = t
    duration.value = d
    visible.value = true

    setTimeout(() => {
      visible.value = false
    }, t)
  }

  function hide() {
    visible.value = false
  }

  return { visible, message, type, duration, show, hide }
})
