import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MineSweeping.vue')
    },
    {
      path: '/mine',
      name: 'MineSweeping',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/demo',
      name: 'DEMO',
      component: () => import('../views/Demo.vue')
    }
  ]
})

export default router
