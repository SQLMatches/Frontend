import axios from 'axios'

export default {
  data () {
    return {
      communities: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: 8,
        wsEnabled: true,
        loading: true,
        page: 1
      }
    }
  },
  mounted () {
    if (this.communities.wsEnabled) {
      this.sockets.subscribe('community_updates', (data) => {
        if (!this.communities.search) {
          var currentCommunities = this.communities.list.map(c => c.community_name)

          if (!currentCommunities.includes(data.community_name)) {
            this.communities.list.unshift(data)
          }
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.communities.wsEnabled) {
      this.sockets.unsubscribe('community_updates')
    }
    next()
  },
  methods: {
    async getCommunities (pageNumber, addToCurrent = false) {
      this.communities.loading = true

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
          this.communities.list = this.communities.list.concat(res.data.data)
        }

        this.communities.loading = false

        return res
      })
    },
    async loadMoreCommunities () {
      var oldCommunitiesLen = this.communities.list.length
      await this.getCommunities(this.communities.page += 1, true)
      if (oldCommunitiesLen === this.communities.list.length || this.communities.newPerPage > this.communities.list.length - oldCommunitiesLen) {
        console.log('hide load more equals false')
        this.communities.hideLoadMore = true
      }
    }
  }
}
