import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'

import Home from '@/pages/Home'
import Matches from '@/pages/Matches'
import Scoreboard from '@/pages/Scoreboard'
import PageNotFound from '@/pages/PageNotFound'
import Create from '@/pages/Create'

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
      path: '/c/:communityName',
      name: 'CommunityPage'
    },
    {
      path: '/c/:communityName/s/:matchID',
      name: 'Scoreboard',
      component: Scoreboard
    },
    {
      path: '/create',
      name: 'CreateCommunity',
      component: Create
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
      path: '/download/:matchID',
      name: 'DemoDownload',
      beforeEnter: (to, from, next) => {
        window.location.href = Axios.defaults.baseURL + `/match/${to.params.matchID}/download/`
      }
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
