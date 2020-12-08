<template>
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <search-bar v-on:input="getMatches()" v-model="matches.search" :debounce="500"></search-bar>
                  <games :matches="matches.list"></games>
                  <load-more v-if="!matches.hideLoadMore" v-model="matches.pageNumber" v-on:click="loadMoreMatches"></load-more>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Games from '../components/Games.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

import axios from 'axios'

export default {
  name: 'Community',
  components: {
    Games,
    SearchBar,
    LoadMore
  },
  data () {
    return {
      matches: {
        list: [],
        pageNumber: null,
        search: null,
        hideLoadMore: false,
        newPerPage: 10
      }
    }
  },
  async created () {
    await this.getMatches()
  },
  methods: {
    async getMatches (addToCurrent = false) {
      var payload = {}

      if (this.matches.search) {
        payload['search'] = this.matches.search
      }

      if (this.matches.pageNumber) {
        payload['page'] = this.matches.pageNumber
      }

      await axios.post(`/matches/?community_name=${this.$route.params.communityName}`, payload).then(res => {
        if (!addToCurrent) {
          this.matches.list = res.data.data
        } else {
          this.matches.list.concat(res.data.data)
        }

        if (this.matches.newPerPage > this.matches.list.length) {
          this.matches.hideLoadMore = true
        }
      })
    },
    async loadMoreMatches () {
      var oldMatchLen = this.matches.list.length
      await this.getMatches(true)
      if (oldMatchLen === this.matches.list.length || this.matches.list.length - oldMatchLen < this.matches.newPerPage) {
        this.matches.hideLoadMore = true
      }
    }
  }
}
</script>
