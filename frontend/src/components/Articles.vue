<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { getLatestReleases } from '@/services/github'

const articles = ref([])

onMounted(async () => {
  const releases = await getLatestReleases()

  articles.value = [
    ...releases,
    {
      title: 'Bienvenue sur Astrobear !',
      date: '2025-04-01',
      body: 'Bienvenue sur le nouveau site de la guilde Team Sabotâche !',
      isGithubRelease: false,
    },
  ]
})
</script>

<template>
  <div>
    <ul class="uk-list uk-list-divider">
      <li v-for="article in articles" :key="article.date">
        <h2 class="uk-article-title">
          <a class="uk-link-reset" href="">{{ article.title }}</a>
        </h2>

        <div v-if="!article.isGithubRelease">
          <p class="uk-article-meta">
            Written by <a href="#">Super User</a> on 12 April 2012. Posted in <a href="#">Blog</a>
          </p>
        </div>

        <p v-html="marked.parse(article.body)"></p>

        <div class="uk-grid-small uk-child-width-auto" uk-grid>
          <div>
            <a v-if="article.isGithubRelease" :href="article.url" target="_blank"
              >Voir sur GitHub</a
            >
            <a v-else class="uk-button uk-button-text" href="#">Read more</a>
          </div>
          <div>
            <small>{{ new Date(article.date).toLocaleDateString() }}</small>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
