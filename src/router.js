import Vue from 'vue'
import Router from 'vue-router'
import Companies from './components/CompaniesList.vue'
import Products from './components/Products.vue'
import Orders from './components/Orders.vue'
import Reports from './components/Reports.vue'
import Login from './components/Login.vue'
import User from './components/User.vue'

import firebase from 'firebase'
import Inventory from './components/Inventory.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Orders,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/companies',
      name: 'companies',
      component: Companies,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/products/',
      name: 'products',
      component: Products,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
      meta: {
        requiresAuth: false
      }
    },  
    {
      path: '/User',
      name: 'User',
      component: User,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: Inventory,
      meta: {
        requiresAuth: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  //console.log(to);
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!firebase.auth().currentUser){
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    }else{
      next();
    }
  }else{
    next();
  }

});

 export default router
