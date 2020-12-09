import axios from 'axios'

export default {
  data () {
    return {
      communities: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: 10
      }
    }
  },
  methods: {
    async getCommunities (addToCurrent = false, pageNumber) {
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
      })
    },
    async loadMoreCommunities (pageNumber) {
      var oldCommunitiesLen = this.communities.list.length
      await this.getCommunities(true, pageNumber)
      if (oldCommunitiesLen === this.communities.list.length ||
          this.communities.list.length - oldCommunitiesLen < this.communities.newPerPage) {
        this.communities.hideLoadMore = true
      }
    }
  }
}
