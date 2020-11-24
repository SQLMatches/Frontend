import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'

import Home from '@/pages/Home'
import Matches from '@/pages/Matches'

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
      path: '/',
      name: 'Matches',
      component: Matches
    },
    {
      path: '/login',
      name: 'Login',
      beforeEnter: (to, from, next) => {
        window.location.href = Axios.defaults.baseURL + '/steam/login'
      }
    }
  ]
})
