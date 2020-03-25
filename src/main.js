import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(VueLodash, { lodash: lodash })


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
