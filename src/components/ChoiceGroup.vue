<script setup>
// A group of radio buttons shown as poster labels, with an "all" choice (empty value).
defineProps({
  legend: { type: String, required: true },
  name: { type: String, required: true },
  options: { type: Array, required: true },
});
const selected = defineModel({ type: String, default: '' });
</script>

<template>
  <fieldset>
    <legend>{{ legend }}</legend>
    <div class="choices">
      <label class="choice">
        <input v-model="selected" type="radio" :name="name" value="">
        <span>Toutes</span>
      </label>
      <label v-for="option in options" :key="option.id" class="choice">
        <input v-model="selected" type="radio" :name="name" :value="option.id">
        <span>{{ option.label }}</span>
      </label>
    </div>
  </fieldset>
</template>
