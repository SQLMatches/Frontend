<template>
    <div class="card text-light bg-dark content-div">
        <b-alert v-if="vacBans > 0" variant="warning" show>{{ profile.name }} has {{ vacBans }} VAC Ban<span v-if="vacBans > 1">s</span></b-alert>

        <div class="card-body text-center">
          <img v-if="profilePfp !== ''" class="rounded-circle" :src="profilePfp" width="112">
          <b-spinner v-else label="Spinning"></b-spinner>
          <h1>{{ profile.name }}</h1>
        </div>
        <div class="card-header">
          <b-tabs fill>
            <b-tab title="Statistics" active>
              <div class="card-body">
                <div v-if="loading" class="d-flex justify-content-center mb-3">
                  <b-spinner variant="light" label="Loading..."></b-spinner>
                </div>
                  <div v-else class="row">
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>Kills</h3>
                                  <p>{{ profile.kills }}</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>Deaths</h3>
                                  <p>{{ profile.deaths }}</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>Headshots</h3>
                                  <p>{{ profile.headshots }}</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>Assists</h3>
                                  <p>{{ profile.assists }}</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>KDR</h3>
                                  <p>{{ profile.kdr }}</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>HS %</h3>
                                  <p>{{ profile.hs_percentage }}%</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>HIT %</h3>
                                  <p>{{ profile.hit_percentage }}%</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-3">
                          <div class="card stats-card">
                              <div class="card-body text-center">
                                  <h3>MVPs</h3>
                                  <p>{{ profile.mvps }}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </b-tab>
            <b-tab title="Matches" v-on:click="getMatches()">
              <games :matches="matches"></games>
              <load-more v-if="!matches.hideLoadMore & !loading" v-on:click="loadMoreMatches"></load-more>
            </b-tab>
          </b-tabs>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Games from '../components/Games.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

import matches from '../mixins/matches.js'

export default {
  name: 'Profile',
  mixins: [
    matches
  ],
  components: {
    Games,
    SearchBar,
    LoadMore
  },
  data () {
    return {
      profilePfp: '',
      vacBans: 0,
      profile: {},
      loading: true
    }
  },
  async created () {
    this.matches.search = this.$route.params.steamID
    this.matches.wsEnabled = false

    this.loading = true

    await axios.get(`/profile/${this.$route.params.steamID}/?community_name=${this.$route.params.communityName}`).then(res => {
      this.profile = res.data.data
    }).catch(_ => {
      this.$router.push({name: 'PageNotFound'})
    })

    this.loading = false

    await axios.get(`https://cors-anywhere.herokuapp.com/http://steamcommunity.com/profiles/${this.$route.params.steamID}?xml=1`, {responseType: 'text'}).then(res => {
      var steamXml = new DOMParser().parseFromString(res.data, 'text/xml')
      this.profilePfp = steamXml.getElementsByTagName('avatarFull')[0].childNodes[0].nodeValue
      this.vacBans = steamXml.getElementsByTagName('vacBanned')[0].childNodes[0].nodeValue
    })
  }
}
</script>
