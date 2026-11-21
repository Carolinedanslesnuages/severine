<script setup>
import { computed, ref } from 'vue';
import { women, periods, periodLabel } from '../data.js';
import { matchesQuery } from '../format.js';

const query = ref('');
const selectedPeriod = ref('');

const visibleWomen = computed(() => women.filter((woman) =>
  (!selectedPeriod.value || woman.periods.includes(selectedPeriod.value)) && matchesQuery(woman, query.value)));

const countText = computed(() => {
  const count = visibleWomen.value.length;
  return count === 0 ? 'Aucune femme trouvée' : `${count} femme${count > 1 ? 's' : ''}`;
});
</script>

<template>
  <h1 class="page-title" tabindex="-1">Les femmes</h1>
  <p class="lead">
    Elles ont pris les armes, fondé des journaux et des clubs, réclamé leurs droits.
    Beaucoup l'ont payé de leur liberté ou de leur vie. Voici leurs actions, datées et sourcées.
  </p>

  <form class="filters" role="search" @submit.prevent>
    <div class="field">
      <label for="search">Chercher un nom, un lieu, un journal…</label>
      <input id="search" v-model="query" type="search" autocomplete="off">
    </div>
    <fieldset>
      <legend>Période</legend>
      <div class="choices">
        <label class="choice">
          <input v-model="selectedPeriod" type="radio" name="period" value="">
          <span>Toutes</span>
        </label>
        <label v-for="period in periods" :key="period.id" class="choice">
          <input v-model="selectedPeriod" type="radio" name="period" :value="period.id">
          <span>{{ period.label }} <small>({{ period.years.replace('-', '–') }})</small></span>
        </label>
      </div>
    </fieldset>
  </form>

  <p class="count" role="status">{{ countText }}</p>

  <ul class="cards">
    <li v-for="woman in visibleWomen" :key="woman.slug">
      <article class="card">
        <h2><a :href="`#/femme/${woman.slug}`">{{ woman.name }}</a></h2>
        <p class="meta">{{ woman.birth }} – {{ woman.death }} · {{ woman.periods.map(periodLabel).join(', ') }}</p>
        <p>{{ woman.summary }}</p>
      </article>
    </li>
  </ul>
</template>
