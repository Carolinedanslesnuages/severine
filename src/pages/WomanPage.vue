<script setup>
import { computed } from 'vue';
import { women, periodLabel, themeLabel } from '../data.js';
import { formatDate, gallicaSearchUrl } from '../format.js';

const props = defineProps({ woman: { type: Object, required: true } });

const position = computed(() => women.findIndex((woman) => woman.slug === props.woman.slug));
const previousWoman = computed(() => women[position.value - 1]);
const nextWoman = computed(() => women[position.value + 1]);

/** "Olivier Blanc, Olympe de Gouges, Syros, 1981" */
const sourceText = (source) => [source.author, source.title, source.publisher, source.year].filter(Boolean).join(', ');
</script>

<template>
  <p class="back"><a href="#/">Toutes les femmes</a></p>
  <h1 class="page-title" tabindex="-1">{{ woman.name }}</h1>
  <p class="meta">{{ woman.birth }} – {{ woman.death }} · {{ woman.periods.map(periodLabel).join(', ') }}</p>
  <p class="lead">{{ woman.summary }}</p>

  <h2>Ses actions</h2>
  <ol class="actions">
    <li v-for="action in woman.actions" :key="action.date + action.text">
      <p class="action-date"><time :datetime="action.date">{{ formatDate(action.date) }}</time></p>
      <p class="action-theme">{{ themeLabel(action.theme) }}</p>
      <p>{{ action.text }}</p>
    </li>
  </ol>

  <h2>Sources</h2>
  <ul class="sources">
    <li v-for="source in woman.sources" :key="source.title">
      <a v-if="source.url" :href="source.url">{{ sourceText(source) }}</a>
      <template v-else>{{ sourceText(source) }}</template>
    </li>
  </ul>
  <p>
    <a :href="gallicaSearchUrl(woman.name)">Chercher « {{ woman.name }} » dans Gallica, la bibliothèque numérique de la BnF</a>
  </p>

  <nav class="pager" aria-label="Femme précédente et suivante">
    <a v-if="previousWoman" :href="`#/femme/${previousWoman.slug}`" rel="prev">Précédente : {{ previousWoman.name }}</a>
    <a v-if="nextWoman" :href="`#/femme/${nextWoman.slug}`" rel="next">Suivante : {{ nextWoman.name }}</a>
  </nav>
</template>
