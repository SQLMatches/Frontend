<template>
  <div>
    <ul v-if="matches.length > 0" class="list-unstyled matches">
        <li v-for="(match, index) in matches" :key="index">
            <router-link :to="{name: 'Scoreboard', params: {matchID: match.match_id, communityName: match.community_name}}">
              <div class="card match" :id="match.match_id" v-b-tooltip.hover :title="`${match.timestamp} - ${match.map}`">
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

              <b-tooltip v-if="match.status === 1" variant="success" :show.sync="giveTrue" :target="match.match_id" placement="left">
                <strong>Live Now!</strong>
              </b-tooltip>
            </router-link>
        </li>
    </ul>
    <h3 v-else class="text-center text-light">No matches found</h3>
  </div>
</template>

<script>
export default {
  props: [
    'matches'
  ],
  data () {
    return {
      giveTrue: true
    }
  }
}
</script>
