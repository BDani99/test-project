import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CurrencyExchange from '../views/CurrencyExchange.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
