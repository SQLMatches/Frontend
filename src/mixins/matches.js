import axios from 'axios'

import settings from '../settings.js'

export default {
  data () {
    return {
      matches: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: null,
        wsConnection: null
      }
    }
  },
  created () {
    if ('communityName' in this.$route.params) {
      this.matches.wsConnection = new WebSocket(`${settings.wsURI}/matches/?community_name=${this.$route.params.communityName}`)
    } else {
      this.matches.wsConnection = new WebSocket(`${settings.wsURI}/communities/matches/`)
    }

    this.matches.wsConnection.onmessage = (event) => {
      if (!this.matches.search) {
        var newMatches = JSON.parse(event.data).data
        var currentMatches = this.matches.list.map(m => m.match_id)

        for (let index = 0; index < newMatches.length; index++) {
          if (!currentMatches.includes(newMatches[index].match_id)) {
            this.matches.list = newMatches[index].concat(this.matches.list)
          } else {
            for (let innerIndex = 0; innerIndex < this.matches.list.length; innerIndex++) {
              if (this.matches.list[innerIndex].match_id === newMatches[index].match_id) {
                this.$set(this.matches.list, innerIndex, newMatches[index])
                break
              }
            }
          }
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.matches.wsConnection.close()
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
        this.matches.newPerPage = 5
      } else {
        path = '/communities/matches/'
        this.matches.newPerPage = 3
      }

      await axios.post(path, payload).then(res => {
        if (!addToCurrent) {
          this.matches.list = res.data.data
        } else {
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
