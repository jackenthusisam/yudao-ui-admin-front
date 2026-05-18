<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Minus, Plus, Trash2, MessageCircle, CheckCircle } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'
import { authService } from '../services/authService'
import { cartService, type MallCartItem } from '../services/cartService'
import { marketConfig } from '../services/marketConfig'

const items = ref<MallCartItem[]>([])
const invalidItems = ref<MallCartItem[]>([])
const loading = ref(true)
const message = ref('')
const submitted = ref(false)
const wechatContact = ref('')
const submitting = ref(false)

const centsToYuan = (value?: number) => Number(((value ?? 0) / 100).toFixed(2))
const selectedItems = computed(() => items.value.filter((item) => item.selected))
const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + centsToYuan(item.sku.price) * item.count, 0))

const loadCart = async () => {
  if (!authService.isLoggedIn.value) {
    loading.value = false
    return
  }
  loading.value = true
  message.value = ''
  try {
    const data = await cartService.list()
    items.value = data.validList || []
    invalidItems.value = data.invalidList || []
    submitted.value = false
  } catch (error) {
    message.value = error instanceof Error ? error.message : '购物车加载失败'
  } finally {
    loading.value = false
  }
}

const updateSelected = async (item: MallCartItem) => {
  await cartService.updateSelected([item.id], item.selected)
  await loadCart()
}

const updateCount = async (item: MallCartItem, delta: number) => {
  const nextCount = Math.max(1, item.count + delta)
  await cartService.updateCount(item.id, nextCount)
  await loadCart()
}

const removeItem = async (item: MallCartItem) => {
  await cartService.delete([item.id])
  await loadCart()
}

const submitOrder = async () => {
  if (!wechatContact.value.trim()) return
  submitting.value = true
  try {
    // 存储提交的意向单到 localStorage，方便顾问查看
    const intent = {
      id: Date.now(),
      wechatContact: wechatContact.value.trim(),
      items: selectedItems.value.map((item) => ({
        spuId: item.spu.id,
        spuName: item.spu.name,
        skuId: item.sku.id,
        picUrl: item.sku.picUrl || item.spu.picUrl,
        price: item.sku.price,
        count: item.count,
      })),
      totalPrice: totalPrice.value,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const raw = localStorage.getItem('front_submitted_intents')
    const intents = raw ? JSON.parse(raw) : []
    intents.push(intent)
    localStorage.setItem('front_submitted_intents', JSON.stringify(intents))
    submitted.value = true
  } catch (error) {
    message.value = error instanceof Error ? error.message : '提交失败'
  } finally {
    submitting.value = false
  }
}

onMounted(loadCart)
</script>

<template>
  <AppLayout>
    <section class="sub-hero">
      <div class="container sub-hero-grid">
        <div>
          <h1>购物车</h1>
          <p>客户选中项目但尚未下单的内容，会在这里通过 Yudao 购物车接口实时展示。</p>
        </div>
      </div>
    </section>

    <section class="container page-panel">
      <div v-if="!authService.isLoggedIn.value" class="empty-state">
        请先登录后查看购物车。<RouterLink to="/login">去登录</RouterLink>
      </div>
      <div v-else-if="loading" class="empty-state">正在加载购物车...</div>
      <div v-else-if="message" class="empty-state">{{ message }}</div>
      <div v-else-if="submitted" class="empty-state" style="padding: 3rem 0;">
        <CheckCircle :size="48" style="color: var(--green); margin-bottom: 1rem;" />
        <h2 style="margin: 0 0 0.5rem;">需求已提交</h2>
        <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto 1.5rem;">
          请添加顾问微信 <strong>{{ marketConfig.contactWechat }}</strong>，顾问将通过微信与您联系完成后续交易。
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <RouterLink to="/purchases" class="primary-btn compact">查看已购商品</RouterLink>
          <RouterLink to="/market" class="outline-btn compact">继续选购</RouterLink>
        </div>
      </div>
      <div v-else-if="items.length === 0" class="empty-state">
        购物车暂无项目。<RouterLink to="/market">去项目商城选择</RouterLink>
      </div>
      <template v-else>
        <div class="cart-list">
          <article v-for="item in items" :key="item.id" class="cart-item">
            <input v-model="item.selected" type="checkbox" @change="updateSelected(item)" />
            <img :src="item.spu.picUrl || item.sku.picUrl" :alt="item.spu.name" />
            <div>
              <strong>{{ item.spu.name }}</strong>
              <span>SKU {{ item.sku.id }} · 库存 {{ item.sku.stock ?? '-' }}</span>
            </div>
            <div class="count-control">
              <button @click="updateCount(item, -1)"><Minus :size="16" /></button>
              <span>{{ item.count }}</span>
              <button @click="updateCount(item, 1)"><Plus :size="16" /></button>
            </div>
            <strong class="cart-price">￥{{ centsToYuan(item.sku.price) }}</strong>
            <button class="icon-btn" title="删除" @click="removeItem(item)"><Trash2 :size="18" /></button>
          </article>
        </div>

        <div class="cart-summary">
          <span>已选 {{ selectedItems.length }} 项</span>
          <strong>合计：￥{{ totalPrice.toFixed(2) }}</strong>
        </div>

        <!-- 提交需求：微信号 -->
        <div v-if="selectedItems.length > 0" class="checkout-section">
          <h3><MessageCircle :size="20" /> 提交开通需求</h3>
          <p class="checkout-hint">请留下您的微信号，顾问将添加您并协助完成交易开通。</p>
          <div class="checkout-row">
            <input
              v-model="wechatContact"
              placeholder="请输入您的微信号"
              class="checkout-input"
              @keyup.enter="submitOrder"
            />
            <button class="primary-btn" :disabled="submitting || !wechatContact.trim()" @click="submitOrder">
              {{ submitting ? '提交中...' : '提交需求' }}
            </button>
          </div>
          <p class="checkout-contact">
            也可直接添加顾问微信 <strong>{{ marketConfig.contactWechat }}</strong> 沟通
          </p>
        </div>
      </template>
      <div v-if="invalidItems.length" class="empty-state">有 {{ invalidItems.length }} 个失效项目，请在管理端检查商品状态。</div>
    </section>
  </AppLayout>
</template>

<style scoped>
.checkout-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card-bg);
}
.checkout-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.25rem;
  font-size: 1rem;
}
.checkout-hint {
  margin: 0.25rem 0 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.checkout-row {
  display: flex;
  gap: 0.75rem;
}
.checkout-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.checkout-input:focus {
  border-color: var(--primary);
}
.checkout-contact {
  margin: 0.75rem 0 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}
.checkout-contact strong {
  color: var(--primary);
}
</style>
