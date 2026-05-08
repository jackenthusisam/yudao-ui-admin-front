<script setup lang="ts">
defineProps<{
  title: string
  link?: string
}>()
</script>

<template>
  <div class="section-title">
    <h2>{{ title }}</h2>
    <RouterLink v-if="link" :to="link">查看更多 ›</RouterLink>
  </div>
</template>
