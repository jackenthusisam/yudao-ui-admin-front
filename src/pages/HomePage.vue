<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CheckCircle2, Crown, MessageCircle, Rocket, Search, ShoppingBag, TrendingUp } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'
import ProjectCard from '../components/ProjectCard.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { stats } from '../data/projects'
import { marketConfig } from '../services/marketConfig'
import { projectService } from '../services/projectService'
import type { Category, Project } from '../types/project'

const categories = ref<Category[]>([])
const featured = ref<Project[]>([])

onMounted(async () => {
  const [categoryList, projectList] = await Promise.all([
    projectService.listCategories(),
    projectService.listProjects('all', '', 'hot'),
  ])
  categories.value = categoryList
  featured.value = projectList.slice(0, 6)
})
</script>

<template>
  <AppLayout>
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-copy">
          <h1>精选项目，<span>一站式落地变现</span></h1>
          <p>覆盖脚本项目、平台项目、无人直播、App广告拉新、广告联盟等多个方向，帮助团队快速上线与执行。</p>
          <div class="search-box">
            <Search :size="22" />
            <input placeholder="搜索项目 / 类目 / 关键词" />
            <RouterLink to="/market">搜索</RouterLink>
          </div>
          <div class="hero-actions">
            <RouterLink to="/market" class="primary-btn"><ShoppingBag :size="20" />进入商城</RouterLink>
            <RouterLink to="/membership" class="outline-btn wide"><MessageCircle :size="20" />咨询方案</RouterLink>
          </div>
        </div>

        <div class="hero-dashboard" aria-label="运营数据概览">
          <div class="dashboard-sidebar"></div>
          <div class="dashboard-panel">
            <div class="dash-head">
              <strong>欢迎回来，运营官</strong>
              <span></span>
            </div>
            <div class="dash-metrics">
              <div><span>浏览量</span><strong>12,560</strong><small>+12.5%</small></div>
              <div><span>新增用户</span><strong>1,258</strong><small>+8.3%</small></div>
              <div><span>成交订单</span><strong>386</strong><small>+15.7%</small></div>
              <div><span>预估收益</span><strong>￥28,560</strong><small>+18.6%</small></div>
            </div>
            <div class="dash-charts">
              <div class="line-chart"></div>
              <div class="donut-chart"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="container stat-strip">
        <div v-for="item in stats" :key="item.label" class="stat-item">
          <span :class="`tone-${item.tone}`"><component :is="item.icon" :size="28" /></span>
          <div><small>{{ item.label }}</small><strong>{{ item.value }}</strong></div>
        </div>
      </div>
    </section>

    <section class="container block">
      <SectionTitle title="热门类目" link="/market" />
      <div class="category-grid">
        <RouterLink v-for="category in categories.slice(1)" :key="category.id" to="/market" class="category-tile" :class="`tile-${category.tone}`">
          <component :is="category.icon" :size="44" />
          <strong>{{ category.name }}</strong>
          <span>{{ category.description }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="container block">
      <SectionTitle title="精选项目" link="/market" />
      <div class="home-project-grid">
        <ProjectCard v-for="project in featured" :key="project.id" :project="project" compact />
      </div>
    </section>

    <section class="container block">
      <h2 class="center-title">为什么选择我们</h2>
      <div class="why-grid">
        <div><ShoppingBag :size="44" /><strong>项目多</strong><span>覆盖主流变现方向，持续筛选优质项目。</span></div>
        <div><Rocket :size="44" /><strong>落地快</strong><span>提供详细教程与执行指导，快速上手落地。</span></div>
        <div><CheckCircle2 :size="44" /><strong>可复制</strong><span>成熟方法论与SOP，降低试错成本。</span></div>
        <div><TrendingUp :size="44" /><strong>持续上新</strong><span>每周更新优质项目，紧跟市场机会。</span></div>
      </div>
    </section>

    <section class="container block">
      <h2 class="center-title">招商开通信息</h2>
      <div class="info-grid">
        <div><ShoppingBag :size="36" /><strong>项目有哪些</strong><span>商品来自 Java 后端商城模块，后台上架后会同步到项目商城。</span></div>
        <div><MessageCircle :size="36" /><strong>如何联系我们</strong><span>{{ marketConfig.contactPhone }} / {{ marketConfig.contactWechat }}</span></div>
        <div><Rocket :size="36" /><strong>怎么开通</strong><span>{{ marketConfig.openingSteps.join('，') }}</span></div>
        <div><CheckCircle2 :size="36" /><strong>怎么注册</strong><span>{{ marketConfig.registerText }}</span></div>
      </div>
    </section>

    <section class="container membership-banner">
      <div class="crown-art"><Crown :size="72" /></div>
      <div>
        <h2>开通会员，解锁更多优质项目</h2>
        <p>699会员，专享更多权益，助力快速变现与增长。</p>
      </div>
      <div class="banner-price"><span>￥</span><strong>699</strong><small>/年起</small></div>
      <RouterLink to="/membership" class="primary-btn"><Crown :size="18" />立即开通会员</RouterLink>
    </section>
  </AppLayout>
</template>
