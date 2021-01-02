<template>
  <div>
    <b-alert v-if="paymentStatus === 2" variant="warning" show>Your subscription payment failed, please update your credit card details.</b-alert>

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
                <b-tab title="Payments" v-on:click="changeTab(4); getPayments()"></b-tab>
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
            <b-form-input v-if="paymentStatus !== 0" type="range" name="cost" :min="minUpload" :max="maxUpload" v-model="currentUpload"></b-form-input>
            <b-form-input v-else type="range" name="cost" :min="minUpload" :max="maxUpload" v-model="currentUpload" disabled></b-form-input>

            <div>Max upload size: {{ currentUpload }} MB</div>
            <div>Cost per month: {{ getCost() }} USD</div>

            <div v-if="cardId">
              <b-button v-if="minUpload >= currentUpload" variant="info" block disabled>Subscribe</b-button>
                <b-button v-else-if="paymentStatus === null" v-on:click="createSub()" variant="info" block>Subscribe</b-button>
                <b-button v-else-if="paymentStatus === 0" variant="info" disabled block>
                  <b-spinner small></b-spinner>
                  Waiting for payment confirmation...
                </b-button>
            </div>
            <b-button v-else variant="info" block disabled>Add a card inorder to subscribe</b-button>

            <h3 style="margin-top:25px;">Card details</h3>
            <p class="text-danger" v-if="cardErrors.stripe">Card wasn't accepted by Stripe</p>
            <form>
              <div class="row pt-4">
                <div class="col-sm-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Card Number:</label>
                    <div class="input-group mb-0">
                      <input ref="cardNumInput" v-model="card.number" type="tel" class="form-control" placeholder="#### #### #### ####" v-cardformat:formatCardNumber>
                    </div>
                    <div v-if="cardErrors.cardNumber" class="error">
                      <small>{{ cardErrors.cardNumber }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-sm-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Name on card:</label>
                    <div class="input-group mb-0">
                      <input ref="cardNumInput" v-model="card.name" placeholder="# ########" type="input" class="form-control">
                    </div>
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-4 col-lg-2">
                  <div class="form-group">
                    <label>Card Expiration:</label>
                    <input ref="cardExpInput" id="card-exp" v-model="card.expiry" placeholder="## / ##" maxlength="10" class="form-control" v-cardformat:formatCardExpiry>
                    <div v-if="cardErrors.cardExpiry" class="error">
                      <small>{{ cardErrors.cardExpiry }}</small>
                    </div>
                  </div>
                </div>
                <div class="col-4 col-lg-2">
                  <div class="form-group">
                    <label>Card CVC:</label>
                    <input ref="cardCvcInput" v-model="card.cvc" class="form-control" placeholder="###" v-cardformat:formatCardCVC>
                    <div v-if="cardErrors.cardCvc" class="error">
                      <small>{{ cardErrors.cardCvc }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 pt-2">
                  <p>SQLMatches doesn't store any card details, all payments are handle via Stripe.com.</p>
                  <button type="button" class="btn btn-info" v-on:click="addCard"><span v-if="!cardId">Add</span><span v-else>Update</span> card</button>
                </div>
              </div>
            </form>

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
          <div v-else-if="tabNumber === 3" class="create-community">
              <p style="margin-bottom: 25px;">Get data pushed to endpoints on match events.</p>
              <p style="margin-bottom: 25px;">Each payload pushes with BasicAuth authentication what has your master API key as the password, please validate this before using the payload.</p>

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
          <div v-else-if="tabNumber === 4">
            <div v-if="paymentRecords == null" class="d-flex justify-content-center mb-3">
              <b-spinner></b-spinner>
            </div>
            <h3 v-else-if="paymentRecords.length === 0" class="text-center">No payment logs :/</h3>
            <div v-else>
              <h3>Payments</h3>

              <b-list-group>
                <b-list-group-item v-for="(payment, index) in paymentRecords" :key="index">
                  Payment ID: {{ payment.payment_id }} <br>
                  Amount: {{ payment.amount_paid }} <br>
                  Timestamp: {{ payment.timestamp }}
                </b-list-group-item>
              </b-list-group>
            </div>
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

const webhookReg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

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
      paymentRecords: null,
      cardId: null,
      paymentStatus: null,
      validateWebhookRegExp: new RegExp(webhookReg),
      costPerMb: settings.costs.costPerMb,
      minUpload: settings.costs.minUpload,
      maxUpload: settings.costs.maxUpload,
      currentUpload: settings.costs.minUpload,
      paymentId: null,
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
      },
      card: {
        cvc: null,
        expiry: null,
        number: null,
        name: null
      },
      cardErrors: {
        stripe: false
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.paymentId) {
      this.sockets.unsubscribe(this.paymentId)
    }
    next()
  },
  async created () {
    await this.getCommunity()
    if (window.location.hash) {
      this.changeTab(Number(window.location.hash.replace('#tab', '')))
    }
  },
  methods: {
    getCost () {
      return ((this.currentUpload - this.minUpload) * this.costPerMb).toFixed(2)
    },
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
    async createSub () {
      await axios.post(`/community/owner/payments/?community_name=${this.$route.params.communityName}&check_ownership=true`, {amount: this.getCost()}).then(res => {
        this.paymentId = res.data.data.payment_id
        this.paymentStatus = 0

        this.sockets.subscribe(this.paymentId, (data) => {
          if (data.paid) {
            this.paymentStatus = 1
          } else {
            this.paymentStatus = 2
          }
        })
      })
    },
    async deleteCard () {
      await axios.delete(`/community/owner/payments/card/?community_name=${this.$route.params.communityName}&check_ownership=true`)
      this.cardId = null
    },
    async addCard () {
      var invalid = false

      if (!this.$cardFormat.validateCardNumber(this.card.number)) {
        this.cardErrors.cardNumber = 'Invalid Credit Card Number.'
        invalid = true
      }

      if (!this.$cardFormat.validateCardExpiry(this.card.expiry)) {
        this.cardErrors.cardExpiry = 'Invalid Expiration Date.'
        invalid = true
      }

      if (!this.$cardFormat.validateCardCVC(this.card.cvc)) {
        this.cardErrors.cardCvc = 'Invalid CVC.'
        invalid = true
      }

      if (!invalid) {
        var expiry = this.card.expiry.split(' / ')
        var payload = {cvc: this.card.cvc, number: this.card.number.replace(' ', ''), name: this.card.name, exp_month: Number(expiry[0]), exp_year: 20 + Number(expiry[1])}

        await axios.post(`/community/owner/payments/card/?community_name=${this.$route.params.communityName}&check_ownership=true`, payload).catch(_ => {
          this.cardErrors.stripe = true
        }).then(res => {
          this.cardErrors.stripe = false
          this.cardId = res.data.data.card_id
        })
      }
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
    async getPayments () {
      await axios.get(`/community/owner/payments/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.paymentRecords = res.data.data
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
        this.webhooks.matchEnd.value = res.data.data.community.match_end_webhook
        this.webhooks.matchStart.value = res.data.data.community.match_start_webhook
        this.webhooks.roundEnd.value = res.data.data.community.round_end_webhook

        this.apiAccessDisabled = res.data.data.community.allow_api_access
        this.currentUpload = res.data.data.community.max_upload
        this.masterApiKey = res.data.data.community.master_api_key
        this.communityStats = res.data.data.stats
        this.cardId = res.data.data.community.card_id
        this.paymentStatus = res.data.data.community.payment_status
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
