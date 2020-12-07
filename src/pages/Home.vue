<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">How it works</h3>

                    <video autoplay loop style="width: 100%">
                      <source src="@/assets/videos/CreateCommunity.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">Recent Matches</h3>
                    <search-bar v-on:input="getMatches" v-model="matchesSearch" :debounce="500"></search-bar>
                    <games :matches="matches"></games>
                </div>
            </div>
        </div>
    </div>
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <h3 class="text-light card-title">Communities</h3>
                  <search-bar v-on:input="getCommunities" v-model="communitySearch" :debounce="500"></search-bar>
                  <communities :communities="communities"></communities>
              </div>
          </div>
      </div>
  </div>
  </div>
</template>

<script>
import Communities from '../components/Communities.vue'
import Games from '../components/Games.vue'
import SearchBar from '../components/SearchBar.vue'

import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Communities,
    Games,
    SearchBar
  },
  data () {
    return {
      communities: [],
      matches: [],
      communitySearch: null,
      matchesSearch: null
    }
  },
  async created () {
    await this.getHomeContents()
  },
  methods: {
    async getHomeContents () {
      await axios.get('/communities/all/').then(res => {
        this.communities = res.data.data.communities
        this.matches = res.data.data.matches
      })
    },
    async getCommunities () {
      await axios.post('/communities/', {search: this.communitySearch}).then(res => {
        this.communities = res.data.data
      })
    },
    async getMatches () {
      await axios.post('/communities/matches', {search: this.matchesSearch}).then(res => {
        this.matches = res.data.data
      })
    }
  }
}
</script>
