<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import BaseCard from './BaseCard.vue'

const props = defineProps({
  articles: {
    type: Array,
    required: true,
    // Format: [{ title, date, body, isGithubRelease?, url? }]
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'hover'].includes(value),
  },
  showMeta: {
    type: Boolean,
    default: true,
  },
})

const sortedArticles = computed(() => {
  return [...props.articles].sort((a, b) => new Date(b.date) - new Date(a.date))
})

console.log('BaseArticles - Articles reçus:', props.articles)
</script>

<template>
  <div class="base-articles">
    <div class="articles-list">
      <BaseCard
        v-for="article in sortedArticles"
        :key="article.date"
        :variant="variant"
        padding="default"
        class="article-card"
      >
        <article class="article-content">
          <header class="article-header">
            <h2 class="article-title">
              <a class="article-link" href="">{{ article.title }}</a>
            </h2>

            <div v-if="!article.isGithubRelease && showMeta" class="article-meta">
              <p>
                Written by <a href="#">Super User</a> on 12 April 2012. Posted in
                <a href="#">Blog</a>
              </p>
            </div>
          </header>

          <div class="article-body" v-html="marked.parse(article.body)"></div>

          <footer class="article-footer">
            <div class="article-actions">
              <a
                v-if="article.isGithubRelease"
                :href="article.url"
                target="_blank"
                class="github-link"
              >
                Voir sur GitHub
              </a>
              <a v-else class="read-more-link" href="#">Read more</a>
            </div>
            <div class="article-date">
              <small>{{ new Date(article.date).toLocaleDateString() }}</small>
            </div>
          </footer>
        </article>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
/* === CONTAINER === */
.base-articles {
  width: 100%;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* === ARTICLE CARD === */
.article-card {
  transition: all 0.3s ease;
}

/* === ARTICLE CONTENT === */
.article-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* === HEADER === */
.article-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 16px;
}

.article-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--color-light);
  line-height: 1.3;
}

.article-link {
  color: var(--color-light);
  text-decoration: none;
  transition: color 0.2s ease;
}

.article-link:hover {
  color: var(--color-orange);
}

.article-meta {
  margin: 0;
}

.article-meta p {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0;
}

.article-meta a {
  color: var(--color-orange);
  text-decoration: none;
}

.article-meta a:hover {
  text-decoration: underline;
}

/* === BODY === */
.article-body {
  color: var(--color-light);
  line-height: 1.6;
}

.article-body :deep(p) {
  margin: 0 0 12px 0;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  color: var(--color-light);
  margin: 16px 0 8px 0;
}

.article-body :deep(a) {
  color: var(--color-orange);
  text-decoration: none;
}

.article-body :deep(a:hover) {
  text-decoration: underline;
}

.article-body :deep(code) {
  background: rgba(245, 224, 185, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

.article-body :deep(pre) {
  background: rgba(43, 27, 24, 0.8);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 12px 0;
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--color-orange);
  padding-left: 16px;
  margin: 12px 0;
  color: var(--color-gray);
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 20px;
  margin: 12px 0;
}

.article-body :deep(li) {
  margin: 4px 0;
}

/* === FOOTER === */
.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  gap: 16px;
}

.article-actions {
  display: flex;
  gap: 12px;
}

.github-link,
.read-more-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(245, 224, 185, 0.1);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-light);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.github-link:hover,
.read-more-link:hover {
  background: rgba(245, 224, 185, 0.2);
  border-color: var(--color-orange);
  color: var(--color-orange);
}

.github-link {
  background: rgba(88, 101, 242, 0.1);
  border-color: rgba(88, 101, 242, 0.3);
  color: #5865f2;
}

.github-link:hover {
  background: rgba(88, 101, 242, 0.2);
  border-color: #5865f2;
}

.article-date {
  color: var(--color-gray);
  font-size: 14px;
  flex-shrink: 0;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .article-title {
    font-size: 20px;
  }

  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .article-actions {
    order: 2;
  }

  .article-date {
    order: 1;
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .articles-list {
    gap: 16px;
  }

  .article-title {
    font-size: 18px;
  }

  .github-link,
  .read-more-link {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
