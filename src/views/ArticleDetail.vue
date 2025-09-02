<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import API from '@/helpers/axios'

const route = useRoute()
const article = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await API.get('/items/articles', {
      params: {
        filter: { slug: { _eq: route.params.slug } },
        fields: 'id,title,author,author_image,cover_image,content,date_created'
      }
    })

    article.value = data.data[0] // on prend le premier trouvé
  } catch (err) {
    console.error('Erreur chargement article:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="article-detail">
    <div v-if="isLoading">Chargement...</div>
    <article v-else-if="article">
      <header>
        <img 
          v-if="article.cover_image" 
          :src="`https://dev.admin.astrobear.fr/assets/${article.cover_image}?width=1200`" 
          alt="cover" 
          class="cover" 
        />
        <h1>{{ article.title }}</h1>
        <p>✍️ {{ article.author }} · {{ new Date(article.date_created).toLocaleDateString() }}</p>
      </header>

      <!-- contenu HTML direct du WYSIWYG -->
      <section class="content" v-html="article.content"></section>
    </article>
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
