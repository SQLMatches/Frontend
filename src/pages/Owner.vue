<template>
  <div>
    <b-alert v-if="!subscriptionExpires" show dismissible class="content-div">
      Need to upload demos over 50 MB? Check out the Subscriptions / Billing tab!
    </b-alert>

    <stripe-checkout
      ref="checkoutRef"
      :pk="stripe.publishableKey"
      :session-id="stripe.sessionId"
    />

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
                <b-tab v-if="subscriptionExpires" title="Subscriptions / Billing" v-on:click="loadBillingSession()"></b-tab>
                <b-tab v-else title="Subscriptions / Billing" v-on:click="loadCheckoutSession()"></b-tab>
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
            <h3 style="margin-bottom:0.5rem;">Update email</h3>
            <b-form-group label="Email" label-for="email-update">
              <b-form-input id="email-update" autocomplete="off" v-model="form.email" :state="emailState" :placeholder="email" v-on:input="validateEmail()" required></b-form-input>
            </b-form-group>
            <b-button variant="info" v-on:click="updateEmail()">Update email</b-button>

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
          <div v-else class="create-community">
              <p style="margin-bottom: 25px;">Get data pushed to endpoints on match events.</p>
              <p>Each payload pushes with BasicAuth authentication what has your master API key as the password, please validate this before using the payload.</p>
              <p style="margin-bottom: 25px;">Be careful who you push webhooks to, because they'll be able to retrieve your master api key.</p>

              <b-form-group label="Match End Event" label-for="match-end-webhook">
                <b-form-input v-model="webhooks.matchEnd.value" v-on:input="validateWebhook()" :state="webhooks.matchEnd.state" id="match-end-webhook" autocomplete="off" :placeholder="webhooks.matchEnd.value" required></b-form-input>
              </b-form-group>

              <b-form-group label="Match Start Event" label-for="match-start-webhook">
                <b-form-input v-model="webhooks.matchStart.value" v-on:input="validateWebhook()" :state="webhooks.matchStart.state" id="match-start-webhook" autocomplete="off" :placeholder="webhooks.matchStart.value" required></b-form-input>
              </b-form-group>

              <b-form-group label="Round End Event" label-for="round-end-webhook">
                <b-form-input v-model="webhooks.roundEnd.value" v-on:input="validateWebhook()" :state="webhooks.roundEnd.state" id="round-end-webhook" autocomplete="off" :placeholder="webhooks.roundEnd.value" required></b-form-input>
              </b-form-group>

              <b-button variant="primary" v-on:click="updateWebhooks()" v-if="webhooks.submitState">Update Webhooks</b-button>
              <div v-else>
                <b-button variant="primary" v-on:click="updateWebhooks()" disabled>Update Webhooks</b-button>
              </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { StripeCheckout } from '@vue-stripe/vue-stripe'

import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

import matches from '../mixins/matches.js'
import email from '../mixins/email.js'

import settings from '../settings.js'

const webhookReg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

export default {
  name: 'Owner',
  mixins: [
    matches,
    email
  ],
  components: {
    StripeCheckout,
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
      email: null,
      paymentRecords: null,
      subscriptionExpires: null,
      validateWebhookRegExp: new RegExp(webhookReg),
      form: {
        email: null
      },
      stripe: {
        publishableKey: settings.stripePublishableKey,
        sessionId: null
      },
      webhooks: {
        submitState: false,
        length: {
          min: 5,
          max: 255
        },
        matchEnd: {
          state: null,
          value: null
        },
        matchStart: {
          state: null,
          value: null
        },
        roundEnd: {
          state: null,
          value: null
        }
      }
    }
  },
  async created () {
    await this.getCommunity()
    if (window.location.hash) {
      this.changeTab(Number(window.location.hash.replace('#tab', '')))
    }
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
    validateWebhook () {
      if (this.webhooks.matchEnd.value) {
        this.webhooks.matchEnd.state = (
          this.validateWebhookRegExp.test(this.webhooks.matchEnd.value) && (
            this.webhooks.matchEnd.value.length >= this.webhooks.length.min && this.webhooks.matchEnd.value.length <= this.webhooks.length.max
          )
        )
      }

      if (this.webhooks.matchStart.value) {
        this.webhooks.matchStart.state = (
          this.validateWebhookRegExp.test(this.webhooks.matchStart.value) && (
            this.webhooks.matchStart.value.length >= this.webhooks.length.min && this.webhooks.matchStart.value.length <= this.webhooks.length.max
          )
        )
      }

      if (this.webhooks.roundEnd.value) {
        this.webhooks.roundEnd.state = (
          this.validateWebhookRegExp.test(this.webhooks.roundEnd.value) && (
            this.webhooks.roundEnd.value.length >= this.webhooks.length.min && this.webhooks.roundEnd.value.length <= this.webhooks.length.max
          )
        )
      }

      if (this.webhooks.matchEnd.state !== false && this.webhooks.matchStart.state !== false && this.webhooks.roundEnd.state !== false) {
        this.webhooks.submitState = true
      } else {
        this.webhooks.submitState = false
      }
    },
    async loadBillingSession () {
      await axios.get(`/community/owner/stripe-session/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        window.location.href = res.data.data.url
      })
    },
    async loadCheckoutSession () {
      await axios.post(`/community/owner/stripe-session/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.stripe.sessionId = res.data.data.session_id
        this.$refs.checkoutRef.redirectToCheckout()
      })
    },
    async updateEmail () {
      await axios.post(`/community/owner/update/?community_name=${this.$route.params.communityName}&check_ownership=true`, {email: this.form.email}).then(res => {
        this.email = this.form.email
      })
    },
    async updateWebhooks () {
      var payload = {}

      if (this.webhooks.matchEnd.value) {
        payload['match_end_webhook'] = this.webhooks.matchEnd.value
      }

      if (this.webhooks.matchStart.value) {
        payload['match_start_webhook'] = this.webhooks.matchStart.value
      }

      if (this.webhooks.roundEnd.value) {
        payload['round_end_webhook'] = this.webhooks.roundEnd.value
      }

      await axios.post(`/community/owner/update/?community_name=${this.$route.params.communityName}&check_ownership=true`, payload).then(res => {
        this.webhooks.submitState = false
        this.webhooks.matchEnd.state = null
        this.webhooks.matchStart.state = null
        this.webhooks.roundEnd.state = null
      })
    },
    async toggleApiAccess () {
      if (this.apiAccessDisabled) {
        this.apiAccessDisabled = false
      } else {
        this.apiAccessDisabled = true
      }

      await axios.post(`/community/owner/update/?community_name=${this.$route.params.communityName}&check_ownership=true`, {allow_api_access: this.apiAccessDisabled})
    },
    async getCommunity () {
      await axios.get(`/community/owner/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        var community = res.data.data.community

        this.webhooks.matchEnd.value = community.match_end_webhook
        this.webhooks.matchStart.value = community.match_start_webhook
        this.webhooks.roundEnd.value = community.round_end_webhook
        this.apiAccessDisabled = community.allow_api_access
        this.masterApiKey = community.master_api_key
        this.email = community.email
        this.subscriptionExpires = community.subscription_expires

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
