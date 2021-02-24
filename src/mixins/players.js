import axios from 'axios'

export default {
  data () {
    return {
      players: {
        list: [],
        search: null,
        hideLoadMore: false,
        newPerPage: 8,
        loading: true,
        page: 1
      }
    }
  },
  methods: {
    async getPlayers (pageNumber, addToCurrent = false) {
      this.players.loading = true

      var payload = {}
      if (this.players.search) {
        payload['search'] = this.players.search
      }

      if (pageNumber) {
        payload['page'] = pageNumber
      }

      await axios.post(`/players/?community_name=${this.$route.params.communityName}`, payload).then(res => {
        if (!addToCurrent) {
          this.players.list = res.data.data
        } else {
          this.players.list = this.players.list.concat(res.data.data)
        }

        console.log(this.players.list)
      })

      if (this.players.list.length < this.players.newPerPage) {
        this.players.hideLoadMore = true
      } else {
        this.players.hideLoadMore = false
      }

      this.players.loading = false
    },
    async loadMorePlayers () {
      var oldPlayerLen = this.players.list.length
      await this.getPlayers(this.players.page += 1, true)
      if (oldPlayerLen === this.players.list.length || this.players.newPerPage > this.players.list.length - oldPlayerLen) {
        this.players.hideLoadMore = true
      }
    }
  }
}
