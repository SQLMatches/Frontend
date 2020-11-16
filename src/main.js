// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Axios from 'axios'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/bootstrap.min.css'
import './assets/css/styles.css'

import App from './App'
import router from './router'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.prototype.$http = Axios
Axios.defaults.baseURL = 'http://127.0.0.1:8000'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
