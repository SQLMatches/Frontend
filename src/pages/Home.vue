<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body text-light">
                    <h4>Subscribe to SQLMatches for only $2.50 a month!</h4>
                    <p>Subscriptions can be made under the 'Owner Panel' inside the 'Subscriptions / Billing' tab</p>

                    <h5 style="margin-top:5px;">Current features</h5>
                    <ul>
                      <li>100 MB Max upload</li>
                    </ul>

                    <h5 style="margin-top:5px;">Planned features</h5>
                    <ul>
                      <li>Discord bot</li>
                      <li>Custom team logos</li>
                      <li>Owning multiple communities</li>
                      <li>Custom domain</li>
                      <li>Match management</li>
                      <li>Administration tools</li>
                    </ul>

                    <h4 style="margin-top:25px">Make a donation</h4>
                    <form action="https://www.paypal.com/donate" method="post" target="_top">
                      <input type="hidden" name="hosted_button_id" value="ZGS5RJ9FC94GQ" />
                      <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                      <img alt="" border="0" src="https://www.paypal.com/en_NZ/i/scr/pixel.gif" width="1" height="1" />
                    </form>
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
                    <games :matches="matches"></games>
                    <load-more v-if="!matches.hideLoadMore && !matches.loading" v-on:click="loadMoreMatches()"></load-more>
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
                  <communities :communities="communities"></communities>
                  <load-more v-if="!communities.hideLoadMore && !communities.loading" v-on:click="loadMoreCommunities()"></load-more>
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

import matches from '../mixins/matches.js'
import communities from '../mixins/communities.js'

import axios from 'axios'

export default {
  name: 'Home',
  mixins: [
    matches,
    communities
  ],
  components: {
    Communities,
    Games,
    SearchBar,
    LoadMore
  },
  async created () {
    this.matches.newPerPage = 3
    this.communities.newPerPage = 8

    await this.getHomeContents()
  },
  methods: {
    async getHomeContents () {
      this.matches.loading = true
      this.communities.loading = true

      await axios.get('/communities/all/').then(res => {
        this.communities.list = res.data.data.communities
        this.matches.list = res.data.data.matches
      })

      this.matches.loading = false
      this.communities.loading = false
    }
  }
}
</script>
