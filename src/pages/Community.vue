<template>
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <search-bar v-on:input="getMatches()" v-model="matches.search" :debounce="500"></search-bar>
                  <games :matches="matches.list"></games>
                  <load-more v-if="!matches.hideLoadMore" v-on:click="loadMoreMatches"></load-more>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Games from '../components/Games.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

import matches from '../mixins/matches.js'

export default {
  name: 'Community',
  mixins: [
    matches
  ],
  components: {
    Games,
    SearchBar,
    LoadMore
  },
  async created () {
    await this.getMatches()
  }
}
</script>
