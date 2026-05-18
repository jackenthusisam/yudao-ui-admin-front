<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bot, CalendarDays, CheckCircle2, Crown, MessageCircle, PackageCheck, ShoppingCart, UsersRound } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'
import ProjectCard from '../components/ProjectCard.vue'
import ProjectVisual from '../components/ProjectVisual.vue'
import { getProjectById } from '../data/projects'
import { authService } from '../services/authService'
import { cartService } from '../services/cartService'
import { marketConfig } from '../services/marketConfig'
import { projectService } from '../services/projectService'
import type { Project } from '../types/project'

const route = useRoute()
const router = useRouter()
const project = ref<Project>(getProjectById(String(route.params.id)))
const related = ref<Project[]>([])
const actionMessage = ref('')
const actionLoading = ref(false)
const descriptionText = computed(() => project.value.projectIntro || project.value.description?.replace(/<[^>]+>/g, '').trim() || project.value.summary)
const imageRelated = computed(() => related.value.filter((item) => item.imageUrl))
const visualRelated = computed(() => related.value.filter((item) => !item.imageUrl))

const loadProject = async () => {
  const id = String(route.params.id)
  project.value = await projectService.getProject(id)
  related.value = await projectService.listRelatedProjects(id, project.value.category)
}

onMounted(loadProject)
watch(() => route.params.id, loadProject)

const addToCart = async () => {
  actionMessage.value = ''
  if (!authService.isLoggedIn.value) {
    await router.push('/login')
    return
  }
  if (!project.value.skuId) {
    actionMessage.value = '当前商品没有可用 SKU，请先在管理端维护规格。'
    return
  }
  actionLoading.value = true
  try {
    await cartService.add(project.value.skuId, 1)
    actionMessage.value = '已加入购物车'
    await router.push('/cart')
  } catch (error) {
    actionMessage.value = error instanceof Error ? error.message : '加入购物车失败'
  } finally {
    actionLoading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <section class="container detail-page">
      <div class="breadcrumb">首页 / 项目商城 / {{ project.title }}</div>
      <div class="detail-hero">
        <div>
          <img v-if="project.imageUrl" class="detail-product-image" :src="project.imageUrl" :alt="project.title" />
          <ProjectVisual v-else :tone="project.imageTone" />
          <div class="thumb-row">
            <img
              v-for="item in imageRelated"
              :key="item.id"
              class="project-image mini"
              :src="item.imageUrl"
              :alt="item.title"
            />
            <ProjectVisual v-for="item in visualRelated" :key="item.id" :tone="item.imageTone" />
          </div>
        </div>

        <div class="detail-copy">
          <span class="badge">热门项目</span>
          <h1>{{ project.title }}</h1>
          <p>{{ project.summary }}</p>
          <div class="tag-row large">
            <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          </div>
          <div class="price-panel">
            <div><span>标准价格</span><strong>￥{{ project.price }}</strong></div>
            <div><span>库存</span><strong>{{ project.stock ?? 0 }}</strong></div>
            <RouterLink to="/membership"><Crown :size="18" />699会员享受更多折扣</RouterLink>
          </div>
          <div class="detail-actions">
            <button class="primary-btn" :disabled="actionLoading" @click="addToCart"><ShoppingCart :size="20" />加入购物车</button>
            <button class="outline-btn wide"><MessageCircle :size="20" />咨询顾问</button>
            <RouterLink to="/membership" class="outline-btn wide purple"><Crown :size="20" />开通699会员</RouterLink>
          </div>
          <p v-if="actionMessage" class="action-message">{{ actionMessage }}</p>
          <div class="meta-grid">
            <div><UsersRound :size="18" /><span>适合人群</span><strong>个人创业者、工作室、团队</strong></div>
            <div><CalendarDays :size="18" /><span>落地周期</span><strong>3-7天即可启动</strong></div>
            <div><PackageCheck :size="18" /><span>商品销量</span><strong>{{ project.salesCount ?? 0 }}</strong></div>
            <div><Bot :size="18" /><span>商品编号</span><strong>{{ project.id }}</strong></div>
          </div>
        </div>
      </div>

      <div class="tab-panel">
        <nav>
          <a class="active">项目介绍</a>
          <a>项目说明</a>
          <a>产品使用说明</a>
          <a>交付清单</a>
          <a>怎么开通</a>
          <a>相关推荐</a>
        </nav>
        <div class="intro-grid">
          <div>
            <h2>项目介绍</h2>
            <p>{{ descriptionText }}</p>
            <ul class="check-list">
              <li><CheckCircle2 :size="18" />项目介绍、项目说明、产品使用说明来自后台商品详情</li>
              <li><CheckCircle2 :size="18" />登录、购物车、订单均走 Yudao Java 后端</li>
              <li><CheckCircle2 :size="18" />注册默认使用租户 1 的会员体系</li>
              <li><CheckCircle2 :size="18" />交易完成后在已购商品中展示</li>
            </ul>
          </div>
          <div class="result-grid">
            <div><strong>3-7天</strong><span>落地周期</span></div>
            <div><strong>低门槛</strong><span>简单易上手</span></div>
            <div><strong>高转化</strong><span>精准流量转化</span></div>
            <div><strong>可复制</strong><span>批量起号变现</span></div>
          </div>
        </div>
      </div>

      <section class="detail-section">
        <h2>项目说明</h2>
        <div class="feature-grid">
          <div><UsersRound :size="44" /><strong>项目定位</strong><span>{{ project.projectDescription }}</span></div>
          <div><Bot :size="44" /><strong>后台可配置</strong><span>通过管理端商城商品名称、图片、价格、库存和详情维护招商信息。</span></div>
          <div><PackageCheck :size="44" /><strong>订单闭环</strong><span>选中商品进入购物车，交易完成后进入已购商品列表。</span></div>
          <div><CalendarDays :size="44" /><strong>持续维护</strong><span>商品详情可按项目更新交付说明、权益和服务内容。</span></div>
        </div>
      </section>

      <section class="detail-section">
        <h2>产品使用说明</h2>
        <p class="rich-text">{{ project.usageGuide }}</p>
        <div class="process-row">
          <div v-for="(step, index) in marketConfig.openingSteps" :key="step">
            <strong>{{ String(index + 1).padStart(2, '0') }}</strong><b>开通步骤</b><span>{{ step }}</span>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-title"><h2>相关推荐</h2><RouterLink to="/market">查看更多 ›</RouterLink></div>
        <div class="related-grid">
          <ProjectCard v-for="item in related" :key="item.id" :project="item" compact />
        </div>
      </section>
    </section>
  </AppLayout>
</template>
