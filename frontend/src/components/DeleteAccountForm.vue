<script setup></script>

<template>
  <div class="uk-text-center">
    <h3>Confirmez-vous la suppression des données liées à votre compte ?</h3>
    <p>
      Dans la démarche de suppression des données de votre compte, vous ne pourrez plus vous
      connecter à votre compte et vous aurez 7 jours à compté de l'action pour réclamer vos données
      ou réactiver votre compte.
    </p>
    <a class="uk-button uk-button-danger"> Je confirme supprimer mon compte et ses données </a>
    <button class="uk-button uk-button-default uk-margin-left" @click="$emit('close')">
      Annuler
    </button>
  </div>
</template>
