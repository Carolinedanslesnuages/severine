<script setup>
import { computed, ref } from 'vue';
import ChoiceGroup from '../components/ChoiceGroup.vue';
import { women, themes, regions, themeLabel } from '../data.js';
import { formatDate, formatYear, timelineOf } from '../format.js';

const selectedTheme = ref('');
const selectedRegion = ref('');

/** Actions grouped by year, oldest first. */
const years = computed(() => {
  const groups = new Map();
  for (const action of timelineOf(women)) {
    if (selectedTheme.value && action.theme !== selectedTheme.value) continue;
    if (selectedRegion.value && !action.woman.regions.includes(selectedRegion.value)) continue;
    const year = formatYear(action.date.slice(0, 4));
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(action);
  }
  return [...groups].map(([year, actions]) => ({ year, actions }));
});

const actionCount = computed(() => years.value.reduce((total, group) => total + group.actions.length, 0));
</script>

<template>
  <h1 class="page-title" tabindex="-1">La frise</h1>
  <p class="lead">Toutes leurs actions, de la plus ancienne à la plus récente.</p>

  <form class="filters" @submit.prevent>
    <ChoiceGroup v-model="selectedTheme" legend="Type d'action" name="theme" :options="themes" />
    <ChoiceGroup v-model="selectedRegion" legend="Région" name="region" :options="regions" />
  </form>

  <p class="count" role="status">{{ actionCount }} action{{ actionCount > 1 ? 's' : '' }}</p>

  <section v-for="(group, index) in years" :key="group.year" class="year" :aria-labelledby="`annee-${index}`">
    <h2 :id="`annee-${index}`">{{ group.year }}</h2>
    <ol class="actions">
      <li v-for="action in group.actions" :key="action.woman.slug + action.date + action.text">
        <p class="action-date"><time :datetime="action.date">{{ formatDate(action.date) }}</time></p>
        <p class="action-theme">{{ themeLabel(action.theme) }}</p>
        <p><a :href="`#/femme/${action.woman.slug}`">{{ action.woman.name }}</a> · {{ action.text }}</p>
      </li>
    </ol>
  </section>
</template>
