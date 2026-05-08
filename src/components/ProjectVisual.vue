<script setup lang="ts">
import { BarChart3, Bot, MessageSquareText, MonitorPlay, Play, ShoppingCart, Smartphone } from 'lucide-vue-next'
import type { Project } from '../types/project'

defineProps<{
  tone: Project['imageTone']
}>()
</script>

<template>
  <div class="project-visual" :class="`visual-${tone}`">
    <div class="visual-glow"></div>
    <div v-if="tone === 'phone'" class="phone-stack">
      <span v-for="item in 3" :key="item"><Smartphone :size="38" /><small>Live</small></span>
    </div>
    <div v-else-if="tone === 'studio'" class="studio-scene">
      <span class="lamp"></span>
      <MonitorPlay :size="70" />
      <span class="mic"></span>
      <span class="mic second"></span>
    </div>
    <div v-else-if="tone === 'dashboard'" class="dashboard-scene">
      <BarChart3 :size="88" />
      <span></span><span></span><span></span>
    </div>
    <div v-else-if="tone === 'social'" class="node-scene">
      <span v-for="item in 7" :key="item"></span>
    </div>
    <div v-else-if="tone === 'cart'" class="cart-scene">
      <ShoppingCart :size="78" />
      <span></span><span></span><span></span>
    </div>
    <div v-else-if="tone === 'shop'" class="shop-scene">
      <strong>来此烧烤</strong>
      <span></span>
    </div>
    <div v-else-if="tone === 'form'" class="form-scene">
      <MessageSquareText :size="56" />
      <span></span><span></span><span></span>
    </div>
    <div v-else class="ai-scene">
      <Bot :size="72" />
      <Play :size="28" />
    </div>
  </div>
</template>
