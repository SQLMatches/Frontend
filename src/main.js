import Vue from 'vue'
import Axios from 'axios'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/bootstrap.min.css'
import './assets/css/styles.css'

import App from './App'
import router from './router'

import settings from './settings.js'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.prototype.$http = Axios
Axios.defaults.baseURL = settings.apiURl
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
