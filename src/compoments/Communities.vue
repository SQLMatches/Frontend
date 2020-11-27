<template lang="html">
  <div class="row">
      <div class="col-md-12">
          <div class="card bg-dark content-div">
              <div class="card-body">
                  <h3 class="text-light card-title">Communities</h3>

                  <searchBar></searchBar>

                  <div v-if="communities.length > 0" class="row">
                      <div class="col-md-3" v-for="(community, index) in communities" :key="index">
                        <router-link :to="{name: 'CommunityPage', params: {'communityName': community.community_name}}">
                          <div class="card light team">
                              <div class="card-body text-center">
                                <img class="img-thumbnail team-pfp" src="@/assets/img/ahahha.png">
                                  <h4 class="text-light card-title">{{ community.community_name }}</h4>
                              </div>
                          </div>
                        </router-link>
                      </div>
                  </div>
                  <h3 v-else class="text-center text-light">No communities</h3>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import SearchBar from './SearchBar.vue'

export default {
  name: 'Communities',
  props: [
    'communities'
  ],
  components: {
    SearchBar
  }
}
</script>
