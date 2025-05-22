import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/dashboard/Master.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Dashboard,
      children: [
        {
            path: '/',
            component: () => import('../views/Home.vue'),
        },
        {
          path: '/halt',
          component: () => import('../views/HaltMonitor.vue'),
        }
      ]
    },
  ],
})

export default router
