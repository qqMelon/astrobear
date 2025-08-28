<script setup>
import { marked } from 'marked'

defineProps({
  article: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'hover'].includes(value),
  },
  padding: {
    type: String,
    default: 'default',
    validator: value => ['none', 'small', 'default', 'large'].includes(value),
  },
})
</script>

<template>
  <div :class="['base-card', `base-card--${variant}`, `base-card--padding-${padding}`]">
    <article class="article-content">
      <header class="article-header">
        <h2 class="article-title">
          <a class="article-link" href="">{{ article.title }}</a>
        </h2>
      </header>
      <div class="article-body">
        <h3>{{ article.summary }}</h3>
      </div>
      <!--<div class="article-body" v-html="marked.parse(article.content)"></div>-->
      <footer class="article-footer">
        <div class="article-date">
          <p>
            Écrit par <a href="#">{{ article.author }}</a> le {{ article.date_created }}.
          </p>
          <small v-if="article.date_updated !== null">Dernière mise à jour: {{ article.date_updated }}</small>
        </div>
      </footer>
    </article>
  </div>
</template>

