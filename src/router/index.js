import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'

import Home from '@/pages/Home'
import Scoreboard from '@/pages/Scoreboard'
import PageNotFound from '@/pages/PageNotFound'
import Create from '@/pages/Create'
import Profile from '@/pages/Profile'
import Community from '@/pages/Community'
import Owner from '@/pages/Owner'
import Admin from '@/pages/Admin'
import TOS from '@/pages/Tos'

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
      path: '/tos',
      name: 'Tos',
      component: TOS
    },
    {
      path: '/c/:communityName',
      name: 'CommunityPage',
      component: Community
    },
    {
      path: '/c/:communityName/owner',
      name: 'Owner',
      component: Owner
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
      path: '/admin',
      name: 'Admin',
      component: Admin
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
