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

              <b-button variant="danger" v-if="matchesToDelete.length > 0" block v-on:click="deleteMatches()">Delete selected matches</b-button>
              <b-button variant="danger" v-else block disabled>Delete selected matches</b-button>
            </div>
            <h3 v-else class="text-center text-light">No matches</h3>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Owner',
  data () {
    return {
      masterApiKey: null,
      communityStats: {},
      tabNumber: 0,
      matches: [],
      matchesToDelete: []
    }
  },
  async created () {
    await axios.get(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
      this.masterApiKey = res.data.data.community.master_api_key
      this.communityStats = res.data.data.stats
    }).catch(_ => {
      this.$router.push({name: 'PageNotFound'})
    })
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
    async regenerateMaster () {
      await axios.post(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.masterApiKey = res.data.data.master_api_key
      })
    },
    async getMatches () {
      await axios.post(`/matches/?community_name=${this.$route.params.communityName}`, {require_scoreboard: false}).then(res => {
        this.matches = res.data.data
      })
    },
    async deleteMatches () {
      await axios.delete(`/community/owner/matches/?community_name=${this.$route.params.communityName}&check_ownership=true`, {data: {matches: this.matchesToDelete}}).then(async res => {
        this.matchesToDelete = []
        await this.getMatches()
      })
    }
  }
}
</script>
