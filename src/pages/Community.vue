<template>
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <games :matches="matches"></games>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Games from '../components/Games.vue'

import axios from 'axios'

export default {
  name: 'Community',
  components: {
    Games
  },
  data () {
    return {
      matches: []
    }
  },
  async created () {
    await axios.post(`/matches/?community_name=${this.$route.params.communityName}`).then(res => {
      this.matches = res.data.data
    })
  }
}
</script>
