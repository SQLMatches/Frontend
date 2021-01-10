<template>
  <div>
    <div class="card text-light bg-dark content-div">
        <div class="card-header">
            <b-tabs fill>
                <b-tab title="Communities" active v-on:click="changeTab(0)"></b-tab>
                <b-tab title="Matches" v-on:click="changeTab(1)"></b-tab>
                <b-tab title="Version Messages" v-on:click="changeTab(2)"></b-tab>
            </b-tabs>
        </div>
        <div class="card-body">
          <div v-if="tabNumber === 0">
            <search-bar v-on:input="getCommunities()" v-model="communities.search" :debounce="500"></search-bar>
            <div style="margin-bottom: 25px">
              <div v-if="communities.list.length > 0" class="row">
                  <div class="col-md-3" v-for="(community, index) in communities.list" :key="index" v-on:click="toggleBan(community.community_name)">
                    <div class="card light team" v-bind:class="{'selected-to-delete': communitiesToBan.includes(community.community_name)}">
                        <div class="card-body text-center">
                          <h4 class="text-light card-title" style="margin-bottom:0;">{{ community.community_name }}</h4>
                        </div>
                    </div>
                  </div>
              </div>
              <h3 v-else class="text-center text-light">No communities found</h3>
            </div>

            <b-button variant="danger" v-if="communitiesToBan.length > 0" block v-on:click="deleteCommunities()">Delete selected <span v-if="communitiesToBan.length > 1">communities</span><span v-else>community</span></b-button>
            <b-button variant="danger" v-else block disabled>Delete selected community</b-button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import communities from '../mixins/communities.js'

import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

export default {
  name: 'SiteOwner',
  mixins: [
    communities
  ],
  components: {
    SearchBar,
    LoadMore
  },
  data () {
    return {
      tabNumber: 0,
      communitiesToBan: []
    }
  },
  async created () {
    await this.getCommunities()
  },
  methods: {
    changeTab (tab) {
      this.tabNumber = tab
    },
    toggleBan (communityName) {
      if (this.communitiesToBan.includes(communityName)) {
        this.communitiesToBan.splice(this.communitiesToBan.indexOf(communityName), 1)
      } else {
        this.communitiesToBan.push(communityName)
      }
    },
    async deleteCommunities () {}
  }
}
</script>
