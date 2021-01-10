<template>
  <table class="table table-striped table-bordered table-hover table-dark">
      <thead>
          <tr>
              <th class="name-col">Name</th>
              <th>Kills</th>
              <th>Deaths</th>
              <th>Assists</th>
              <th>KDR</th>
              <th>HS %</th>
              <th>Hit %</th>
              <th>MVPs</th>
              <th>Score</th>
              <th>Ping</th>
          </tr>
      </thead>
      <tbody v-if="team.length > 0">
          <tr v-for="(player, index) in team" :key="index" v-on:click="loadSteamPage(player.steam_id)" style="cursor: pointer;">
              <td>{{ player.name }}</td>
              <td>{{ player.kills }}</td>
              <td>{{ player.deaths }}</td>
              <td>{{ player.assists }}</td>

              <td v-if="player.kills > 0 && player.deaths > 0">{{ (player.kills / player.deaths).toFixed(2) }}</td>
              <td v-else>0.0</td>

              <td v-if="player.kills > 0 && player.headshots > 0">{{ ((player.headshots / player.kills).toFixed(2)) * 100 }}%</td>
              <td v-else>0.0</td>

              <td v-if="player.shots_fired > 0 && player.shots_hit > 0">{{ ((player.shots_hit / player.shots_fired).toFixed(2)) * 100 }}%</td>
              <td v-else>0.0</td>

              <td>{{ player.mvps }}</td>
              <td>{{ player.score }}</td>
              <td>{{ player.ping }}</td>
          </tr>
      </tbody>
      <h3 v-else class="text-center">No Players</h3>
  </table>
</template>

<script>
export default {
  props: [
    'team',
    'communityName'
  ],
  methods: {
    loadSteamPage (steamID) {
      this.$router.push({name: 'Profile', params: {'communityName': this.communityName, 'steamID': steamID}})
    }
  }
}
</script>
