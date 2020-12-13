import axios from 'axios'

export default {
  data () {
    return {
      matches: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: null,
        wsEnabled: true
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
          console.log(res.data.data)
          this.matches.list = res.data.data.concat(this.matches.list)
        }
      })

      if (this.matches.list.length < this.matches.newPerPage) {
        this.matches.hideLoadMore = true
      } else {
        this.matches.hideLoadMore = false
      }
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
