<script setup>
defineProps({
  character: Object,
})
</script>

<template>
  <div class="uk-card uk-card-default uk-card-small uk-card-hover uk-padding-small uk-position-relative">
    <div class="uk-card-body">
      <h4 class="uk-margin-remove">{{ character.name }}</h4>
      <p class="uk-margin-remove">Niveau {{ character.level }} - {{ character.class }}</p>
      <p class="uk-margin-remove">Royaume : {{ character.realm }}</p>

      <span
        v-if="character.is_main"
        class="uk-label uk-label-warning uk-position-top-right uk-margin-small"
        title="Personnage principal"
      >
        ⭐ Main
      </span>
    </div>
  </div>
</template>

<style scoped>
.character-card {
  padding: 1rem;
  border-radius: 12px;
  transition: transform 0.2s;
}

.character-card:hover {
  transform: scale(1.02);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
