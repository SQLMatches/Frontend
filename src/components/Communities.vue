<template lang="html">
  <div>
    <div v-if="communities.loading" class="d-flex justify-content-center mb-3">
      <b-spinner variant="light" label="Loading..."></b-spinner>
    </div>
    <div v-else-if="communities.list.length > 0" class="row">
        <div class="col-md-3" v-for="(community, index) in communities.list" :key="index">
          <router-link :to="{name: 'CommunityPage', params: {'communityName': community.community_name}}">
            <div class="card light team">
                <div class="card-body text-center">
                  <h4 class="text-light card-title" style="margin-bottom:0;font-size:1em;">{{ community.community_name }}</h4>
                </div>
            </div>
          </router-link>
        </div>
    </div>
    <h3 v-else class="text-center text-light">No communities found</h3>
  </div>
</template>

<script>
export default {
  props: [
    'communities'
  ]
}
</script>
