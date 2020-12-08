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
                    <search-bar v-on:input="getMatches()" v-model="matches.search" :debounce="500"></search-bar>
                    <games :matches="matches.list"></games>
                    <load-more v-if="matches.list.length > 0 && !matches.hideLoadMore" v-model="matches.pageNumber" v-on:click="loadMoreMatches"></load-more>
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

import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Communities,
    Games,
    SearchBar,
    LoadMore
  },
  data () {
    return {
      communities: {
        list: [],
        search: null,
        hideLoadMore: false
      },
      matches: {
        list: [],
        pageNumber: null,
        search: null,
        hideLoadMore: false
      }
    }
  },
  async created () {
    await this.getHomeContents()
  },
  methods: {
    async getHomeContents () {
      await axios.get('/communities/all/').then(res => {
        this.communities.list = res.data.data.communities
        this.matches.list = res.data.data.matches
      })
    },
    async getCommunities () {
      await axios.post('/communities/', {search: this.communities.search}).then(res => {
        this.communities.list = res.data.data
      })
    },
    async getMatches (addToCurrent = false) {
      var payload = {}

      if (this.matches.search) {
        payload['search'] = this.matches.search
      }

      if (this.matches.pageNumber) {
        payload['page'] = this.matches.pageNumber
      }

      await axios.post('/communities/matches/', payload).then(res => {
        if (!addToCurrent) {
          this.matches.list = res.data.data
        } else {
          this.matches.list.concat(res.data.data)
        }
      })
    },
    async loadMoreMatches () {
      var oldMatchLen = this.matches.list.length
      await this.getMatches(true)
      if (oldMatchLen === this.matches.list.length || this.matches.list.length - oldMatchLen < 5) {
        this.matches.hideLoadMore = true
      }
    }
  }
}
</script>
