<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <b-alert v-if="banned" style="margin-top:25px;" variant="warning" show>This community has been banned from SQLMatches.com</b-alert>
            <b-alert v-else-if="disabled" style="margin-top:25px;" variant="warning" show>This community has been disabled by the owner.</b-alert>

            <div v-if="servers.list.length > 0">
              <servers style="margin-top:25px;" :servers="servers"></servers>
            </div>

            <div class="card bg-dark content-div">
                <div class="card-body">

                    <div v-if="apiAccessEnabled" style="margin-bottom:10px;" class="api-docs">
                      <div class="d-flex flex-row-reverse">
                        <b-button v-on:click="getApiKey(); getDoc()" class="text-right" v-b-toggle.api-docs variant="primary" size="sm"><b-icon icon="book" variant="light"></b-icon> API Doc</b-button>
                      </div>

                      <b-collapse id="api-docs" class="mt-2">
                        <b-card class="stats-card text-light">
                          <div v-if="readMe.loading" class="col-md-12 d-flex justify-content-center mb-3">
                            <b-spinner variant="light" label="Loading..."></b-spinner>
                          </div>
                          <div v-else>
                            <h1>API Key</h1>
                            <b-form inline>
                              <b-form-input disabled :value="apiKey" class="mb-2 mr-sm-2 mb-sm-0 key-hidden" style="width:35%;"></b-form-input>
                              <b-button variant="primary" class="mb-2 mr-sm-2 mb-sm-0" v-on:click="copyKey()"><b-icon icon="clipboard" variant="light"></b-icon></b-button>
                              <b-button v-if="!apiKey" v-on:click="generateKey()" variant="success " class="mb-2 mr-sm-2 mb-sm-0"><b-icon icon="check2-all" variant="light"></b-icon> Generate a key</b-button>
                              <b-button v-else v-on:click="regenerateKey()" variant="warning" class="mb-2 mr-sm-2 mb-sm-0"><b-icon icon="exclamation-octagon" variant="light"></b-icon> Regenerate</b-button>
                            </b-form>
                            <vue-showdown style="margin-top:25px;" :markdown="readMe.content"/>
                          </div>
                        </b-card>
                      </b-collapse>
                    </div>

                    <search-bar v-on:input="getMatches()" v-model="matches.search" :debounce="500"></search-bar>
                    <games :matches="matches"></games>
                    <load-more v-if="!matches.hideLoadMore && !matches.loading" v-on:click="loadMoreMatches()"></load-more>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import Games from '../components/Games.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'
import Servers from '../components/Servers.vue'

import settings from '../settings.js'

import matches from '../mixins/matches.js'
import serversMixin from '../mixins/serversMixin.js'

export default {
  name: 'Community',
  mixins: [
    matches,
    serversMixin
  ],
  components: {
    Games,
    SearchBar,
    LoadMore,
    Servers
  },
  data () {
    return {
      banned: false,
      disabled: false,
      apiAccessEnabled: false,
      readMe: {
        loading: true,
        content: ''
      },
      apiKey: null
    }
  },
  async beforeRouteUpdate (to, from, next) {
    next()

    if (to.name === from.name && to.params !== from.params) {
      await this.loadCommunity()
    }
  },
  async created () {
    await this.loadCommunity()
  },
  methods: {
    async loadCommunity () {
      await axios.get(`/community/public/?community_name=${this.$route.params.communityName}`).then(async res => {
        this.banned = res.data.data.banned
        this.disabled = res.data.data.disabled
        this.apiAccessEnabled = res.data.data.allow_api_access

        await this.getServers()
        await this.getMatches()
      }).catch(_ => {
        this.$router.push({name: 'PageNotFound'})
      })
    },
    async getDoc () {
      if (this.readMe.loading) {
        await axios.get(settings.documentationReadMe).then(res => {
          this.readMe.content = res.data
        })

        this.readMe.loading = false
      } else {
        this.readMe.loading = true
      }
    },
    async getApiKey () {
      await axios.get(`/community/key/?community_name=${this.$route.params.communityName}`).then(res => {
        this.apiKey = res.data.data.api_key
      })
    },
    async generateKey () {
      await axios.post(`/community/key/?community_name=${this.$route.params.communityName}`).then(res => {
        this.apiKey = res.data.data.api_key
      })
    },
    async regenerateKey () {
      await axios.delete(`/community/key/?community_name=${this.$route.params.communityName}`, {data: {api_key: this.apiKey}}).then(res => {
        this.apiKey = res.data.data.api_key
      })
    },
    async copyKey () {
      await navigator.clipboard.writeText(this.apiKey)
    }
  }
}
</script>
