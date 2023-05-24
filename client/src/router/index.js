import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/query-builder',
    name: 'query-builder',
    component: function () {
      return import('../views/Builder.vue')
    },
  },
  {
    path: '/saved-queries',
    name: 'saved-queries',
    component: function () {
      return import('../views/Saved.vue')
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
