import axios from 'axios'

import settings from '../settings.js'

export default {
  data () {
    return {
      communities: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: 10,
        wsConnection: null,
        wsEnabled: true
      }
    }
  },
  mounted () {
    if (this.communities.wsEnabled) {
      this.communities.wsConnection = new WebSocket(`${settings.wsURI}/communities/`)
      this.communities.wsConnection.onmessage = (event) => {
        if (!this.communities.search) {
          var newCommunities = JSON.parse(event.data).data
          var currentCommunities = this.communities.list.map(c => c.community_name)

          for (let index = 0; index < newCommunities.length; index++) {
            if (!currentCommunities.includes(newCommunities[index].community_name)) {
              this.communities.list = newCommunities[index].concat(this.communities.list)
            }
          }
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.communities.wsEnabled) {
      this.communities.wsConnection.close()
    }
    next()
  },
  methods: {
    async getCommunities (pageNumber, addToCurrent = false) {
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
          this.communities.list = res.data.data.concat(this.communities.list)
        }
      })
    },
    async loadMoreCommunities (pageNumber) {
      var oldCommunitiesLen = this.communities.list.length
      await this.getCommunities(pageNumber, true)
      if (oldCommunitiesLen === this.communities.list.length ||
          this.communities.list.length - oldCommunitiesLen < this.communities.newPerPage) {
        this.communities.hideLoadMore = true
      }
    }
  }
}
