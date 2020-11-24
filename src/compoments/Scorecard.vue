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
      <tbody>
          <tr v-for="(player, index) in team" :key="index">
              <td>{{ player.name }}</td>
              <td>{{ player.kills }}</td>
              <td>{{ player.deaths }}</td>
              <td>{{ player.assists }}</td>
              <td>{{ player.kdr }}</td>
              <td>{{ player.hs_percentage }}%</td>
              <td>{{ player.hit_percentage }}%</td>
              <td>{{ player.mvps }}</td>
              <td>{{ player.score }}</td>
              <td>{{ player.ping }}</td>
          </tr>
      </tbody>
  </table>
</template>

<script>
export default {
  props: [
    'team'
  ]
}
</script>
