import { ref } from 'vue'

export interface CommonResult<T> {
  code: number
  msg: string
  data: T
}

export interface PageResult<T> {
  total: number
  list: T[]
}

export interface AuthToken {
  id?: number
  userId: number
  accessToken: string
  refreshToken: string
  expiresTime: string | number
  userType?: number
  clientId?: string
  openid?: string | null
}

export const API_BASE = import.meta.env.VITE_YUDAO_API_BASE || 'http://localhost:48080/app-api'
export const ADMIN_API_BASE = import.meta.env.VITE_YUDAO_ADMIN_API_BASE || 'http://localhost:48080/admin-api'
export const TENANT_ID = import.meta.env.VITE_YUDAO_TENANT_ID || '1'
export const TOKEN_KEY = 'front_member_token'
export const TENANT_KEY = 'front_tenant_id'

const loadToken = () => {
  const savedToken = localStorage.getItem(TOKEN_KEY)
  if (!savedToken) {
    return null
  }
  try {
    return JSON.parse(savedToken) as AuthToken
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
}

export const memberToken = ref<AuthToken | null>(loadToken())
export const activeTenantId = ref(localStorage.getItem(TENANT_KEY) || TENANT_ID)

export const saveMemberToken = (nextToken: AuthToken) => {
  memberToken.value = nextToken
  localStorage.setItem(TOKEN_KEY, JSON.stringify(nextToken))
}

export const clearMemberToken = () => {
  memberToken.value = null
  localStorage.removeItem(TOKEN_KEY)
}

export const saveTenantId = (tenantId: string | number) => {
  activeTenantId.value = String(tenantId)
  localStorage.setItem(TENANT_KEY, String(tenantId))
}

export const buildQuery = (params: Record<string, string | number | boolean | undefined | null>) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })
  return query.toString()
}

export const apiRequest = async <T>(path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers)
  headers.set('tenant-id', activeTenantId.value || TENANT_ID)
  headers.set('terminal', '30')
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (memberToken.value?.accessToken) {
    headers.set('Authorization', `Bearer ${memberToken.value.accessToken}`)
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!response.ok) {
    throw new Error(`接口请求失败：${response.status}`)
  }

  const result = await response.json() as CommonResult<T>
  if (result.code !== 0) {
    throw new Error(result.msg || '接口返回异常')
  }
  return result.data
}

export const adminApiRequest = async <T>(path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers)
  headers.set('tenant-id', activeTenantId.value || TENANT_ID)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (memberToken.value?.accessToken) {
    headers.set('Authorization', `Bearer ${memberToken.value.accessToken}`)
  }

  const response = await fetch(`${ADMIN_API_BASE}${path}`, { ...options, headers })
  if (!response.ok) {
    throw new Error(`接口请求失败：${response.status}`)
  }

  const result = await response.json() as CommonResult<T>
  if (result.code !== 0) {
    throw new Error(result.msg || '接口返回异常')
  }
  return result.data
}
