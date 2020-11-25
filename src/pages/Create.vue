<template>
  <div>
    <div v-if="communityName === null">
      <div class="card bg-dark content-div">
          <div class="card-body">
              <!-- Start: Steps Progressbar -->
              <div class="steps-progressbar">
                  <ul>
                      <li class="previous">Start</li>
                      <li class="active">Community details</li>
                      <li>Setting up servers</li>
                      <li>Finished</li>
                  </ul>
              </div>
              <!-- End: Steps Progressbar -->
          </div>
      </div>
      <div class="card bg-dark content-div">
          <div class="card-body">
              <form></form><button class="btn btn-info btn-block btn-lg" type="button">NEXT&nbsp;<i class="la la-chevron-right"></i></button></div>
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
      communityName: null
    }
  },
  created () {
    axios.get('/community/').then(res => {
      this.communityName = res.data.data.community_name
      console.log(this.communityName)
    })
  }
}
</script>
