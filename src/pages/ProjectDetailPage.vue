<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bot, CalendarDays, CheckCircle2, Crown, MessageCircle, PackageCheck, ShoppingCart, UsersRound } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'
import ProjectCard from '../components/ProjectCard.vue'
import ProjectVisual from '../components/ProjectVisual.vue'
import { getProjectById, projects } from '../data/projects'

const route = useRoute()
const project = computed(() => getProjectById(String(route.params.id)))
const related = computed(() => projects.filter((item) => item.id !== project.value.id).slice(0, 3))
</script>

<template>
  <AppLayout>
    <section class="container detail-page">
      <div class="breadcrumb">首页 / 项目商城 / {{ project.title }}</div>
      <div class="detail-hero">
        <div>
          <ProjectVisual :tone="project.imageTone" />
          <div class="thumb-row">
            <ProjectVisual v-for="item in related" :key="item.id" :tone="item.imageTone" />
          </div>
        </div>

        <div class="detail-copy">
          <span class="badge">热门项目</span>
          <h1>{{ project.title }}</h1>
          <p>{{ project.summary }} 适合个人、团队及企业快速开展变现业务。</p>
          <div class="tag-row large">
            <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          </div>
          <div class="price-panel">
            <div><span>标准价格</span><strong>￥{{ project.price }}</strong></div>
            <div><span>会员价格</span><strong>￥{{ project.memberPrice }}</strong></div>
            <RouterLink to="/membership"><Crown :size="18" />699会员享受更多折扣</RouterLink>
          </div>
          <div class="detail-actions">
            <button class="primary-btn"><ShoppingCart :size="20" />立即购买</button>
            <button class="outline-btn wide"><MessageCircle :size="20" />咨询顾问</button>
            <RouterLink to="/membership" class="outline-btn wide purple"><Crown :size="20" />开通699会员</RouterLink>
          </div>
          <div class="meta-grid">
            <div><UsersRound :size="18" /><span>适合人群</span><strong>个人创业者、工作室、团队</strong></div>
            <div><CalendarDays :size="18" /><span>落地周期</span><strong>3-7天即可启动</strong></div>
            <div><PackageCheck :size="18" /><span>交付方式</span><strong>资料包 + 视频教程 + 工具包</strong></div>
            <div><Bot :size="18" /><span>服务支持</span><strong>专属社群 + 客服指导 + 持续更新</strong></div>
          </div>
        </div>
      </div>

      <div class="tab-panel">
        <nav>
          <a class="active">项目介绍</a>
          <a>项目亮点</a>
          <a>操作流程</a>
          <a>交付清单</a>
          <a>常见问题</a>
          <a>相关推荐</a>
        </nav>
        <div class="intro-grid">
          <div>
            <h2>项目介绍</h2>
            <p>{{ project.title }}通过搭建标准化执行链路，结合脚本、素材与智能工具，实现快速启动和稳定变现。项目适合希望低成本试水、快速拿到结果的团队。</p>
            <ul class="check-list">
              <li><CheckCircle2 :size="18" />零真人出镜，降低人力成本</li>
              <li><CheckCircle2 :size="18" />自动化执行，减少重复劳动</li>
              <li><CheckCircle2 :size="18" />多平台覆盖，流量更大</li>
              <li><CheckCircle2 :size="18" />标准化流程，可快速复制</li>
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
        <h2>项目亮点</h2>
        <div class="feature-grid">
          <div><UsersRound :size="44" /><strong>低门槛</strong><span>无需真人出镜，简单配置即可开播。</span></div>
          <div><Bot :size="44" /><strong>自动化执行</strong><span>脚本自动轮播，自动互动，减少人工干预。</span></div>
          <div><PackageCheck :size="44" /><strong>可批量复制</strong><span>标准化工具与素材库，支持批量起号。</span></div>
          <div><CalendarDays :size="44" /><strong>持续更新</strong><span>提供最新玩法、工具与案例，保持竞争力。</span></div>
        </div>
      </section>

      <section class="detail-section">
        <h2>操作流程</h2>
        <div class="process-row">
          <div><strong>01</strong><b>准备账号</b><span>注册账号，完成实名认证与基础设置。</span></div>
          <div><strong>02</strong><b>配置工具</b><span>安装直播工具，导入脚本与素材。</span></div>
          <div><strong>03</strong><b>开播执行</b><span>一键开播，系统自动执行脚本与互动。</span></div>
          <div><strong>04</strong><b>数据复盘</b><span>查看直播数据，分析优化内容与策略。</span></div>
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
