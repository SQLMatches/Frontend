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
  methods: {
    async getServers () {
      this.servers.loading = true

      await axios.get(`/servers/?community_name=${this.$route.params.communityName}`).then(res => {
        this.servers.list = res.data.data
        this.servers.loading = false
      })
    },
    async addServer () {
      this.servers.serverAlreadyAdded = false

      await axios.post(`/servers/?community_name=${this.$route.params.communityName}&check_ownership=true`, this.servers.form).then(res => {
        this.servers.list.push(res.data.data)
      }).catch(_ => {
        this.servers.serverAlreadyAdded = true
      })
    },
    async deleteServer (ip, port) {
      await axios.delete(`/server/${ip}/${port}/?community_name=${this.$route.params.communityName}&check_ownership=true`).then(res => {
        for (let index = 0; index < this.servers.list.length; index++) {
          const element = this.servers.list[index]

          if (element.ip === ip && element.port === port) {
            this.servers.list.splice(index, 1)
            break
          }
        }
      })
    }
  }
}
