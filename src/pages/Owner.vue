<template>
  <div>
    <div class="card bg-dark content-div">
        <div class="card-body">
            <div class="row">
                <div class="col-md-3 text-center">
                    <h3 class="text-light">Total Matches</h3>
                    <h4 class="text-light">{{ communityStats.total_matches }}</h4>
                </div>
                <div class="col-md-3 text-center">
                    <h3 class="text-light">Active Matches</h3>
                    <h4 class="text-light">{{ communityStats.active_matches }}</h4>
                </div>
                <div class="col-md-3 text-center">
                    <h3 class="text-light">Stored Demos</h3>
                    <h4 class="text-light">{{ communityStats.stored_demos }}</h4>
                </div>
                <div class="col-md-3 text-center">
                    <h3 class="text-light">Total Users</h3>
                    <h4 class="text-light">{{ communityStats.total_users }}</h4>
                </div>
            </div>
        </div>
    </div>
    <div class="card text-light bg-dark content-div">
        <div class="card-header">
            <b-tabs fill>
                <b-tab title="API" active v-on:click="changeTab(0)"></b-tab>
                <b-tab title="Matches" v-on:click="changeTab(1); getMatches()"></b-tab>
                <b-tab title="Community" v-on:click="changeTab(2)"></b-tab>
            </b-tabs>
        </div>
        <div class="card-body">
          <div v-if="tabNumber === 0">
            <h3>Master API Key</h3>
            <p class="key-hidden">{{ masterApiKey }}</p>
            <p class="text-danger" style="font-size: 10px; margin: 15px 0 15px;">NEVER SHARE YOUR API KEY WITH ANYONE, MISS USING OUR API WILL RESULT IN A PERMANENT BAN!</p>
            <b-button variant="warning" block v-on:click="regenerateMaster()">Regenerate master key</b-button>
          </div>
          <div v-else-if="tabNumber === 1">
            <search-bar v-model="matchSearch" v-on:input="getMatches"></search-bar>

            <div v-if="matches.length > 0">
              <ul class="list-unstyled matches">
                  <li v-for="(match, index) in matches" :key="index" v-on:click="addMatchToDelete(match.match_id)">
                      <div class="card match" v-bind:class="{'selected-to-delete': matchesToDelete.includes(match.match_id)}" v-b-tooltip.hover :title="`${match.timestamp} - ${match.map}`">
                        <img class="card-img w-100 d-block" :src="match.cover_image">
                          <div class="card-img-overlay d-flex d-xl-flex flex-column flex-grow-0 flex-shrink-0 justify-content-center align-items-center justify-content-xl-center align-items-xl-center">
                              <div class="row no-gutters row-cols-3 match">
                                  <div class="col-md-4" style="text-align: right;">
                                      <h2 class="text-center text-light">Team {{ match.team_1_name }}</h2>
                                  </div>
                                  <div class="col-md-4">
                                      <h2 class="text-center text-light">{{ match.team_1_score }}:{{ match.team_2_score }}</h2>
                                  </div>
                                  <div class="col-md-4">
                                      <h2 class="text-center text-light" style="text-align: left;">Team {{ match.team_2_name }}</h2>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </li>
              </ul>
            </div>
            <h3 v-else class="text-center text-light" style="margin-bottom: 25px">No matches</h3>

            <b-button variant="danger" v-if="matchesToDelete.length > 0" block v-on:click="deleteMatches()">Delete selected match<span v-if="matchesToDelete.length > 1">es</span></b-button>
            <b-button variant="danger" v-else block disabled>Delete selected match</b-button>
          </div>
          <div v-else-if="tabNumber === 2">
            <b-toast id="community-disable" class="create-community" :title="`Please enter '${this.$route.params.communityName}' to disable it.`" static no-auto-hide>
              <b-form-input style="color:#fff;" v-model="communityNameDisable" v-on:input="validateCommunityName" :state="validCommunityName" type="text" placeholder="Community Name" autocomplete="off"></b-form-input>
              <b-button v-if="validCommunityName" variant="danger" v-on:click="CommunityDisable" block>Confirm</b-button>
              <b-button v-else variant="danger" block disabled>Confirm</b-button>
            </b-toast>
            <b-button variant="danger" v-on:click="$bvToast.show('community-disable')" block>Disable community</b-button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

export default {
  name: 'Owner',
  components: {
    SearchBar,
    LoadMore
  },
  data () {
    return {
      masterApiKey: null,
      communityStats: {},
      tabNumber: 0,
      matches: [],
      matchesToDelete: [],
      matchSearch: null,
      communityNameDisable: null,
      validCommunityName: null
    }
  },
  async created () {
    await this.getCommunity()
  },
  methods: {
    changeTab (tab) {
      this.tabNumber = tab
    },
    addMatchToDelete (matchID) {
      if (this.matchesToDelete.includes(matchID)) {
        this.matchesToDelete.splice(this.matchesToDelete.indexOf(matchID), 1)
      } else {
        this.matchesToDelete.push(matchID)
      }
    },
    async getCommunity () {
      await axios.get(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.masterApiKey = res.data.data.community.master_api_key
        this.communityStats = res.data.data.stats
      }).catch(_ => {
        this.$router.push({name: 'PageNotFound'})
      })
    },
    async regenerateMaster () {
      await axios.post(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.masterApiKey = res.data.data.master_api_key
      })
    },
    async getMatches () {
      var payload = {require_scoreboard: false}

      if (this.matchSearch) {
        payload['search'] = this.matchSearch
      }

      await axios.post(`/matches/?community_name=${this.$route.params.communityName}`, payload).then(res => {
        this.matches = res.data.data
      })
    },
    async deleteMatches () {
      await axios.delete(`/community/owner/matches/?community_name=${this.$route.params.communityName}&check_ownership=true`, {data: {matches: this.matchesToDelete}}).then(async res => {
        this.communityStats.total_matches -= this.matchesToDelete.length
        this.matchesToDelete = []

        await this.getMatches()
      })
    },
    async CommunityDisable () {
      if (this.communityNameDisable === this.$route.params.communityName) {
        await axios.delete(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
          window.location.href = '/'
        })
      }
    },
    validateCommunityName () {
      this.validCommunityName = this.communityNameDisable === this.$route.params.communityName
    }
  }
}
</script>
