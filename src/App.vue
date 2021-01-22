<template>
  <div id="app">
    <b-alert v-if="banned" variant="warning" show style="margin-bottom: 0;">You have been banned off SQLMatches.com</b-alert>

    <b-navbar toggleable="lg" type="dark" style="background-color: #2b2640;">
      <div class="text-light" style="font-family: Alata, sans-serif;">
        <b-navbar-brand v-if="communityPageName == null" :to="{name: 'Home'}">SQLMatches</b-navbar-brand>
        <b-navbar-brand v-else :to="{name: 'CommunityPage', params: {'communityName': communityPageName}}">{{ communityPageName }} <span style="font-size:0.5em">Hosted by SQLMatches</span></b-navbar-brand>
      </div>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="communityName === null && $route.name !== 'CreateCommunity'" :to="{name: 'CreateCommunity'}"><div class="btn btn-info btn-lg" role="button">Create Community&nbsp; <b-icon icon="plus-circle-fill" variant="light"></b-icon></div></b-nav-item>
          <b-nav-item v-else-if="communityPageName !== communityName" :to="{name: 'CommunityPage', params: {'communityName': communityName}}"><div class="btn btn-info btn-lg" role="button">Go to {{ communityName }}</div></b-nav-item>

          <b-nav-item v-if="communityName != null && !banned" :to="{name: 'Owner', params: {'communityName': communityName}}"><div class="btn btn-info btn-lg" role="button">Owner Panel</div></b-nav-item>

          <b-nav-item v-if="!loggedIn" :to="{name: 'Login'}"><div class="btn btn-primary btn-lg" role="button">&nbsp;Login&nbsp; <b-icon icon="chevron-double-right" variant="light"></b-icon></div></b-nav-item>
          <b-nav-item v-else :to="{name: 'Logout'}"><div class="btn btn-primary btn-lg" role="button">&nbsp;Logout&nbsp; <b-icon icon="chevron-double-left" variant="light"></b-icon></div></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container">
      <div v-if="loading" class="col-md-12 d-flex justify-content-center mb-3" style="margin-top:25px;">
        <h3 class="text-light">Loading...</h3>
        <b-spinner variant="light" label="Loading..."></b-spinner>
      </div>
      <div v-else-if="loggedIn">
        <router-view/>
      </div>
      <div v-else class="text-center text-light" style="margin-top:150px">
        <h3>This site requires you to login with steam before continuing.</h3>
        <router-link :to="{name: 'Login'}"><div class="btn btn-primary btn-lg" role="button">&nbsp;Login with steam&nbsp; <b-icon icon="chevron-double-right" variant="light"></b-icon></div></router-link>
      </div>
    </div>

    <!-- Start: Footer Dark -->
    <div class="footer-dark bg-dark content-div">
        <footer>
            <div class="container">
                <div class="row">
                    <!-- Start: Services -->
                    <div class="col-sm-6 col-md-3 item">
                        <h3>Index</h3>
                        <ul>
                            <li><router-link :to="{name: 'Home'}">Home</router-link></li>
                            <li v-if="communityName === null"><router-link :to="{name: 'Home'}">Create a community</router-link></li>
                            <div v-else>
                              <li><router-link :to="{name: 'CommunityPage', params: {'communityName': communityName}}">{{ communityName }}</router-link></li>
                              <li><router-link :to="{name: 'Owner', params: {'communityName': communityName}}">Owner Panel</router-link></li>
                            </div>
                        </ul>
                    </div>
                    <!-- End: Services -->
                    <!-- Start: About -->
                    <div class="col-sm-6 col-md-3 item">
                        <h3>Externals</h3>
                        <ul>
                            <li><a :href="socials.discord" target="_blank">Discord</a></li>
                            <li><a :href="socials.twitter" target="_blank">Twitter</a></li>
                            <li><a :href="socials.github" target="_blank">GitHub</a></li>
                        </ul>
                    </div>
                    <!-- End: About -->
                    <!-- Start: Footer Text -->
                    <div class="col-md-6 item text">
                        <h3>About</h3>
                        <p>SQLMatches allows you to create communities to easily record demos & to view scoreboards in real-time. Including a per community profile system, caching, live updating, moderation tools & more!</p>
                    </div>
                    <!-- End: Footer Text -->
                </div>
                <!-- Start: Copyright -->
                <p class="copyright">SQLMatches is proudly licensed under GPL-3.0</p>
                <!-- End: Copyright -->
            </div>
        </footer>
    </div>
    <!-- End: Footer Dark -->
  </div>
</template>

<script>
import axios from 'axios'

import settings from './settings.js'

export default {
  name: 'App',
  data () {
    return {
      loggedIn: false,
      banned: false,
      communityName: null,
      communityPageName: null,
      loading: true,
      socials: settings.socials
    }
  },
  async created () {
    this.loading = true

    await axios.get('/community/').then(res => {
      this.loggedIn = true
      this.communityName = res.data.data.community_name
      this.banned = res.data.data.banned

      localStorage.setItem('steamID', res.data.data.steam_id)
    }).catch(_ => {
      this.loggedIn = false
    })

    this.setCommunityPageName()

    this.loading = false
  },
  watch: {
    '$route.path': function () {
      this.setCommunityPageName()
    }
  },
  methods: {
    setCommunityPageName () {
      if ('communityName' in this.$route.params) {
        this.communityPageName = this.$route.params.communityName
      } else {
        this.communityPageName = null
      }
    }
  }
}
</script>
