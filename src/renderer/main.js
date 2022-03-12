import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import { mavonEditor } from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'

// import 'element-theme-ink/dist/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
// Vue.component('editor-page', mavonEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h) => h(App),
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
