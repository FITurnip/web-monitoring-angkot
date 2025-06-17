import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/dashboard/Master.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
    },
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
        },
        {
          path: '/angkot/',
          children: [
            {
              path: 'list',
              component: () => import('../views/AngkotList.vue'),
            },
            {
              path: 'form',
              component: () => import('../views/AngkotForm.vue'),
            },
          ]
        },
        {
          path: '/jurusan/',
          children: [
            {
              path: 'list',
              component: () => import('../views/JurusanList.vue'),
            },
            {
              path: 'form',
              component: () => import('../views/JurusanForm.vue'),
            },
          ]
        },
        {
          path: '/supir',
          component: () => import('../views/Supir.vue'),
        },
        {
          path: '/profile',
          component: () => import('../views/Profile.vue'),
        }
      ]
    },
  ],
})

export default router
