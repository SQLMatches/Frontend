<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" style="background-color: #2b2640;">
      <b-navbar-brand :to="{name: 'Home'}" class="text-light" style="font-family: Alata, sans-serif;">SQLMatches</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{name: 'Home'}">&nbsp;Home&nbsp;</b-nav-item>
          <b-nav-item :to="{name: 'Matches'}">&nbsp;Matches&nbsp;</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="communityName === null" :to="{name: 'CreateCommunity'}"><div class="btn btn-info btn-lg" role="button">Create Community&nbsp; <b-icon icon="plus-circle-fill" variant="light"></b-icon></div></b-nav-item>
          <b-nav-item v-else :to="{name: 'CommunityPage', params: {'communityName': communityName}}"><div class="btn btn-info btn-lg" role="button">Go to {{ communityName }}</div></b-nav-item>
          <b-nav-item v-if="!loggedIn" :to="{name: 'Login'}"><div class="btn btn-primary btn-lg" role="button">&nbsp;Login&nbsp; <b-icon icon="chevron-double-right" variant="light"></b-icon></div></b-nav-item>
          <b-nav-item v-else :to="{name: 'Logout'}"><div class="btn btn-primary btn-lg" role="button">&nbsp;Logout&nbsp; <b-icon icon="chevron-double-left" variant="light"></b-icon></div></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container">
      <div v-if="loggedIn">
        <router-view/>
      </div>
      <div v-else class="text-center text-light" style="margin-top:150px">
        <h3>This site requires you to login with steam before continuing.</h3>
        <router-link :to="{name: 'Login'}"><div class="btn btn-primary btn-lg" role="button">&nbsp;Login with steam&nbsp; <b-icon icon="chevron-double-right" variant="light"></b-icon></div></router-link>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      loggedIn: false,
      communityName: null
    }
  },
  created () {
    axios.get('/community/').then(res => {
      this.loggedIn = true
      this.communityName = res.data.data.community_name
    }).catch(_ => {
      this.loggedIn = false
    })
  }
}
</script>
