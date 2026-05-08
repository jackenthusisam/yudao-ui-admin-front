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
    <ProjectVisual :tone="project.imageTone" />
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
        <small>会员价 ￥{{ project.memberPrice }}</small>
      </div>
      <RouterLink :to="`/projects/${project.id}`" class="detail-link">查看详情</RouterLink>
    </div>
  </article>
</template>
