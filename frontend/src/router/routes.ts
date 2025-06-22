import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Authentication Layout
  {
    path: '/auth',
    component: () => import('layouts/AuthenticationLayout.vue'),
    children: [
      // Login Page
      {
        path: 'login',
        component: () => import('pages/authentication/LoginPage.vue'),
      },
      // Register Account Page
      {
        path: 'register',
        component: () => import('pages/authentication/RegisterPage.vue'),
      },
      // Reset Password Page
      {
        path: 'reset',
        component: () => import('pages/authentication/ResetPasswordPage.vue'),
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
