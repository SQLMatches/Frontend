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
        hideLoadMore: false,
        newPerPage: 10
      },
      matches: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: 3
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

        if (this.matches.newPerPage > this.matches.list.length) {
          this.matches.hideLoadMore = true
        }

        if (this.communities.newPerPage > this.communities.list.length) {
          this.communities.hideLoadMore = true
        }
      })
    },
    async getCommunities (addToCurrent = false, pageNumber) {
      var payload = {}

      if (this.communities.search) {
        payload['search'] = this.communities.search
      }

      if (pageNumber) {
        payload['page'] = pageNumber
      }

      await axios.post('/communities/', payload).then(res => {
        if (!addToCurrent) {
          this.communities.list = res.data.data
        } else {
          this.communities.list = this.communities.list.concat(res.data.data)
        }
      })
    },
    async getMatches (addToCurrent = false, pageNumber) {
      var payload = {}

      if (this.matches.search) {
        payload['search'] = this.matches.search
      }

      if (pageNumber) {
        payload['page'] = pageNumber
      }

      await axios.post('/communities/matches/', payload).then(res => {
        if (!addToCurrent) {
          this.matches.list = res.data.data
        } else {
          this.matches.list = this.matches.list.concat(res.data.data)
        }
      })
    },
    async loadMoreMatches (pageNumber) {
      var oldMatchLen = this.matches.list.length
      await this.getMatches(true, pageNumber)
      if (oldMatchLen === this.matches.list.length || this.matches.list.length - oldMatchLen < this.matches.newPerPage) {
        this.matches.hideLoadMore = true
      }
    },
    async loadMoreCommunities (pageNumber) {
      var oldCommunitiesLen = this.communities.list.length
      await this.getCommunities(true, pageNumber)
      if (oldCommunitiesLen === this.communities.list.length || this.communities.list.length - oldCommunitiesLen < this.communities.newPerPage) {
        this.communities.hideLoadMore = true
      }
    }
  }
}
</script>
