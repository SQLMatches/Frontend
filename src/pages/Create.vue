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
                      <li v-bind:class="{'active':stepCounter === 1, 'previous': stepCounter > 1}" v-on:click="setStepValue(1)" style="cursor: pointer;">Upload size</li>
                      <li v-bind:class="{'active':stepCounter === 2, 'previous': stepCounter > 2}" v-on:click="setStepValue(2)" style="cursor: pointer;">Finished</li>
                  </ul>
              </div>
              <!-- End: Steps Progressbar -->
          </div>
      </div>
      <div class="card bg-dark content-div">
          <div class="card-body text-light create-community">
            <div v-if="stepCounter === 0">
              <b-form-group label="Community Name" label-for="community-name">
                <b-form-input id="community-name" v-model="form.communityName" v-on:input="validateCommmunityName()" :state="communityNameState" placeholder="E.g. NexusLeague" required></b-form-input>
                <p v-if="communityNameState === false">No special characters (@! etc.). No spaces. 4 - 32 characters.</p>
              </b-form-group>

              <b-form-group label="Logo" label-for="community-pfp">
                <b-form-file id="community-pfp" plain></b-form-file>
              </b-form-group>

              <b-form-group label="I'm using this for" label-for="usage-question" style="margin-top:20px">
                <b-form-radio name="usage-question" value="personal" v-model="form.usage">Personal servers</b-form-radio>
                <b-form-radio name="usage-question" value="community" v-model="form.usage">Community servers</b-form-radio>
                <b-form-radio name="usage-question" value="team" v-model="form.usage">Team servers</b-form-radio>
                <b-form-radio name="usage-question" value="organization" v-model="form.usage">Organization servers</b-form-radio>
              </b-form-group>

              <b-form-checkbox v-model="form.tosStatus" :value="true">
                I accept the terms and use
              </b-form-checkbox>
            </div>

            <div v-else-if="stepCounter === 1">
              <label for="cost">Max upload size</label>
              <b-form-input type="range" name="cost" :min="minUpload" :max="maxUpload" v-model="form.uploadSize"></b-form-input>
              <div>Max upload size: {{ form.uploadSize }} MB</div>
              <div>Cost per month: {{ ((form.uploadSize - minUpload) * costPerMb).toFixed(2) }} USD</div>
              <div class="mt-2">SQLMatches compresses demos, {{ minUpload }} MB should be more then enough for a 10 slot, 16 to 32 tick demo.</div>
            </div>

            <button v-if="stepCounter < 2 && form.tosStatus && communityNameState" style="margin-top:25px;" v-on:click="stepCounter++" class="btn btn-info btn-block btn-lg" type="button">Next&nbsp;<b-icon icon="chevron-double-right" variant="light"></b-icon></button>
            <button v-else-if="!form.tosStatus || !communityNameState" class="btn btn-info btn-block btn-lg" type="button" disabled>Next&nbsp;<b-icon icon="chevron-double-right" variant="light"></b-icon></button>
            <button v-else class="btn btn-info btn-block btn-lg" type="button">Create community&nbsp;<b-icon icon="hand-thumbs-up" variant="light"></b-icon></button>
          </div>
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

export default {
  name: 'Create',
  data () {
    return {
      communityName: null,
      stepCounter: 0,
      costPerMb: 0.15,
      minUpload: 50,
      maxUpload: 150,
      communityNameRegExp: new RegExp('^[a-zA-Z0-9]{4,32}$'),
      communityNameState: null,
      form: {
        communityName: '',
        usage: '',
        uploadSize: 50,
        tosStatus: false
      }
    }
  },
  async created () {
    await axios.get('/community/').then(res => {
      this.communityName = res.data.data.community_name
    })
  },
  methods: {
    setStepValue (value) {
      if (this.form.tosStatus && this.communityNameState) {
        this.stepCounter = value
      }
    },
    validateCommmunityName () {
      if (this.communityNameRegExp.test(this.form.communityName)) {
        this.communityNameState = true
      } else {
        this.communityNameState = false
      }
    },
    async createCommunity () {
    }
  }
}
</script>
