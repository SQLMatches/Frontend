<template lang="html">
  <div>
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
