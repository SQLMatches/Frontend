<template>
  <div>
    <div class="card text-light bg-dark content-div">
        <div class="card-header">
            <b-tabs fill>
                <b-tab title="Communities" active v-on:click="changeTab(0)"></b-tab>
                <b-tab title="Matches" v-on:click="changeTab(1)"></b-tab>
                <b-tab title="Version Messages" v-on:click="changeTab(2); getVersions()"></b-tab>
            </b-tabs>
        </div>
        <div class="card-body">
          <div v-if="tabNumber === 0">
            <search-bar v-on:input="getCommunities()" v-model="communities.search" :debounce="500"></search-bar>
            <div style="margin-bottom: 25px">
              <div v-if="communities.list.length > 0" class="row">
                  <div class="col-md-3" v-for="(community, index) in communities.list" :key="index" v-on:click="toggleBan(community.community_name)">
                    <div class="card light team" v-bind:class="{'selected-to-delete': communitiesToBan.includes(community.community_name)}">
                        <div class="card-body text-center">
                          <h4 class="text-light card-title" style="margin-bottom:0;">{{ community.community_name }}</h4>
                        </div>
                    </div>
                  </div>
              </div>
              <h3 v-else class="text-center text-light">No communities found</h3>
            </div>

            <b-button variant="danger" v-if="communitiesToBan.length > 0" block v-on:click="banCommunities()">Ban selected <span v-if="communitiesToBan.length > 1">communities</span><span v-else>community</span></b-button>
            <b-button variant="danger" v-else block disabled>Ban selected community</b-button>
          </div>
          <div v-else-if="tabNumber === 1"></div>
          <div v-else>
            <b-form inline class="d-flex justify-content-center mb-3">
              <b-form-input v-model="form.major" placeholder="Major" type="number" autocomplete="off"></b-form-input>
              <b-input-group prepend="·">
                <b-form-input v-model="form.minor" placeholder="Minor" type="number" autocomplete="off"></b-form-input>
              </b-input-group>
              <b-input-group prepend="·">
                <b-form-input v-model="form.patch" placeholder="Patch" type="number" autocomplete="off"></b-form-input>
              </b-input-group>
            </b-form>
            <b-form-textarea v-model="form.message" :state="form.message.length <= 64 && form.message.length >= 6" placeholder="Version message"></b-form-textarea>
            <div style="margin:25px 0;">
              <b-button v-if="form.message.length <= 64 && form.message.length >= 6 && form.major && form.minor && form.patch" v-on:click="saveVersionMessage()" variant="info" block>Save</b-button>
              <b-button v-else variant="info" disabled block>Save</b-button>
            </div>

            <h3>Version messages</h3>
            <div v-if="versions.length > 0" class="accordion" role="tablist">
              <b-card no-body class="mb-1" v-for="(version, index) in versions" :key="index">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle="`accordion-${index}`" variant="info">Version {{ version.version }}</b-button>
                </b-card-header>
                <b-collapse :id="`accordion-${index}`" accordion="version-accordion" role="tabpanel">
                  <b-card-body class="toast-header">
                    <b-card-text>{{ version.message }}</b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
            <h4 class="text-center" v-else>No version messages</h4>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import communities from '../mixins/communities.js'

import SearchBar from '../components/SearchBar.vue'
import LoadMore from '../components/LoadMore.vue'

export default {
  name: 'Admin',
  mixins: [
    communities
  ],
  components: {
    SearchBar,
    LoadMore
  },
  data () {
    return {
      tabNumber: 0,
      communitiesToBan: [],
      versions: [],
      form: {
        message: '',
        major: null,
        minor: null,
        patch: null
      }
    }
  },
  async created () {
    await this.getCommunities()

    await axios.get('/admin/?check_root=true').catch(_ => {
      this.$router.push({name: 'PageNotFound'})
    })
  },
  methods: {
    changeTab (tab) {
      this.tabNumber = tab
    },
    toggleBan (communityName) {
      if (this.communitiesToBan.includes(communityName)) {
        this.communitiesToBan.splice(this.communitiesToBan.indexOf(communityName), 1)
      } else {
        this.communitiesToBan.push(communityName)
      }
    },
    async banCommunities () {
      await axios.delete('/admin/communities/?check_root=true', {data: {communities: this.communitiesToBan}}).then(async _ => {
        this.communitiesToBan = []
        await this.getCommunities()
      })
    },
    async getVersions () {
      await axios.get('/version/').then(res => {
        this.versions = res.data.data
      })
    },
    async saveVersionMessage () {
      await axios.post('/admin/?check_root=true', this.form).then(res => {
        var formattedVersion = `${this.form.major}.${this.form.minor}.${this.form.patch}`
        var updating = false

        for (let index = 0; index < this.versions.length; index++) {
          if (this.versions[index].version === formattedVersion) {
            updating = true
            this.versions[index].message = this.form.message
            break
          }
        }

        if (!updating) {
          this.versions.unshift({
            message: this.form.message,
            version: formattedVersion
          })
        }

        this.form.message = ''
        this.form.major = null
        this.form.minor = null
        this.form.patch = null
      })
    }
  }
}
</script>
