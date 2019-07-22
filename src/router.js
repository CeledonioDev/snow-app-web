import Vue from 'vue'
import Router from 'vue-router'
import Companies from './components/CompaniesList.vue'
import Products from './components/Products.vue'
import Orders from './components/Orders.vue'
import Reports from './components/Reports.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/companies',
      name: 'home',
      component: Companies
    },
    {
      path: '/companies',
      name: 'companies',
      component: Companies
    },
    {
      path: '/products/',
      name: 'products',
      component: Products
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    }     
  ]
})
