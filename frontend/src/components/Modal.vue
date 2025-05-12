<script setup>
defineProps({
  show: Boolean,
})
const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<template>
  <div v-if="show" class="uk-modal uk-open" style="display: block" @click.self="close">
    <div class="uk-modal-dialog uk-modal-body uk-width-1-2@m">
      <button class="uk-modal-close-default" type="button" uk-close @click="close"></button>
      <slot name="form" />
    </div>
  </div>
</template>

<style scoped>
.uk-modal {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
}
</style>
