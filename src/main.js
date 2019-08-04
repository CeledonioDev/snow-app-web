import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import VuePageTransition from 'vue-page-transition'
import firebase from 'firebase'
import firebaseConfig from './firebaseConfig.js'
import Toasted from 'vue-toasted';
import Helpers from './helpers.js';
import VueNativeNotification from 'vue-native-notification'
import swal from 'sweetalert';

Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})

const plugin = {
  install () {
      Vue.prototype.$helpers = Helpers
  }
}

Vue.use(plugin);

Vue.use(Toasted, {
  duration: 3000
})

firebase.initializeApp(firebaseConfig);

Vue.use(VuePageTransition);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
