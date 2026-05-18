import { apiRequest, buildQuery, type PageResult } from './apiClient'

export const ORDER_STATUS = {
  unpaid: 0,
  undelivered: 10,
  delivered: 20,
  completed: 30,
  canceled: 40,
} as const

export const orderStatusText = (status: number) => ({
  0: '待支付',
  10: '待发货',
  20: '已发货',
  30: '交易完成',
  40: '已取消',
}[status] || '未知状态')

export interface MallOrderItem {
  id: number
  orderId: number
  spuId: number
  spuName: string
  skuId: number
  picUrl?: string
  count: number
  price: number
  payPrice: number
}

export interface MallOrder {
  id: number
  no: string
  type: number
  status: number
  productCount: number
  commentStatus?: boolean
  createTime?: string | number
  payOrderId?: number
  payPrice: number
  deliveryType?: number
  items: MallOrderItem[]
}

export const orderService = {
  page(params: { status?: number; pageNo?: number; pageSize?: number } = {}) {
    const query = buildQuery({
      pageNo: params.pageNo ?? 1,
      pageSize: params.pageSize ?? 20,
      status: params.status,
    })
    return apiRequest<PageResult<MallOrder>>(`/trade/order/page?${query}`)
  },
  count() {
    return apiRequest<Record<string, number>>('/trade/order/get-count')
  },
  detail(id: number) {
    return apiRequest<MallOrder>(`/trade/order/get-detail?id=${id}`)
  },
}
