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
        serverAlreadyAdded: false
      }
    }
  },
  methods: {
    async getServers () {
      await axios.get(`/servers/?community_name=${this.$route.params.communityName}`).then(res => {
        this.servers.list = res.data.data
      })
    },
    async addServer () {
      this.serverAlreadyAdded = false

      await axios.post(`/servers/?community_name=${this.$route.params.communityName}&check_ownership=true`, this.servers.form).then(res => {
        this.servers.list.push(res.data.data)
      }).catch(_ => {
        this.serverAlreadyAdded = true
      })
    }
  }
}
