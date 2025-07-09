<template>
  <div
    class="character-card uk-card uk-card-default uk-card-hover uk-flex uk-flex-middle uk-margin"
  >
    <div class="uk-margin-left">
      <h4 class="uk-margin-remove">{{ character.name }}</h4>
      <p class="uk-margin-remove">
        Niveau {{ character.level }} – {{ character.playable_class.name.fr_FR }}<br />
        Serveur : {{ character.realm.name.fr_FR }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  character: Object,
})
</script>

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
