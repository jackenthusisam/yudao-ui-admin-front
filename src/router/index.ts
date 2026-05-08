import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import MarketplacePage from '../pages/MarketplacePage.vue'
import MembershipPage from '../pages/MembershipPage.vue'
import ProjectDetailPage from '../pages/ProjectDetailPage.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/market', name: 'market', component: MarketplacePage },
    { path: '/projects/:id', name: 'project-detail', component: ProjectDetailPage },
    { path: '/membership', name: 'membership', component: MembershipPage },
    { path: '/partners', redirect: '/membership' },
    { path: '/about', redirect: '/' },
  ],
})

export default router
