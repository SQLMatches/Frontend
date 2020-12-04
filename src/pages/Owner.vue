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
                <b-tab title="Matches" v-on:click="changeTab(1)"></b-tab>
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
      tabNumber: 0
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
    async regenerateMaster () {
      await axios.post(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.masterApiKey = res.data.data.master_api_key
      })
    }
  }
}
</script>
