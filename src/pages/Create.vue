<template>
  <div>
    <div v-if="communityName === null">
      <div class="card bg-dark content-div">
          <div class="card-body">
              <!-- Start: Steps Progressbar -->
              <div class="steps-progressbar">
                  <ul>
                      <li class="previous" v-on:click="setStepValue(0)" style="cursor: pointer;">Start</li>
                      <li v-bind:class="{'active':stepCounter === 0, 'previous': stepCounter > 0}" v-on:click="setStepValue(0)" style="cursor: pointer;">Details</li>
                      <li v-bind:class="{'active':stepCounter === 1, 'previous': stepCounter > 1}" v-on:click="setStepValue(1)" style="cursor: pointer;">Finished</li>
                  </ul>
              </div>
              <!-- End: Steps Progressbar -->
          </div>
      </div>
      <div class="card bg-dark content-div">
          <div class="card-body text-light create-community">
            <div v-if="stepCounter === 0">
              <b-form-group label="Community Name" label-for="community-name">
                <b-form-input id="community-name" v-model="form.community_name" v-on:input="validateCommmunityNameDebounce()" :state="communityNameState && !nameTaken" autocomplete="off" placeholder="E.g. NexusLeague" required></b-form-input>
                <p v-if="communityNameState === false">No special characters (@! etc.). No spaces. 4 - 32 characters.</p>
                <p v-else-if="nameTaken">'{{ form.community_name }}' is taken, please use a different name.</p>
              </b-form-group>

              <b-form-group label="Email" label-for="community-email">
                <b-form-input id="community-email" v-model="form.email" v-on:input="validateEmail()" :state="emailState" autocomplete="off" placeholder="E.g. hi@wardpearce.com" required></b-form-input>
              </b-form-group>

              <b-form-group label="I'm using this for" label-for="usage-question" style="margin-top:20px">
                <b-form-radio name="usage-question" value="personal" v-model="form.community_type">Personal servers</b-form-radio>
                <b-form-radio name="usage-question" value="community" v-model="form.community_type">Community servers</b-form-radio>
                <b-form-radio name="usage-question" value="team" v-model="form.community_type">Team servers</b-form-radio>
                <b-form-radio name="usage-question" value="organization" v-model="form.community_type">Organization servers</b-form-radio>
              </b-form-group>

              <b-form-checkbox v-model="tosStatus" :value="true">
                <a href="/tos" class="text-light" target="_blank" rel="noopener noreferrer">I accept the terms and use</a>
              </b-form-checkbox>
            </div>

            <div v-else-if="stepCounter === 1" class="card" style="background-color:#22212c;margin-bottom:25px;">
                <div class="card-body text-light create-community">
                  <h4>Community Name</h4>
                  <p>{{ form.community_name }}</p>

                  <h4 style="margin-top:15px;">Community Type</h4>
                  <p style="text-transform:capitalize;">{{ form.community_type }}</p>

                  <h4 style="margin-top:15px;">Email</h4>
                  <p style="text-transform:capitalize;">{{ form.email }}</p>
                </div>
            </div>

            <button v-if="stepCounter < 1 && requiredEntered()" v-on:click="stepCounter++" class="btn btn-info btn-block btn-lg" type="button">Next&nbsp;<b-icon icon="chevron-double-right" variant="light"></b-icon></button>
            <button v-else-if="!requiredEntered()" class="btn btn-info btn-block btn-lg" type="button" disabled>Next&nbsp;<b-icon icon="chevron-double-right" variant="light"></b-icon></button>
            <button v-else class="btn btn-info btn-block btn-lg" type="button" v-on:click="createCommunity()">Create community&nbsp;<b-icon icon="hand-thumbs-up" variant="light"></b-icon></button>
          </div>
      </div>
    </div>
    <div v-else-if="banned" class="card bg-dark content-div">
        <div class="card-body text-center text-light">
          <h4>You have been banned from SQLMatches.com</h4>
          <h5>You can no longer make new communities.</h5>
        </div>
    </div>
    <div v-else class="card bg-dark content-div">
        <div class="card-body text-center text-light">
          <h4>Sorry you currently can only own one community.</h4>
          <h5>Please delete / disable your community before trying to make a new one!</h5>

          <router-link class="text-light" :to="{name: 'CommunityPage', params: {'communityName': communityName}}">Go back to {{ communityName }}!</router-link>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

import email from '../mixins/email.js'

export default {
  name: 'Create',
  mixins: [
    email
  ],
  data () {
    return {
      communityName: null,
      banned: false,
      stepCounter: 0,
      communityNameRegExp: new RegExp('^[a-zA-Z0-9]{4,32}$'),
      communityNameState: null,
      tosStatus: false,
      nameTaken: false,
      form: {
        community_name: null,
        community_type: null,
        email: null
      }
    }
  },
  async created () {
    this.validateCommmunityNameDebounce = _.debounce(this.validateCommmunityName, 500)

    await axios.get('/community/').then(res => {
      this.communityName = res.data.data.community_name
      this.banned = res.data.data.banned
    })
  },
  methods: {
    requiredEntered () {
      return this.tosStatus && this.communityNameState && this.emailState && !this.nameTaken
    },
    setStepValue (value) {
      if (this.requiredEntered()) {
        this.stepCounter = value
      }
    },
    async validateCommmunityName () {
      this.communityNameState = this.communityNameRegExp.test(this.form.community_name)

      if (this.communityNameState) {
        await axios.get(`/community/exists/?community_name=${this.form.community_name}`).then(res => {
          this.nameTaken = res.data.data.taken
        })
      }
    },
    async createCommunity () {
      await axios.post('/community/', this.form).then(res => {
        window.location.href = `/c/${res.data.data.community_name}/owner#tab2`
      })
    }
  }
}
</script>
