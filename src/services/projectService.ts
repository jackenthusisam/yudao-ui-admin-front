import {
  BadgeCheck,
  Boxes,
  Crown,
  Layers3,
  MonitorPlay,
  Smartphone,
} from 'lucide-vue-next'
import { categories as fallbackCategories, getProjectById, projects as fallbackProjects } from '../data/projects'
import type { Category, Project, ProjectSku } from '../types/project'
import { apiRequest, buildQuery, type PageResult } from './apiClient'

interface MallCategory {
  id: number
  parentId: number
  name: string
  picUrl: string
}

interface MallSpu {
  id: number
  name: string
  introduction?: string
  description?: string
  categoryId: number
  picUrl?: string
  sliderPicUrls?: string[]
  price: number
  marketPrice?: number
  stock?: number
  salesCount?: number
  skus?: MallSku[]
}

interface MallSku {
  id: number
  price: number
  marketPrice?: number
  vipPrice?: number
  picUrl?: string
  stock?: number
  properties?: Array<{ propertyName?: string; valueName?: string; name?: string }>
}

const categoryIconPool = [Boxes, Layers3, MonitorPlay, Smartphone, Crown]
const categoryTonePool: Category['tone'][] = ['blue', 'green', 'purple', 'orange', 'teal', 'gold']
const imageTonePool: Project['imageTone'][] = ['cart', 'shop', 'dashboard', 'phone', 'studio', 'ai', 'form', 'social']

const centsToYuan = (value?: number) => Number(((value ?? 0) / 100).toFixed(2))

