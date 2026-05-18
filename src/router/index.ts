import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AuthPage from '../pages/AuthPage.vue'
import CartPage from '../pages/CartPage.vue'
import MarketplacePage from '../pages/MarketplacePage.vue'
import MembershipPage from '../pages/MembershipPage.vue'
import ProjectDetailPage from '../pages/ProjectDetailPage.vue'
import PurchasesPage from '../pages/PurchasesPage.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/login', name: 'login', component: AuthPage },
    { path: '/register', name: 'register', component: AuthPage },
    { path: '/market', name: 'market', component: MarketplacePage },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/purchases', name: 'purchases', component: PurchasesPage },
    { path: '/projects/:id', name: 'project-detail', component: ProjectDetailPage },
    { path: '/membership', name: 'membership', component: MembershipPage },
    { path: '/partners', redirect: '/membership' },
    { path: '/about', redirect: '/' },
  ],
})

export default router
