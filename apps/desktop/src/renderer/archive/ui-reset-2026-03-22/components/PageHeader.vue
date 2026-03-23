<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>

<template>
  <header class="page-header">
    <p class="page-eyebrow">{{ eyebrow }}</p>
    <h1 class="page-title">{{ title }}</h1>
    <p class="page-description">{{ description }}</p>
  </header>
</template>
