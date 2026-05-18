<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Clock, CheckCircle } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'
import { authService } from '../services/authService'
import { ORDER_STATUS, orderService, type MallOrder } from '../services/orderService'
import { marketConfig } from '../services/marketConfig'

interface SubmittedIntent {
  id: number
  wechatContact: string
  items: Array<{ spuId: number; spuName: string; picUrl?: string; price: number; count: number }>
  totalPrice: number
  status: string
  createdAt: string
}

const orders = ref<MallOrder[]>([])
const intents = ref<SubmittedIntent[]>([])
const loading = ref(true)
const message = ref('')

const purchasedItems = computed(() => orders.value.flatMap((order) => order.items.map((item) => ({
  ...item,
  orderNo: order.no,
  orderId: order.id,
}))))

const loadPurchases = async () => {
  if (!authService.isLoggedIn.value) {
    loading.value = false
    return
  }
  loading.value = true
  message.value = ''
  try {
    const [page] = await Promise.all([
      orderService.page({ status: ORDER_STATUS.completed, pageSize: 50 }),
    ])
    orders.value = page.list || []
  } catch (error) {
    message.value = error instanceof Error ? error.message : '已购商品加载失败'
  } finally {
    loading.value = false
  }
  // 加载本地提交的意向单
  try {
    const raw = localStorage.getItem('front_submitted_intents')
    intents.value = raw ? JSON.parse(raw) : []
  } catch {
    intents.value = []
  }
}

onMounted(loadPurchases)
</script>

<template>
  <AppLayout>
    <section class="sub-hero">
      <div class="container sub-hero-grid">
        <div>
          <h1>已购商品</h1>
          <p>通过顾问开通并完成交易的项目，会在列表中展示。</p>
        </div>
      </div>
    </section>

    <section class="container page-panel">
      <div v-if="!authService.isLoggedIn.value" class="empty-state">
        请先登录后查看已购商品。<RouterLink to="/login">去登录</RouterLink>
      </div>
      <div v-else-if="loading" class="empty-state">正在加载已购商品...</div>
      <div v-else-if="message" class="empty-state">{{ message }}</div>

      <!-- 待处理的意向单 -->
      <template v-if="intents.length > 0">
        <h3 style="margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.95rem;">
          <Clock :size="18" /> 待处理的需求
        </h3>
        <div class="intent-list">
          <article v-for="intent in intents" :key="intent.id" class="intent-card">
            <div class="intent-header">
              <span class="intent-badge">待处理</span>
              <small>{{ new Date(intent.createdAt).toLocaleString('zh-CN') }}</small>
            </div>
            <div v-for="item in intent.items" :key="item.spuId" class="intent-item">
              <img v-if="item.picUrl" :src="item.picUrl" :alt="item.spuName" />
              <div>
                <strong>{{ item.spuName }}</strong>
                <span>{{ item.count }} 份</span>
              </div>
            </div>
            <div class="intent-footer">
              <span>微信号：<strong>{{ intent.wechatContact }}</strong></span>
              <span>合计：<strong>￥{{ intent.totalPrice.toFixed(2) }}</strong></span>
            </div>
            <p class="intent-tip">顾问微信 <strong>{{ marketConfig.contactWechat }}</strong>，添加后加速处理</p>
          </article>
        </div>
      </template>

      <!-- 已完成的交易 -->
      <template v-if="purchasedItems.length > 0">
        <h3 style="margin: 1.5rem 0 0.75rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.95rem;">
          <CheckCircle :size="18" style="color: var(--green);" /> 已完成交易
        </h3>
        <div class="purchase-grid">
          <article v-for="item in purchasedItems" :key="`${item.orderId}-${item.id}`" class="purchase-card">
            <img :src="item.picUrl" :alt="item.spuName" />
            <div>
              <strong>{{ item.spuName }}</strong>
              <span>订单 {{ item.orderNo }}</span>
              <RouterLink :to="`/projects/${item.spuId}`" class="detail-link">查看项目资料</RouterLink>
            </div>
          </article>
        </div>
      </template>

      <div v-else-if="intents.length === 0 && !loading && !message" class="empty-state">
        暂无交易完成的已购项目。<RouterLink to="/market">去项目商城选购</RouterLink>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.intent-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.intent-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  background: var(--card-bg);
}
.intent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.intent-badge {
  font-size: 0.78rem;
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  background: #fff3cd;
  color: #856404;
}
.intent-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}
.intent-item img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  background: var(--bg-muted);
}
.intent-item div strong {
  display: block;
  font-size: 0.9rem;
}
.intent-item div span {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.intent-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.85rem;
}
.intent-tip {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--primary);
  text-align: center;
}
</style>
