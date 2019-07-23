<template>
  <div id="app">
    
    <Login v-if="!authenticated" v-on:logged="authenticated=true"/>
    
    <Navbar v-if="authenticated" />

  </div>
</template>

<script>

import Login from './components/Login.vue'
import Navbar from './components/Navbar.vue'

require("@/assets/css/bootstrap.min.css");
require("@/assets/css/style.css");
require("@/assets/css/paper-dashboard.css");

export default {
  name: "App",
  components: {
    Login,
    Navbar
  },
  data: function(){
    return {
      authenticated: false
    }
  },
};


</script>