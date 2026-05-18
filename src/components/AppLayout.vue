<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Crown, Eye, EyeOff, House, LockKeyhole, MessageCircle, Search, UserRound } from 'lucide-vue-next'
import { navItems } from '../data/projects'
import { authService } from '../services/authService'
import { marketConfig } from '../services/marketConfig'

const rememberedLoginKey = 'project-market:remembered-login'

const authMode = ref<'login' | 'register'>('login')
const showAuth = ref(false)
const tenantName = ref(import.meta.env.VITE_APP_DEFAULT_LOGIN_TENANT || '芋道源码')
const username = ref(import.meta.env.VITE_APP_DEFAULT_LOGIN_USERNAME || 'admin')
const nickname = ref('')
const password = ref(import.meta.env.VITE_APP_DEFAULT_LOGIN_PASSWORD || 'admin123')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref('')
const showPassword = ref(false)
const rememberPassword = ref(false)

const isLoggedIn = computed(() => authService.isLoggedIn.value)
const displayName = computed(() => authService.user.value?.nickname || authService.user.value?.username || authService.user.value?.mobile || `用户 ${authService.token.value?.userId}`)

onMounted(() => {
  const rawLogin = localStorage.getItem(rememberedLoginKey)
  if (!rawLogin) {
    return
  }
  try {
    const rememberedLogin = JSON.parse(rawLogin) as { tenantName?: string; username?: string; password?: string; rememberMe?: boolean }
    tenantName.value = rememberedLogin.tenantName || tenantName.value
    username.value = rememberedLogin.username || username.value
    password.value = rememberedLogin.password || password.value
    rememberPassword.value = rememberedLogin.rememberMe ?? Boolean(rememberedLogin.username || rememberedLogin.password)
  } catch {
    localStorage.removeItem(rememberedLoginKey)
  }
})

watch(rememberPassword, (enabled) => {
  if (!enabled) {
    localStorage.removeItem(rememberedLoginKey)
  }
})

const openAuth = (mode: 'login' | 'register') => {
  authMode.value = mode
  showAuth.value = true
  message.value = ''
}

const persistRememberedLogin = () => {
  if (!rememberPassword.value) {
    localStorage.removeItem(rememberedLoginKey)
    return
  }
  localStorage.setItem(rememberedLoginKey, JSON.stringify({
    tenantName: tenantName.value,
    username: username.value,
    password: password.value,
    rememberMe: rememberPassword.value,
  }))
}

const submitPasswordLogin = async () => {
  loading.value = true
  message.value = ''
  try {
    await authService.loginByPassword(username.value, password.value, tenantName.value)
    persistRememberedLogin()
    showAuth.value = false
  } catch (error) {
    message.value = error instanceof Error ? error.message : '登录失败'
  } finally {
    loading.value = false
  }
}

const validateRegisterForm = () => {
  if (!tenantName.value.trim()) {
    message.value = '请输入租户名称'
    return false
  }
  if (!/^[a-zA-Z0-9]{4,30}$/.test(username.value)) {
    message.value = '用户账号需为 4-30 位数字或字母'
    return false
  }
  if (!nickname.value.trim() || nickname.value.length > 30) {
    message.value = '用户昵称不能为空且不能超过 30 个字符'
    return false
  }
  if (password.value.length < 4 || password.value.length > 16) {
    message.value = '密码长度需为 4-16 位'
    return false
  }
  if (password.value !== confirmPassword.value) {
    message.value = '两次输入的密码不一致'
    return false
  }
  return true
}

const submitRegister = async () => {
  message.value = ''
  if (!validateRegisterForm()) {
    return
  }
  loading.value = true
  try {
    await authService.register({
      tenantName: tenantName.value,
      username: username.value,
      nickname: nickname.value,
      password: password.value,
      captchaVerification: '',
    })
    persistRememberedLogin()
    showAuth.value = false
  } catch (error) {
    message.value = error instanceof Error ? error.message : '注册失败'
  } finally {
    loading.value = false
  }
}
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
        <template v-if="isLoggedIn">
          <span class="user-chip"><UserRound :size="16" />{{ displayName }}</span>
          <button class="ghost-btn" @click="authService.logout()">退出</button>
        </template>
        <template v-else>
          <button class="ghost-btn" @click="openAuth('login')">登录</button>
          <button class="outline-btn" @click="openAuth('register')">注册</button>
        </template>
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
          <p>电话：{{ marketConfig.contactPhone }}</p>
          <p>微信：{{ marketConfig.contactWechat }}</p>
          <p>邮箱：{{ marketConfig.contactEmail }}</p>
          <p>工作时间：{{ marketConfig.workTime }}</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© 2024 项目商城 All Rights Reserved. 粤ICP备2024045678号-1</span>
        <span>隐私政策 ｜ 用户协议</span>
      </div>
    </footer>

    <div v-if="showAuth" class="auth-overlay" @click.self="showAuth = false">
      <section class="auth-dialog">
        <header>
          <h2>{{ authMode === 'login' ? '登录账号' : '注册账号' }}</h2>
          <button @click="showAuth = false">×</button>
        </header>

        <div class="auth-tabs">
          <button :class="{ active: authMode === 'login' }" @click="authMode = 'login'">账号登录</button>
          <button :class="{ active: authMode === 'register' }" @click="authMode = 'register'">账号注册</button>
        </div>

        <template v-if="authMode === 'login'">
          <label class="auth-input">
            <House :size="18" />
            <input v-model="tenantName" autocomplete="organization" placeholder="请输入租户名称" />
          </label>
          <label class="auth-input">
            <UserRound :size="18" />
            <input v-model="username" autocomplete="username" placeholder="请输入用户名" />
          </label>
          <label>
            <div class="password-field auth-input">
              <LockKeyhole :size="18" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="请输入密码"
                @keyup.enter="submitPasswordLogin"
              />
              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                :title="showPassword ? '隐藏密码' : '显示密码'"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="18" />
                <Eye v-else :size="18" />
              </button>
            </div>
          </label>
          <label class="remember-row">
            <input v-model="rememberPassword" type="checkbox" />
            <span>记住我</span>
          </label>
          <button class="primary-btn full" :disabled="loading" @click="submitPasswordLogin">登录</button>
        </template>

        <template v-else>
          <label class="auth-input">
            <House :size="18" />
            <input v-model="tenantName" autocomplete="organization" placeholder="请输入租户名称" />
          </label>
          <label class="auth-input">
            <UserRound :size="18" />
            <input v-model="username" autocomplete="username" placeholder="请输入账号，数字或字母" />
          </label>
          <label class="auth-input">
            <UserRound :size="18" />
            <input v-model="nickname" autocomplete="nickname" placeholder="请输入昵称" />
          </label>
          <label>
            <div class="password-field auth-input">
              <LockKeyhole :size="18" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="请输入密码"
              />
              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                :title="showPassword ? '隐藏密码' : '显示密码'"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="18" />
                <Eye v-else :size="18" />
              </button>
            </div>
          </label>
          <label class="auth-input">
            <LockKeyhole :size="18" />
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="请再次输入密码"
              @keyup.enter="submitRegister"
            />
          </label>
          <button class="primary-btn full" :disabled="loading" @click="submitRegister">注册</button>
        </template>

        <p v-if="message" class="auth-message">{{ message }}</p>
      </section>
    </div>
  </div>
</template>
