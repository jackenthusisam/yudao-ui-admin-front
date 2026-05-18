import type { Component } from 'vue'

export interface Category {
  id: string
  name: string
  count: number
  description: string
  icon: Component
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'gold'
}

export interface Project {
  id: string
  spuId?: number
  skuId?: number
  title: string
  category: string
  summary: string
  description?: string
  projectIntro?: string
  projectDescription?: string
  usageGuide?: string
  price: number
  memberPrice: number
  marketPrice?: number
  stock?: number
  salesCount?: number
  tags: string[]
  hot?: boolean
  imageUrl?: string
  sliderPicUrls?: string[]
  skus?: ProjectSku[]
  imageTone: 'phone' | 'studio' | 'dashboard' | 'social' | 'cart' | 'shop' | 'form' | 'ai'
}

export interface ProjectSku {
  id: number
  price: number
  marketPrice?: number
  vipPrice?: number
  stock?: number
  picUrl?: string
  properties?: Array<{ propertyName?: string; valueName?: string; name?: string }>
}
