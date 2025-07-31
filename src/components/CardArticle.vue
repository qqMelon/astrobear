<script setup>
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
        <div v-if="!article.isGithubRelease && showMeta" class="article-meta">
          <p>
          Written by <a href="#">{{ article.author }}</a> on {{ article.date_created }}.
          </p>
        </div>
      </header>
      <div class="article-body" v-html="marked.parse(article.content)"></div>
      <footer class="article-footer">
        <!-- <div class="article-actions"> -->
        <!--   <a -->
        <!--     v-if="article.isGithubRelease" -->
        <!--     :href="article.url" -->
        <!--     target="_blank" -->
        <!--     class="github-link" -->
        <!--   > -->
        <!--     Voir sur GitHub -->
        <!--   </a> -->
          <!-- <a v-else class="read-more-link" href="#">Read more</a> -->
        <!-- </div> -->
        <div class="article-date">
          <small>{{ article.date_updated.toLocaleDateString() }}</small>
        </div>
      </footer>
    </article>
  </div>
</template>

