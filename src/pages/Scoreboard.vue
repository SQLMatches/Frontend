<template>
    <div class="row">
        <div v-if="loading" class="col-md-12 d-flex justify-content-center mb-3" style="margin-top:25px;">
          <h3 class="text-light">Loading...</h3>
          <b-spinner variant="light" label="Loading..."></b-spinner>
        </div>
        <div v-else class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h2 class="text-center text-light">Team {{ scoreboard.team_1_name }}</h2>
                    <div class="table-responsive table-borderless">
                      <scorecard :team="scoreboard.team_1" :communityName="$route.params.communityName"></scorecard>
                    </div>
                </div>
            </div>
            <div class="text-center" style="margin-bottom: 20px;margin-top: 20px;">
                <h1 class="text-light">{{ scoreboard.team_1_score }}:{{ scoreboard.team_2_score }}</h1>
                <button v-if="scoreboard.demo_status == 0" class="btn btn-danger btn-sm" type="button" style="margin-top: 8px;" disabled>
                  &nbsp;No download&nbsp;<b-icon icon="exclamation-diamond" variant="light"></b-icon>
                </button>
                <button v-else-if="scoreboard.demo_status == 1" class="btn btn-alrt btn-sm" type="button" style="margin-top: 8px;" disabled>
                  &nbsp;Processing Demo&nbsp;<b-icon icon="emoji-expressionless-fill" variant="light"></b-icon>
                </button>
                 <router-link v-else-if="scoreboard.demo_status == 2" :to="{name: 'DemoDownload', params: {matchID: scoreboard.match_id}}">
                  <button class="btn btn-primary btn-sm" type="button" style="margin-top: 8px;">
                    &nbsp;Download&nbsp;<b-icon icon="arrow-down-short" variant="light"></b-icon>
                  </button>
                </router-link>
                <button v-else-if="scoreboard.demo_status == 4" class="btn btn-dark btn-sm" type="button" style="margin-top: 8px;" disabled>
                  &nbsp;Demo expired&nbsp;<b-icon icon="emoji-expressionless-fill" variant="light"></b-icon>
                </button>
                <button v-else class="btn btn-dark btn-sm" type="button" style="margin-top: 8px;" disabled>
                  &nbsp;Demo too large&nbsp;<b-icon icon="credit-card-fill" variant="light"></b-icon>
                </button>
            </div>
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h2 class="text-center text-light">Team {{ scoreboard.team_2_name }}</h2>
                    <div class="table-responsive table-borderless">
                      <scorecard :team="scoreboard.team_2" :communityName="$route.params.communityName"></scorecard>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Scorecard from '../components/Scorecard.vue'

export default {
  name: 'Scoreboard',
  components: {
    Scorecard
  },
  data () {
    return {
      scoreboard: {},
      wsConnection: null,
      loading: true
    }
  },
  async created () {
    await this.getScoreboard(this.$route.params.matchID, this.$route.params.communityName)

    this.sockets.subscribe(this.$route.params.matchID, (data) => {
      this.scoreboard = data
    })
  },
  beforeRouteLeave (to, from, next) {
    this.sockets.unsubscribe(this.$route.params.matchID)
    next()
  },
  methods: {
    async getScoreboard (matchID, communityName) {
      this.loading = true

      await axios.get(`/match/${matchID}/?community_name=${communityName}`).then(res => {
        this.scoreboard = res.data.data
      }).catch(_ => {
        this.$router.push({name: 'PageNotFound'})
      })

      this.loading = false
    }
  }
}
</script>
