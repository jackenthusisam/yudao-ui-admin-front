<script setup lang="ts">
import { Flame } from 'lucide-vue-next'
import ProjectVisual from './ProjectVisual.vue'
import type { Project } from '../types/project'

defineProps<{
  project: Project
  compact?: boolean
}>()
</script>

<template>
  <article class="project-card" :class="{ compact }">
    <img v-if="project.imageUrl" class="project-image" :src="project.imageUrl" :alt="project.title" />
    <ProjectVisual v-else :tone="project.imageTone" />
    <div class="project-card-body">
      <h3>
        {{ project.title }}
        <span v-if="project.hot" class="hot"><Flame :size="15" />热门</span>
      </h3>
      <p>{{ project.summary }}</p>
      <div class="tag-row">
        <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
      </div>
      <div class="price-row">
        <strong>￥{{ project.price }}</strong>
        <small>销量 {{ project.salesCount ?? 0 }} · 库存 {{ project.stock ?? 0 }}</small>
      </div>
      <RouterLink :to="`/projects/${project.id}`" class="detail-link">查看详情</RouterLink>
    </div>
  </article>
</template>
