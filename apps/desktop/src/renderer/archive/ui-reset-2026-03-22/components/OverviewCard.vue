<script setup lang="ts">
defineProps<{
  title: string
  value: string
  description: string
}>()
</script>

<template>
  <article class="overview-card">
    <p class="overview-card-title">{{ title }}</p>
    <p class="overview-card-value">{{ value }}</p>
    <p class="overview-card-description">{{ description }}</p>
  </article>
</template>
