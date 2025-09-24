<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import API from '@/helpers/axios'

import CardArticle from '@/components/CardArticle.vue'

const route = useRoute()
const isLoading = ref(true)

const articles = ref([])

const loadArticles = async function () {
  const res = await API.get(`/items/articles`)
  articles.value = res.data.data
}

onMounted(async () => {
  await loadArticles()
})
</script>

<template>
  <main class="article-detail">
    <div class="section-content">
      <div v-if="articles.length > 0" class="base-articles">
        <div class="articles-list">
          <div v-for="(article, index) in articles" :key="index" class="articles-item">
            <CardArticle :article="article" />
            ---
          </div>
        </div>
      </div>
      <div v-else class="articles-placeholder">
        <div class="placeholder-item">
          <div class="placeholder-avatar"></div>
          <div class="placeholder-content">
            <div class="placeholder-title"></div>
            <div class="placeholder-text"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.content {
  line-height: 1.6;
}
</style>
