<template>
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <search-bar v-on:input="getMatches" v-model="matchesSearch" :debounce="500"></search-bar>
                  <games :matches="matches"></games>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Games from '../components/Games.vue'
import SearchBar from '../components/SearchBar.vue'

import axios from 'axios'

export default {
  name: 'Community',
  components: {
    Games,
    SearchBar
  },
  data () {
    return {
      matches: [],
      matchesSearch: null
    }
  },
  async created () {
    await this.getMatches()
  },
  methods: {
    async getMatches () {
      var payload
      if (this.matchesSearch) {
        payload = {search: this.matchesSearch}
      } else {
        payload = null
      }

      await axios.post(`/matches/?community_name=${this.$route.params.communityName}`, payload).then(res => {
        this.matches = res.data.data
      })
    }
  }
}
</script>
