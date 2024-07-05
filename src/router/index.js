import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CurrencyExchange from '../views/CurrencyExchange.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/currency-exchange',
    name: 'currencyExchange',
    component: CurrencyExchange
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
