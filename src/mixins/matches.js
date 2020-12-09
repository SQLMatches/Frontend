import axios from 'axios'

export default {
  data () {
    return {
      matches: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: 3
      }
    }
  },
  methods: {
    async getMatches (pageNumber, addToCurrent = false) {
      var payload = {}

      if (this.matches.search) {
        payload['search'] = this.matches.search
      }

      if (pageNumber) {
        payload['page'] = pageNumber
      }

      var path
      if ('communityName' in this.$route.params) {
        path = `/matches/?community_name=${this.$route.params.communityName}`
        this.newPerPage = 5
      } else {
        path = '/communities/matches/'
      }

      await axios.post(path, payload).then(res => {
        if (!addToCurrent) {
          this.matches.list = res.data.data
        } else {
          this.matches.list = this.matches.list.concat(res.data.data)
        }
      })
    },
    async loadMoreMatches (pageNumber) {
      var oldMatchLen = this.matches.list.length
      await this.getMatches(pageNumber, true)
      if (oldMatchLen === this.matches.list.length ||
          this.matches.list.length - oldMatchLen < this.matches.newPerPage) {
        this.matches.hideLoadMore = true
      }
    }
  }
}
