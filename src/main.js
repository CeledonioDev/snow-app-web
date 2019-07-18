import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import VuePageTransition from 'vue-page-transition'
import firebase from 'firebase'

const config	= {
  apiKey: "AIzaSyBpJI22AFwHsFL0QeEo1DE3TuexAxTnVxs",
  authDomain: "nieveseats.firebaseapp.com",
  databaseURL: "https://nieveseats.firebaseio.com",
  projectId: "nieveseats",
  storageBucket: "nieveseats.appspot.com",
  messagingSenderId: "187728069073",
  appId: "1:187728069073:web:c24b2e47c6c785fd"
}
firebase.initializeApp(config);

Vue.use(VuePageTransition);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
