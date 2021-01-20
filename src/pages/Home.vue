<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body text-light">
                    <h3 class="card-title">SQLMatches 0.2.0</h3>
                    <p>SQLMatches allows you to create communities to easily record demos & to view scoreboards in real-time. Including a per community profile system, caching, live updating, moderation tools & more!</p>

                    <h4 style="margin-top:25px;">Increasing max upload</h4>
                    <p>Are you wanting to upload 64 / 128 tick demos or maybe just longer demos? Check out the 'Subscriptions / Billing' tab on the Owner Panel.</p>
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
                    <games :matches="matches"></games>
                    <load-more v-if="!matches.hideLoadMore & !matches.loading" v-on:click="loadMoreMatches"></load-more>
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
                  <communities :communities="communities"></communities>
                  <load-more v-if="!communities.hideLoadMore & !communities.loading" v-on:click="loadMoreCommunities"></load-more>
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
      this.matches.loading = true
      this.communities.loading = true

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

      this.matches.loading = false
      this.communities.loading = false
    }
  }
}
</script>
