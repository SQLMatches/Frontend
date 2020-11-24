<template lang="html">
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <h3 class="text-light card-title">Communities</h3>

                  <searchBar></searchBar>

                  <div class="row">
                      <div class="col-md-3" v-for="(community, index) in communities" :key="index">
                          <div class="card light team">
                              <div class="card-body text-center">
                                <img class="img-thumbnail team-pfp" src="@/assets/img/ahahha.png">
                                  <h4 class="text-light card-title">{{ community.community_name }}</h4>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

import SearchBar from './SearchBar.vue'

export default {
  name: 'Communities',
  data () {
    return {
      communities: []
    }
  },
  methods: {
    getCommunities (search = '', page = 1, desc = true) {
      axios.post('/communities/', {'search': search, 'page': page, 'desc': desc}).then(res => {
        this.communities = res.data.data
      }).catch(_ => {
        this.$router.push({name: 'Login'})
      })
    }
  },
  created () {
    this.getCommunities()
  },
  components: {
    SearchBar
  }
}
</script>
