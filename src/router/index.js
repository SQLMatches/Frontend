import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'

import Home from '@/pages/Home'
import Matches from '@/pages/Matches'
import PageNotFound from '@/pages/PageNotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/matches',
      name: 'Matches',
      component: Matches
    },
    {
      path: '/login',
      name: 'Login',
      beforeEnter: (to, from, next) => {
        window.location.href = Axios.defaults.baseURL + '/steam/login?return=' + from.path
      }
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter: (to, from, next) => {
        window.location.href = Axios.defaults.baseURL + '/steam/logout'
      }
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
