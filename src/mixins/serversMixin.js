import axios from 'axios'

export default {
  data () {
    return {
      servers: {
        list: [],
        form: {
          ip: null,
          port: 27015,
          name: null
        },
        loading: true,
        serverAlreadyAdded: false
      }
    }
  },
  mounted () {
    this.sockets.subscribe(this.$route.params.communityName, (data) => {
      if (data.state === 'delete') {
        this.deleteServerLocal(data.ip, data.port)
      } else if (data.state === 'add') {
        this.servers.list.push(data.data)
      } else {
        for (let index = 0; index < this.servers.list.length; index++) {
          if (this.servers.list[index].ip === data.ip && this.servers.list[index].port === data.port) {
            this.$set(this.servers.list, index, Object.assign({}, this.servers.list[index], data.data))
            break
          }
        }
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    this.sockets.unsubscribe(this.$route.params.communityName)
    next()
  },
  methods: {
    deleteServerLocal (ip, port) {
      for (let index = 0; index < this.servers.list.length; index++) {
        if (this.servers.list[index].ip === ip && this.servers.list[index].port === port) {
          this.servers.list.splice(index, 1)
          break
        }
      }
    },
    async getServers () {
      this.servers.loading = true

      await axios.get(`/servers/?community_name=${this.$route.params.communityName}`).then(res => {
        this.servers.list = res.data.data
        this.servers.loading = false
      })
    },
    async addServer () {
      this.servers.serverAlreadyAdded = false

      await axios.post(`/servers/?community_name=${this.$route.params.communityName}&check_ownership=true`, this.servers.form).catch(_ => {
        this.servers.serverAlreadyAdded = true
      })
    },
    async deleteServer (ip, port) {
      await axios.delete(`/server/${ip}/${port}/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        this.deleteServerLocal(ip, port)
      })
    }
  }
}
