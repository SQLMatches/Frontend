<template>
  <ul class="list-unstyled matches">
      <li v-for="(match, index) in matches" :key="index">
          <div class="card match" v-b-tooltip.hover :title="`${match.timestamp} - ${match.map}`">
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
</template>

<script>
import axios from 'axios'

export default {
  name: 'Games',
  data () {
    return {
      matches: []
    }
  },
  methods: {
    getMatches (url = '/communities/matches/', search = '', page = 1, desc = true) {
      axios.post(url, {'search': search, 'page': page, 'desc': desc}).then(res => {
        this.matches = res.data.data
      }).catch(_ => {
        this.$router.push({name: 'Login'})
      })
    }
  },
  created () {
    this.getMatches()
  }
}
</script>
