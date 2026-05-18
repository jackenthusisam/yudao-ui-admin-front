import { apiRequest } from './apiClient'

export interface MallCartSpu {
  id: number
  name: string
  picUrl?: string
  categoryId?: number
  status?: number
  stock?: number
}

export interface MallCartSku {
  id: number
  price: number
  marketPrice?: number
  picUrl?: string
  stock?: number
  properties?: Array<{ propertyName?: string; valueName?: string; name?: string }>
}

export interface MallCartItem {
  id: number
  count: number
  selected: boolean
  spu: MallCartSpu
  sku: MallCartSku
}

export interface MallCartList {
  validList: MallCartItem[]
  invalidList: MallCartItem[]
}

export const cartService = {
  add(skuId: number, count = 1) {
    return apiRequest<number>('/trade/cart/add', {
      method: 'POST',
      body: JSON.stringify({ skuId, count }),
    })
  },
  list() {
    return apiRequest<MallCartList>('/trade/cart/list')
  },
  count() {
    return apiRequest<number>('/trade/cart/get-count')
  },
  updateCount(id: number, count: number) {
    return apiRequest<boolean>('/trade/cart/update-count', {
      method: 'PUT',
      body: JSON.stringify({ id, count }),
    })
  },
  updateSelected(ids: number[], selected: boolean) {
    return apiRequest<boolean>('/trade/cart/update-selected', {
      method: 'PUT',
      body: JSON.stringify({ ids, selected }),
    })
  },
  delete(ids: number[]) {
    return apiRequest<boolean>(`/trade/cart/delete?ids=${ids.join(',')}`, { method: 'DELETE' })
  },
}
