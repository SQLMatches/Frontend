import axios from 'axios'

export default {
  data () {
    return {
      matches: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: 10,
        wsEnabled: true,
        loading: true,
        page: 1
      }
    }
  },
  mounted () {
    if (this.matches.wsEnabled) {
      this.sockets.subscribe('match_update', (data) => {
        if (!this.matches.search) {
          var currentMatches = this.matches.list.map(m => m.match_id)

          if (!('communityName' in this.$route.params) ||
          data.community_name === this.$route.params.communityName) {
            if (!currentMatches.includes(data.match_id)) {
              this.matches.list.unshift(data)
            } else {
              for (let index = 0; index < this.matches.list.length; index++) {
                if (this.matches.list[index].match_id === data.match_id) {
                  this.$set(this.matches.list, index, data)
                  break
                }
              }
            }
          }
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.matches.wsEnabled) {
      this.sockets.unsubscribe('match_update')
    }
    next()
  },
  methods: {
    async getMatches (pageNumber, addToCurrent = false) {
      this.matches.loading = true

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
        this.matches.newPerPage = 10
      } else {
        path = '/communities/matches/'
        this.matches.newPerPage = 3
      }

      await axios.post(path, payload).then(res => {
        if (!addToCurrent) {
          this.matches.list = res.data.data
        } else {
          this.matches.list = this.matches.list.concat(res.data.data)
        }
      })

      if (this.matches.list.length < this.matches.newPerPage) {
        this.matches.hideLoadMore = true
      } else {
        this.matches.hideLoadMore = false
      }

      this.matches.loading = false
    },
    async loadMoreMatches () {
      var oldMatchLen = this.matches.list.length
      await this.getMatches(this.matches.page += 1, true)
      if (oldMatchLen === this.matches.list.length || this.matches.newPerPage > this.matches.list.length - oldMatchLen) {
        this.matches.hideLoadMore = true
      }
    }
  }
}
