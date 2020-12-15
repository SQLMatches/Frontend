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
                <b-tab title="Webhooks" v-on:click="changeTab(3)"></b-tab>
                <b-tab title="Payments" v-on:click="changeTab(4)"></b-tab>
            </b-tabs>
        </div>
        <div class="card-body">
          <div v-if="tabNumber === 0">
            <h3>Master API Key</h3>
            <p>Warning, never share this key with anyone!</p>
            <b-form inline>
              <b-form-input :value="masterApiKey" disabled class="mb-2 mr-sm-2 mb-sm-0 key-hidden" style="width:35%;"></b-form-input>
              <b-button variant="primary" class="mb-2 mr-sm-2 mb-sm-0" v-on:click="copyMasterKey()"><b-icon icon="clipboard" variant="light"></b-icon></b-button>
              <b-button variant="warning" v-on:click="regenerateMaster()" class="mb-2 mr-sm-2 mb-sm-0"><b-icon icon="exclamation-octagon" variant="light"></b-icon> Regenerate</b-button>
            </b-form>

            <h3 style="margin-top:35px;">API Access</h3>
            <p>Give users access to pull community data.</p>
            <b-button v-bind:class="{'btn-success': !apiAccessDisabled, 'btn-danger': apiAccessDisabled}" v-on:click="toggleApiAccess()" class="text-light">
              <span v-if="!apiAccessDisabled">Enable</span><span v-else>Disable</span> Access
            </b-button>
          </div>
          <div v-else-if="tabNumber === 1">
            <search-bar v-model="matches.search" v-on:input="getMatches"></search-bar>

            <div v-if="matches.list.length > 0">
              <ul class="list-unstyled matches">
                  <li v-for="(match, index) in matches.list" :key="index" v-on:click="addMatchToDelete(match.match_id)">
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
            <h3 v-else class="text-center text-light" style="margin-bottom: 25px">No matches found</h3>

            <b-button variant="danger" v-if="matchesToDelete.length > 0" block v-on:click="deleteMatches()">Delete selected match<span v-if="matchesToDelete.length > 1">es</span></b-button>
            <b-button variant="danger" v-else block disabled>Delete selected match</b-button>
          </div>
          <div v-else-if="tabNumber === 2">
            <label for="cost"><h3>Adjust max upload</h3></label>
            <b-form-input type="range" name="cost" :min="minUpload" :max="maxUpload" v-model="form.max_upload"></b-form-input>
            <div>Max upload size: {{ form.max_upload }} MB</div>
            <div>Cost per month: {{ ((form.max_upload - minUpload) * costPerMb).toFixed(2) }} USD</div>
            <p>When decreasing your max upload, the changes will take affect after the month ends.</p>

            <div style="margin-top:25px;">
              <h3 style="margin-bottom:0.5rem;">Dangerous options</h3>
              <b-toast id="community-disable" class="create-community" :title="`Please enter '${this.$route.params.communityName}' to disable it.`" static no-auto-hide>
                <b-form-input style="color:#fff;" v-model="communityNameDisable" v-on:input="validateCommunityName" :state="validCommunityName" type="text" placeholder="Community Name" autocomplete="off"></b-form-input>
                <b-button v-if="validCommunityName" variant="danger" v-on:click="CommunityDisable" block>Confirm</b-button>
                <b-button v-else variant="danger" block disabled>Confirm</b-button>
              </b-toast>
              <b-button variant="danger" v-on:click="$bvToast.show('community-disable')">Disable community</b-button>
            </div>
          </div>
          <div v-else-if="tabNumber === 4">
            <h3>Payment logs</h3>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

import matches from '../mixins/matches.js'
import settings from '../settings.js'

export default {
  name: 'Owner',
  mixins: [
    matches
  ],
  components: {
    SearchBar,
    LoadMore
  },
  data () {
    return {
      masterApiKey: null,
      communityStats: {},
      tabNumber: 0,
      matchesToDelete: [],
      communityNameDisable: null,
      validCommunityName: null,
      apiAccessDisabled: null,
      costPerMb: settings.costs.costPerMb,
      minUpload: settings.costs.minUpload,
      maxUpload: settings.costs.maxUpload,
      form: {
        max_upload: settings.costs.minUpload
      }
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
    validateCommunityName () {
      this.validCommunityName = this.communityNameDisable === this.$route.params.communityName
    },
    async toggleApiAccess () {
      if (this.apiAccessDisabled) {
        this.apiAccessDisabled = false
      } else {
        this.apiAccessDisabled = true
      }

      await axios.post(`/community/owner/access/?community_name=${this.$route.params.communityName}&check_ownership=true`, {enabled: this.apiAccessDisabled})
    },
    async getCommunity () {
      await axios.get(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.apiAccessDisabled = res.data.data.community.allow_api_access
        this.form.max_upload = res.data.data.community.max_upload
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
    async copyMasterKey () {
      await navigator.clipboard.writeText(this.masterApiKey)
    }
  }
}
</script>
