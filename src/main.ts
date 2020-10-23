import './assets/css/bootstrap.min.css'
import './assets/css/styles.css'
import './assets/fonts/line-awesome.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
