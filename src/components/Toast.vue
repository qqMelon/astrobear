<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToastStore } from '../stores/toast'

const toast = useToastStore()
const { visible, message, type } = storeToRefs(toast)

const close = () => {
  toast.hide()
}

onMounted(() => {
  if (visible.value) {
    setTimeout(() => {
      toast.hide()
    }, toast.duration)
  }
})
</script>

<template>
  <div
    v-if="visible"
    class="uk-alert"
    :class="`uk-alert-${type}`"
    uk-alert
    style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 250px"
  >
    <a class="uk-alert-close" uk-close @click="close"></a>
    <p>{{ message }}</p>
  </div>
</template>
