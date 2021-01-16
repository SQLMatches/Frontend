<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <b-alert v-if="banned" style="margin-top:25px;" variant="warning" show>This community has been banned from SQLMatches.com</b-alert>
            <b-alert v-else-if="disabled" style="margin-top:25px;" variant="warning" show>This community has been disabled by the owner.</b-alert>

            <div class="card bg-dark content-div">
                <div class="card-body">
                    <search-bar v-on:input="getMatches()" v-model="matches.search" :debounce="500"></search-bar>
                    <games :matches="matches"></games>
                    <load-more v-if="!matches.hideLoadMore & !matches.loading" v-on:click="loadMoreMatches"></load-more>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

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
  async beforeRouteUpdate (to, from, next) {
    if (to.name === from.name && to.params !== from.params) {
      await this.loadCommunity(to.params.communityName)
    }

    next()
  },
  data () {
    return {
      banned: false,
      disabled: false
    }
  },
  async created () {
    await this.loadCommunity(this.$route.params.communityName)
  },
  methods: {
    async loadCommunity (communityName) {
      await axios.get(`/community/public/?community_name=${communityName}`).then(async res => {
        this.banned = res.data.data.banned
        this.disabled = res.data.data.disabled

        await this.getMatches()
      }).catch(_ => {
        this.$router.push({name: 'PageNotFound'})
      })
    }
  }
}
</script>
