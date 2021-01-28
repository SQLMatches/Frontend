<template>
  <div>
    <div v-if="servers.loading" class="d-flex justify-content-center mb-3">
      <b-spinner variant="light" label="Loading..."></b-spinner>
    </div>
    <div v-else>
      <b-row cols="4" v-if="servers.list.length > 0">
        <b-col v-for="(server, index) in servers.list" :key="index">
          <b-card :title="server.name" :img-src="server.cover_image" img-top style="max-width: 20rem;" class="mb-2 bg-dark text-light">
            <b-card-text>
              Map: <span v-if="server.map">{{ server.map }}</span><span v-else>Unknown</span>
              <br>
              Players: {{ server.players }}
              <br>
              Max players: {{ server.max_players }}
            </b-card-text>

            <div style="margin-top:10px;">
              <b-button v-if="!ownerPanel" :href="`steam://connect/${server.ip}:${server.port}`" size="sm" block variant="primary">Connect</b-button>
              <b-button v-else v-on:click="$emit('click', server.ip, server.port)" size="sm" block variant="danger">Delete</b-button>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <h3 v-else class="text-center text-light">No servers found</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Servers',
  props: {
    'servers': {
      type: Object
    },
    'ownerPanel': {
      default: false,
      type: Boolean
    }
  }
}
</script>
