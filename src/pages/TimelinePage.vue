<script setup>
import { computed, ref } from 'vue';
import { women, themes, themeLabel } from '../data.js';
import { formatDate, timelineOf } from '../format.js';

const selectedTheme = ref('');

/** Actions grouped by year, oldest first. */
const years = computed(() => {
  const groups = new Map();
  for (const action of timelineOf(women)) {
    if (selectedTheme.value && action.theme !== selectedTheme.value) continue;
    const year = action.date.slice(0, 4);
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
    <fieldset>
      <legend>Type d'action</legend>
      <div class="choices">
        <label class="choice">
          <input v-model="selectedTheme" type="radio" name="theme" value="">
          <span>Toutes</span>
        </label>
        <label v-for="theme in themes" :key="theme.id" class="choice">
          <input v-model="selectedTheme" type="radio" name="theme" :value="theme.id">
          <span>{{ theme.label }}</span>
        </label>
      </div>
    </fieldset>
  </form>

  <p class="count" role="status">{{ actionCount }} action{{ actionCount > 1 ? 's' : '' }}</p>

  <section v-for="group in years" :key="group.year" class="year" :aria-labelledby="`annee-${group.year}`">
    <h2 :id="`annee-${group.year}`">{{ group.year }}</h2>
    <ol class="actions">
      <li v-for="action in group.actions" :key="action.woman.slug + action.date + action.text">
        <p class="action-date"><time :datetime="action.date">{{ formatDate(action.date) }}</time></p>
        <p class="action-theme">{{ themeLabel(action.theme) }}</p>
        <p><a :href="`#/femme/${action.woman.slug}`">{{ action.woman.name }}</a> · {{ action.text }}</p>
      </li>
    </ol>
  </section>
</template>
