<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Eye, EyeOff, House, LockKeyhole, MessageCircle, Moon, QrCode, ShieldCheck, Smartphone, UserRound } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'
import { authService } from '../services/authService'
import { marketConfig } from '../services/marketConfig'

const route = useRoute()
const router = useRouter()
const rememberedLoginKey = 'project-market:remembered-login'

const authMode = ref<'login' | 'register'>(route.path.includes('register') ? 'register' : 'login')
const tenantName = ref(import.meta.env.VITE_APP_DEFAULT_LOGIN_TENANT || '芋道源码')
const username = ref(import.meta.env.VITE_APP_DEFAULT_LOGIN_USERNAME || 'admin')
const mobile = ref('')
const password = ref(import.meta.env.VITE_APP_DEFAULT_LOGIN_PASSWORD || 'admin123')
const smsCode = ref('')
const showPassword = ref(false)
const rememberPassword = ref(true)
const loading = ref(false)
const message = ref('')

const title = computed(() => authMode.value === 'login' ? '登录账号' : '注册账号')
const subtitle = computed(() => authMode.value === 'login'
  ? '与原前端一致：租户名、用户名、密码登录，调用管理端 /system/auth/login。'
  : marketConfig.registerText)

onMounted(() => {
  const rawLogin = localStorage.getItem(rememberedLoginKey)
  if (!rawLogin) {
    return
  }
  try {
    const rememberedLogin = JSON.parse(rawLogin) as { tenantName?: string; username?: string; mobile?: string; password?: string; rememberMe?: boolean }
    tenantName.value = rememberedLogin.tenantName || tenantName.value
    username.value = rememberedLogin.username || rememberedLogin.mobile || username.value
    mobile.value = rememberedLogin.mobile || ''
    password.value = rememberedLogin.password || password.value
    rememberPassword.value = rememberedLogin.rememberMe ?? Boolean(rememberedLogin.username || rememberedLogin.password)
  } catch {
    localStorage.removeItem(rememberedLoginKey)
  }
})

watch(() => route.path, (path) => {
  authMode.value = path.includes('register') ? 'register' : 'login'
  message.value = ''
})

watch(rememberPassword, (enabled) => {
  if (!enabled) {
    localStorage.removeItem(rememberedLoginKey)
  }
})

const switchMode = (mode: 'login' | 'register') => {
  router.replace(mode === 'login' ? '/login' : '/register')
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
    await router.push('/market')
  } catch (error) {
    message.value = error instanceof Error ? error.message : '登录失败'
  } finally {
    loading.value = false
  }
}

const sendSmsCode = async () => {
  loading.value = true
  message.value = ''
  try {
    await authService.sendSmsCode(mobile.value)
    message.value = '验证码已发送。本地联调可使用 9999。'
  } catch (error) {
    message.value = error instanceof Error ? error.message : '验证码发送失败'
  } finally {
    loading.value = false
  }
}

const submitSmsLogin = async () => {
  loading.value = true
  message.value = ''
  try {
    await authService.loginBySms(mobile.value, smsCode.value)
    await router.push('/market')
  } catch (error) {
    message.value = error instanceof Error ? error.message : '注册/登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <section class="auth-page">
      <div class="auth-admin-shell">
        <div class="auth-page-copy">
          <div class="auth-brand">
            <span><House :size="22" /></span>
            <strong>项目商城</strong>
          </div>
          <div class="auth-visual">
            <ShieldCheck :size="112" />
            <h1>欢迎使用 项目商城</h1>
            <p>基于 Yudao 管理前端登录流程，保持租户、账号、密码和接口一一对应。</p>
          </div>
        </div>

        <section class="auth-card">
          <div class="auth-card-tools">
            <span><Moon :size="18" /></span>
          </div>
          <h2>{{ title }}</h2>
          <p>{{ subtitle }}</p>

          <template v-if="authMode === 'login'">
            <label class="auth-input">
              <House :size="18" />
              <input v-model="tenantName" autocomplete="organization" placeholder="请输入租户名称" />
            </label>

            <label class="auth-input">
              <UserRound :size="18" />
              <input v-model="username" autocomplete="username" placeholder="请输入用户名" />
            </label>

            <label class="auth-input">
              <LockKeyhole :size="18" />
              <div class="password-field auth-password-field">
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
            <div class="auth-options">
              <label class="remember-row">
                <input v-model="rememberPassword" type="checkbox" />
                <span>记住我</span>
              </label>
              <button type="button" class="link-button">忘记密码</button>
            </div>
            <button class="primary-btn full" :disabled="loading" @click="submitPasswordLogin">登录</button>
            <div class="auth-mode-row">
              <button type="button"><Smartphone :size="16" />手机登录</button>
              <button type="button"><QrCode :size="16" />二维码登录</button>
              <button type="button" @click="switchMode('register')">注册</button>
            </div>
          </template>

          <template v-else>
            <label class="auth-input">
              <UserRound :size="18" />
              <input v-model="mobile" autocomplete="username tel" placeholder="请输入手机号" />
            </label>
            <label>
              <span>验证码</span>
              <div class="sms-row">
                <input v-model="smsCode" placeholder="本地联调用 9999" @keyup.enter="submitSmsLogin" />
                <button class="outline-btn" :disabled="loading" @click="sendSmsCode">获取验证码</button>
              </div>
            </label>
            <button class="primary-btn full" :disabled="loading" @click="submitSmsLogin">注册 / 登录</button>
          </template>

          <p v-if="message" class="auth-message">{{ message }}</p>
          <RouterLink to="/membership" class="auth-contact"><MessageCircle :size="18" />联系顾问协助开通</RouterLink>
        </section>
      </div>
    </section>
  </AppLayout>
</template>
