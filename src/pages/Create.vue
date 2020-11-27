<template>
  <div>
    <div v-if="communityName === null">
      <div class="card bg-dark content-div">
          <div class="card-body">
              <!-- Start: Steps Progressbar -->
              <div class="steps-progressbar">
                  <ul>
                      <li class="previous">Start</li>
                      <li v-bind:class="{'active':stepCounter === 0, 'previous': stepCounter > 0}" v-on:click="setStepValue(0)" style="cursor: pointer;">Community details</li>
                      <li v-bind:class="{'active':stepCounter === 1, 'previous': stepCounter > 1}" v-on:click="setStepValue(1)" style="cursor: pointer;">Setting up servers</li>
                      <li v-bind:class="{'active':stepCounter === 2, 'previous': stepCounter > 2}" v-on:click="setStepValue(2)" style="cursor: pointer;">Finished</li>
                  </ul>
              </div>
              <!-- End: Steps Progressbar -->
          </div>
      </div>
      <div class="card bg-dark content-div">
          <div class="card-body">
            <div v-if="stepCounter === 0">
              <b-form-input placeholder="Community name"></b-form-input>
            </div>

            <button v-if="stepCounter < 2" v-on:click="stepCounter++" class="btn btn-info btn-block btn-lg" type="button">Next&nbsp;<b-icon icon="chevron-double-right" variant="light"></b-icon></button>
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
      steamID: null
    }
  },
  async created () {
    this.steamID = localStorage.getItem('steamID')

    await axios.get('/community/').then(res => {
      this.communityName = res.data.data.community_name
    })
  },
  methods: {
    setStepValue (value) {
      this.stepCounter = value
    },
    async createCommunity () {
    }
  }
}
</script>