const stripHtml = (value?: string) => (value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const extractSection = (text: string, names: string[]) => {
  const normalized = text.replace(/\r/g, '\n')
  for (const name of names) {
    const match = normalized.match(new RegExp(`${name}[：:\\s]*([\\s\\S]*?)(?=项目介绍|项目说明|产品使用说明|使用说明|操作流程|交付清单|$)`))
    const value = match?.[1]?.replace(/\s+/g, ' ').trim()
    if (value) {
      return value
    }
  }
  return ''
}

const buildDetailTexts = (spu: MallSpu) => {
  const plainDescription = stripHtml(spu.description)
  const projectIntro = spu.introduction || extractSection(plainDescription, ['项目介绍']) || plainDescription || '该项目由后台商城商品资料生成，请在管理端维护项目介绍。'
  const projectDescription = extractSection(plainDescription, ['项目说明', '项目亮点', '交付说明']) || plainDescription || projectIntro
  const usageGuide = extractSection(plainDescription, ['产品使用说明', '使用说明', '操作流程']) || '注册/登录后选择项目，加入购物车，确认开通需求；交易完成后可在已购商品中查看项目交付信息。'
  return { projectIntro, projectDescription, usageGuide }
}

const toProjectSku = (sku: MallSku): ProjectSku => ({
  id: sku.id,
  price: centsToYuan(sku.price),
  marketPrice: centsToYuan(sku.marketPrice),
  vipPrice: centsToYuan(sku.vipPrice),
  stock: sku.stock,
  picUrl: sku.picUrl,
  properties: sku.properties,
})

const toProject = (spu: MallSpu, categoryMap = new Map<number, MallCategory>()): Project => {
  const category = categoryMap.get(spu.categoryId)
  const detailTexts = buildDetailTexts(spu)
  const summary = spu.introduction || detailTexts.projectIntro || '暂无商品简介'
  const skus = (spu.skus ?? []).map(toProjectSku)
  return {
    id: String(spu.id),
    spuId: spu.id,
    skuId: skus[0]?.id,
    title: spu.name,
    category: String(spu.categoryId),
    summary,
    description: spu.description,
    ...detailTexts,
    price: centsToYuan(spu.price),
    memberPrice: skus[0]?.vipPrice || centsToYuan(spu.price),
    marketPrice: centsToYuan(spu.marketPrice),
    stock: spu.stock ?? 0,
    salesCount: spu.salesCount ?? 0,
    tags: [category?.name, `库存 ${spu.stock ?? 0}`, `销量 ${spu.salesCount ?? 0}`].filter(Boolean) as string[],
    hot: (spu.salesCount ?? 0) > 0,
    imageUrl: spu.picUrl,
    sliderPicUrls: spu.sliderPicUrls,
    skus,
    imageTone: imageTonePool[spu.id % imageTonePool.length],
  }
}

let categoryCache: MallCategory[] | null = null

const listMallCategories = async () => {
  if (!categoryCache) {
    categoryCache = await apiRequest<MallCategory[]>('/product/category/list')
  }
  return categoryCache
}

const listMallProjects = async (params: {
  category?: string
  keyword?: string
  sortField?: 'price' | 'salesCount'
  sortAsc?: boolean
  pageNo?: number
  pageSize?: number
} = {}) => {
  const query = buildQuery({
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 100,
    categoryId: params.category && params.category !== 'all' ? params.category : undefined,
    keyword: params.keyword,
    sortField: params.sortField,
    sortAsc: params.sortField ? (params.sortAsc ?? false) : undefined,
  })

  const [page, mallCategories] = await Promise.all([
    apiRequest<PageResult<MallSpu>>(`/product/spu/page?${query}`),
    listMallCategories(),
  ])
  const categoryMap = new Map(mallCategories.map((category) => [category.id, category]))
  return {
    total: page.total,
    list: page.list.map((spu) => toProject(spu, categoryMap)),
  }
}

const buildCategories = (mallCategories: MallCategory[], projects: Project[]): Category[] => {
  const counts = new Map<string, number>()
  projects.forEach((project) => counts.set(project.category, (counts.get(project.category) ?? 0) + 1))
  return [
    {
      id: 'all',
      name: '全部商品',
      count: projects.length,
      description: '后台商城已上架商品',
      icon: BadgeCheck,
      tone: 'blue',
    },
    ...mallCategories
      .filter((category) => counts.has(String(category.id)))
      .map((category, index) => ({
        id: String(category.id),
        name: category.name,
        count: counts.get(String(category.id)) ?? 0,
        description: category.parentId === 0 ? '商品一级类目' : '商品细分类目',
        icon: categoryIconPool[index % categoryIconPool.length],
        tone: categoryTonePool[(index + 1) % categoryTonePool.length],
      })),
  ]
}

export const projectService = {
  async listProjects(category = 'all', keyword = '', sort = 'latest') {
    try {
      const sortOptions = sort === 'price'
        ? { sortField: 'price' as const, sortAsc: true }
        : sort === 'hot'
          ? { sortField: 'salesCount' as const, sortAsc: false }
          : {}
      return (await listMallProjects({ category, keyword, ...sortOptions })).list
    } catch (error) {
      console.warn('[projectService] 使用静态商品兜底：', error)
      const byCategory = category === 'all' ? fallbackProjects : fallbackProjects.filter((project) => project.category === category)
      return byCategory.filter((project) =>
        `${project.title}${project.summary}${project.tags.join('')}`.toLowerCase().includes(keyword.toLowerCase()),
      )
    }
  },
  async listCategories() {
    try {
      const [mallCategories, projectPage] = await Promise.all([
        listMallCategories(),
        listMallProjects({ pageSize: 100 }),
      ])
      return buildCategories(mallCategories, projectPage.list)
    } catch (error) {
      console.warn('[projectService] 使用静态类目兜底：', error)
      return fallbackCategories
    }
  },
  async getProject(id: string) {
    try {
      const [spu, mallCategories] = await Promise.all([
        apiRequest<MallSpu>(`/product/spu/get-detail?id=${encodeURIComponent(id)}`),
        listMallCategories(),
      ])
      return toProject(spu, new Map(mallCategories.map((category) => [category.id, category])))
    } catch (error) {
      console.warn('[projectService] 使用静态商品详情兜底：', error)
      return getProjectById(id)
    }
  },
  async listRelatedProjects(id: string, category = 'all') {
    const projects = await this.listProjects(category)
    const related = projects.filter((project) => project.id !== id)
    return related.length >= 3 ? related.slice(0, 3) : (await this.listProjects('all')).filter((project) => project.id !== id).slice(0, 3)
  },
}
