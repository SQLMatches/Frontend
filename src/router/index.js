import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'

import Home from '@/pages/Home'
import Scoreboard from '@/pages/Scoreboard'
import PageNotFound from '@/pages/PageNotFound'
import Create from '@/pages/Create'
import Profile from '@/pages/Profile'
import Community from '@/pages/Community'

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
      path: '/c/:communityName',
      name: 'CommunityPage',
      component: Community
    },
    {
      path: '/c/:communityName/scoreboard/:matchID',
      name: 'Scoreboard',
      component: Scoreboard
    },
    {
      path: '/c/:communityName/profile/:steamID',
      name: 'Profile',
      component: Profile
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
