import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Authentication Layout
  {
    path: '/auth',
    component: () => import('layouts/AuthenticationLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/authentication/LoginPage.vue'),
      },
    ],
  },

  // Main Layout
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [],
  },

  // Error page
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
