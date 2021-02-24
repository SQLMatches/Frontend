<template>
  <div>
      <div v-if="players.loading" class="d-flex justify-content-center mb-3">
        <b-spinner variant="light" label="Loading..."></b-spinner>
      </div>
      <div v-else-if="players.list.length > 0" class="row">
          <div class="col-md-3" v-for="(player, index) in players.list" :key="index">
            <router-link :to="{name: 'Profile', params: {'communityName': $route.params.communityName, 'steamID': player.steam_id}}">
              <div class="card light team" v-b-tooltip.hover :title="`Kills: ${player.kills} | Deaths: ${player.deaths} | Assists: ${player.assists}`">
                  <div class="card-body text-center text-light">
                    <h4 class="card-title" style="margin-bottom:0;font-size:1.3em;">
                      {{ player.name }}
                    </h4>
                  </div>
              </div>
            </router-link>
          </div>
      </div>
      <h3 v-else class="text-center text-light">No players found</h3>
  </div>
</template>

<script>
export default {
  props: [
    'players'
  ]
}
</script>
