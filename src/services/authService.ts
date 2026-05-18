import { computed, ref } from 'vue'
import {
  adminApiRequest,
  apiRequest,
  clearMemberToken,
  memberToken,
  saveMemberToken,
  saveTenantId,
  type AuthToken,
} from './apiClient'

export interface MemberUser {
  id?: number
  username?: string
  mobile?: string
  nickname?: string
  avatar?: string
  levelName?: string
}

interface PermissionInfo {
  user?: {
    id?: number
    username?: string
    nickname?: string
    avatar?: string
    mobile?: string
  }
}

export interface RegisterParams {
  tenantName: string
  username: string
  nickname: string
  password: string
  captchaVerification: string
}

const token = memberToken
const user = ref<MemberUser | null>(null)

const saveToken = async (nextToken: AuthToken) => {
  saveMemberToken(nextToken)
  await authService.loadProfile().catch(() => undefined)
}

export const authService = {
  token,
  user,
  isLoggedIn: computed(() => Boolean(token.value?.accessToken)),

  async getTenantIdByName(tenantName: string) {
    const tenantId = await adminApiRequest<number>(`/system/tenant/get-id-by-name?name=${encodeURIComponent(tenantName)}`)
    saveTenantId(tenantId)
    return tenantId
  },

  async loginByPassword(username: string, password: string, tenantName = '芋道源码', captchaVerification = '') {
    await this.getTenantIdByName(tenantName)
    const data = await adminApiRequest<AuthToken>('/system/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, captchaVerification }),
    })
    await saveToken(data)
    return data
  },

  async register(params: RegisterParams) {
    await this.getTenantIdByName(params.tenantName)
    const data = await adminApiRequest<AuthToken>('/system/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        tenantName: params.tenantName,
        username: params.username,
        nickname: params.nickname,
        password: params.password,
        captchaVerification: params.captchaVerification,
      }),
    })
    await saveToken(data)
    return data
  },

  async sendSmsCode(mobile: string) {
    return apiRequest<boolean>('/member/auth/send-sms-code', {
      method: 'POST',
      body: JSON.stringify({ mobile, scene: 1 }),
    })
  },

  async loginBySms(mobile: string, code: string) {
    const data = await apiRequest<AuthToken>('/member/auth/sms-login', {
      method: 'POST',
      body: JSON.stringify({ mobile, code }),
    })
    await saveToken(data)
    return data
  },

  async loadProfile() {
    if (!token.value?.accessToken) {
      user.value = null
      return null
    }
    const permissionInfo = await adminApiRequest<PermissionInfo>('/system/auth/get-permission-info')
    user.value = permissionInfo?.user || null
    return user.value
  },

  async logout() {
    if (token.value?.accessToken) {
      await adminApiRequest<boolean>('/system/auth/logout', { method: 'POST' }).catch(() => undefined)
    }
    clearMemberToken()
    user.value = null
  },
}

void authService.loadProfile()
