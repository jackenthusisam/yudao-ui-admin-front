<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight, Crown, Search } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'
import ProjectCard from '../components/ProjectCard.vue'
import ProjectVisual from '../components/ProjectVisual.vue'
import { categories, projects } from '../data/projects'

const activeCategory = ref('all')
const keyword = ref('')

const filteredProjects = computed(() => {
  const byCategory = activeCategory.value === 'all'
    ? projects
    : projects.filter((project) => project.category === activeCategory.value)

  return byCategory.filter((project) =>
    `${project.title}${project.summary}${project.tags.join('')}`.toLowerCase().includes(keyword.value.toLowerCase()),
  )
})
</script>

<template>
  <AppLayout>
    <section class="sub-hero">
      <div class="container sub-hero-grid">
        <div>
          <h1>项目商城</h1>
          <p>按类目筛选优质项目，快速找到适合你的变现方案</p>
        </div>
        <div class="cube-art">
          <Crown :size="64" />
        </div>
      </div>
    </section>

    <section class="container market-layout">
      <aside class="market-sidebar">
        <h3>项目类目</h3>
        <button
          v-for="category in categories"
          :key="category.id"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          <component :is="category.icon" :size="18" />
          <span>{{ category.name }}</span>
          <small>{{ category.count }}</small>
        </button>

        <div class="member-card">
          <h3>开通会员</h3>
          <strong>699<span>会员</span></strong>
          <p>解锁更多优质项目</p>
          <ul>
            <li>会员专享价格</li>
            <li>项目更新提醒</li>
            <li>优先查看新项目</li>
            <li>推广返佣</li>
          </ul>
          <RouterLink to="/membership" class="primary-btn compact"><Crown :size="18" />立即开通会员</RouterLink>
        </div>
      </aside>

      <div class="market-main">
        <div class="filter-panel">
          <div class="category-pills">
            <button
              v-for="category in categories"
              :key="category.id"
              :class="{ active: activeCategory === category.id }"
              @click="activeCategory = category.id"
            >
              {{ category.name }}
            </button>
          </div>
          <div class="toolbar">
            <label class="inline-search">
              <Search :size="20" />
              <input v-model="keyword" placeholder="搜索项目 / 关键词" />
            </label>
            <button class="sort active">最新 <ChevronDown :size="16" /></button>
            <button class="sort">最热</button>
            <button class="sort">价格</button>
            <button class="sort">推荐</button>
          </div>
          <div class="market-grid">
            <ProjectCard v-for="project in filteredProjects" :key="project.id" :project="project" />
          </div>
          <div class="pagination">
            <button><ChevronLeft :size="18" /></button>
            <button class="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <span>...</span>
            <button>16</button>
            <button><ChevronRight :size="18" /></button>
            <span>共 16 页</span>
          </div>
        </div>
      </div>
    </section>

    <section class="container block">
      <div class="section-title"><h2>热门推荐</h2><RouterLink to="/market">查看更多 ›</RouterLink></div>
      <div class="recommend-strip">
        <RouterLink v-for="project in projects.slice(0, 4)" :key="project.id" :to="`/projects/${project.id}`">
          <ProjectVisual :tone="project.imageTone" />
          <div><strong>{{ project.title }}</strong><span>￥{{ project.memberPrice }}起</span></div>
        </RouterLink>
      </div>
    </section>
  </AppLayout>
</template>
