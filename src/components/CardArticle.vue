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
        <RouterLink :to="{ name: 'article-detail', params: { slug: article.slug }}" tag="h2" class="article-title">
          {{ article.title }}
        </RouterLink>
      </header>
      <div class="article-body">
        <h3>{{ article.summary }}</h3>
      </div>
      <!--<div class="article-body" v-html="marked.parse(article.content)"></div>-->
      <footer class="article-footer">
        <div class="article-date">
          <p>✍️ {{ article.author }} · {{ new Date(article.date_created).toLocaleDateString() }}</p>
          <small v-if="article.date_updated !== null">Dernière mise à jour: {{ new Date(article.date_updated).toLocaleDateString() }}</small>
        </div>
      </footer>
    </article>
  </div>
</template>

