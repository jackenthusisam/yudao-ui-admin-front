<script setup lang="ts">
import { Crown, House, MessageCircle, Search, UserRound } from 'lucide-vue-next'
import { navItems } from '../data/projects'
</script>

<template>
  <div class="site-shell">
    <header class="topbar">
      <RouterLink to="/" class="brand" aria-label="项目商城首页">
        <span class="brand-mark"><House :size="20" /></span>
        <span>项目商城</span>
      </RouterLink>

      <nav class="desktop-nav" aria-label="主导航">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      </nav>

      <div class="nav-actions">
        <button class="ghost-btn">登录</button>
        <button class="outline-btn">注册</button>
        <RouterLink to="/membership" class="primary-btn compact">
          <Crown :size="18" />
          立即开通会员
        </RouterLink>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="brand inverse">
            <span class="brand-mark"><House :size="18" /></span>
            <span>项目商城</span>
          </div>
          <p>专注优质互联网项目与增长服务，帮助团队快速落地与变现。</p>
          <div class="socials">
            <span><MessageCircle :size="18" /></span>
            <span><UserRound :size="18" /></span>
            <span><Search :size="18" /></span>
          </div>
        </div>

        <div>
          <h3>快捷导航</h3>
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
        </div>
        <div>
          <h3>帮助中心</h3>
          <a href="#">新手指南</a>
          <a href="#">常见问题</a>
          <a href="#">购买流程</a>
          <a href="#">售后服务</a>
        </div>
        <div>
          <h3>热门项目</h3>
          <a href="#">脚本项目</a>
          <a href="#">平台项目</a>
          <a href="#">无人直播</a>
          <a href="#">广告联盟</a>
        </div>
        <div>
          <h3>联系我们</h3>
          <p>电话：400-888-9999</p>
          <p>微信：xiangmusc</p>
          <p>邮箱：service@xiangmusc.com</p>
          <p>工作时间：9:00-18:00</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© 2024 项目商城 All Rights Reserved. 粤ICP备2024045678号-1</span>
        <span>隐私政策 ｜ 用户协议</span>
      </div>
    </footer>
  </div>
</template>
