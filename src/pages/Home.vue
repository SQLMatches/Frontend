<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">SQLMatches 0.1.0</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">Recent Matches</h3>
                    <search-bar v-on:input="getMatches()" v-model="matches.search" :debounce="500"></search-bar>
                    <games :matches="matches.list"></games>
                    <load-more v-if="!matches.hideLoadMore" v-on:click="loadMoreMatches"></load-more>
                </div>
            </div>
        </div>
    </div>
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <h3 class="text-light card-title">Communities</h3>
                  <search-bar v-on:input="getCommunities()" v-model="communities.search" :debounce="500"></search-bar>
                  <communities :communities="communities.list"></communities>
                  <load-more v-if="!communities.hideLoadMore" v-on:click="loadMoreCommunities"></load-more>
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
import LoadMore from '../components/LoadMore.vue'

import matches from '../mixins/matches.js'
import communities from '../mixins/communities.js'

import axios from 'axios'

export default {
  name: 'Home',
  mixins: [
    matches,
    communities
  ],
  components: {
    Communities,
    Games,
    SearchBar,
    LoadMore
  },
  async created () {
    await this.getHomeContents()
  },
  methods: {
    async getHomeContents () {
      await axios.get('/communities/all/').then(res => {
        this.communities.list = res.data.data.communities
        this.matches.list = res.data.data.matches

        if (this.matches.list.length < 3 || this.matches.list.length === 0) {
          this.matches.hideLoadMore = true
        }

        if (this.communities.list.length < 10 || this.communities.list.length === 0) {
          this.communities.hideLoadMore = true
        }
      })
    }
  }
}
</script>
