import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import router from './router.js'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Vuetify, {
    theme: {
        primary: "#2196F3",
        secondary: "#FF80AB",
        accent: "#FF80AB",
        error: "#f44336",
        warning: "#ffeb3b",
        info: "#2196f3",
        success: "#4caf50"
    },
    iconfont: 'mdi'
});

let store = new Vuex.Store({
    state: {
          token: null,
          username: null,
          key: "fQR#&VC#tr"
    },
    mutations: {
      setToken (state, token) {
          // storage token
          state.token = token
      },
      setName (state, name) {
        state.name = name
      },
      clear (state) {
          state.token = null;
          state.name = null;
      }
    },
    getters: {
        token: state => {
            return state.token
        }
    }
});

new Vue({
  store,
  router: router,
  render: h => h(App),
}).$mount('#app');
