<script setup>
import { computed, ref } from 'vue';
import ChoiceGroup from '../components/ChoiceGroup.vue';
import { women, regions, eras, periodLabel } from '../data.js';
import { lifespan, matchesQuery } from '../format.js';

const query = ref('');
const selectedRegion = ref('');
const selectedEra = ref('');

const visibleWomen = computed(() => women.filter((woman) =>
  (!selectedRegion.value || woman.regions.includes(selectedRegion.value))
  && (!selectedEra.value || woman.era === selectedEra.value)
  && matchesQuery(woman, query.value)));

const countText = computed(() => {
  const count = visibleWomen.value.length;
  return count === 0 ? 'Aucune femme trouvée' : `${count} femme${count > 1 ? 's' : ''}`;
});
</script>

<template>
  <h1 class="page-title" tabindex="-1">Les femmes</h1>
  <p class="lead">
    De Rome à Téhéran, de Paris à La Paz, elles ont pris les armes, fondé des journaux et des
    clubs, réclamé leurs droits. Beaucoup l'ont payé de leur liberté ou de leur vie.
    Voici leurs actions, datées et sourcées.
  </p>

  <form class="filters" role="search" @submit.prevent>
    <div class="field">
      <label for="search">Chercher un nom, un lieu, un journal…</label>
      <input id="search" v-model="query" type="search" autocomplete="off">
    </div>
    <ChoiceGroup v-model="selectedRegion" legend="Région" name="region" :options="regions" />
    <ChoiceGroup v-model="selectedEra" legend="Époque" name="era" :options="eras" />
  </form>

  <p class="count" role="status">{{ countText }}</p>

  <ul class="cards">
    <li v-for="woman in visibleWomen" :key="woman.slug">
      <article class="card">
        <h2><a :href="`#/femme/${woman.slug}`">{{ woman.name }}</a></h2>
        <p class="meta">{{ lifespan(woman) }} · {{ woman.periods.map(periodLabel).join(', ') }}</p>
        <p>{{ woman.summary }}</p>
      </article>
    </li>
  </ul>
</template>
