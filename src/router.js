import Vue from 'vue'
import Router from 'vue-router'
import Companies from './components/CompaniesList.vue'

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
      component: () => import(/* webpackChunkName: "about" */ './components/Products.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import(/* webpackChunkName: "about" */ './components/Orders.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import(/* webpackChunkName: "about" */ './components/Reports.vue')
    }     
  ]
})
