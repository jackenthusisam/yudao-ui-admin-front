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
  title: string
  category: string
  summary: string
  price: number
  memberPrice: number
  tags: string[]
  hot?: boolean
  imageTone: 'phone' | 'studio' | 'dashboard' | 'social' | 'cart' | 'shop' | 'form' | 'ai'
}
