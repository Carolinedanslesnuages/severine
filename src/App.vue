<script setup>
import { computed, nextTick, watch } from 'vue';
import { route } from './router.js';
import { women } from './data.js';
import HomePage from './pages/HomePage.vue';
import WomanPage from './pages/WomanPage.vue';
import TimelinePage from './pages/TimelinePage.vue';
import AboutPage from './pages/AboutPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';

const currentWoman = computed(() => (route.value.name === 'woman'
  ? women.find((woman) => woman.slug === route.value.slug) : null));

const pageName = computed(() => (route.value.name === 'woman' && !currentWoman.value ? 'notFound' : route.value.name));

const pageTitle = computed(() => ({
  home: 'Les femmes',
  woman: currentWoman.value?.name,
  timeline: 'La frise',
  about: 'À propos',
  notFound: 'Page introuvable',
}[pageName.value]));

const navigation = [
  { name: 'home', href: '#/', label: 'Les femmes' },
  { name: 'timeline', href: '#/frise', label: 'La frise' },
  { name: 'about', href: '#/a-propos', label: 'À propos' },
];

const isCurrent = (item) => item.name === pageName.value || (item.name === 'home' && pageName.value === 'woman');

/** Skip link: focus the main content without changing the hash (the hash holds the page). */
function skipToContent(event) {
  event.preventDefault();
  document.getElementById('contenu').focus();
}

// RGAA 12.x: on each new page, update the title, go to the top and move focus to the page title.
watch(route, async () => {
  await nextTick();
  window.scrollTo(0, 0);
  document.querySelector('.page-title')?.focus();
});
watch(pageTitle, (title) => { document.title = `${title} · Séverine`; }, { immediate: true });
</script>

<template>
  <a class="skip-link" href="#contenu" @click="skipToContent">Aller au contenu</a>
  <header class="site-header">
    <p class="site-name"><a href="#/">Séverine</a></p>
    <p class="site-tagline">Les femmes qui ont fait les révolutions</p>
    <nav aria-label="Menu principal">
      <ul>
        <li v-for="item in navigation" :key="item.name">
          <a :href="item.href" :aria-current="isCurrent(item) ? 'page' : null">{{ item.label }}</a>
        </li>
      </ul>
    </nav>
  </header>
  <main id="contenu" tabindex="-1">
    <HomePage v-if="pageName === 'home'" />
    <WomanPage v-else-if="pageName === 'woman'" :woman="currentWoman" />
    <TimelinePage v-else-if="pageName === 'timeline'" />
    <AboutPage v-else-if="pageName === 'about'" />
    <NotFoundPage v-else />
  </main>
  <footer class="site-footer">
    <p>
      Chaque fait est sourcé. Une erreur, un oubli ?
      <a href="https://github.com/Carolinedanslesnuages/severine">Proposez une correction sur GitHub</a>.
    </p>
  </footer>
</template>
