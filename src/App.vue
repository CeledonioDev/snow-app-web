<template>
  <div id="app">
    
    <Login v-if="!authenticated" v-on:logged="catchLogin($event)"/>
    
    <Navbar v-if="appReady" :userModules="modules"/>

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
      authenticated: false,
      appReady: false,
      modules: []
    }
  },

  methods:{
    catchLogin: function(userModules){
      //console.log('catchLogin >> ',userModules);
      this.authenticated = true;
      this.modules = userModules;
      this.appReady = true;
    }
  },

  watch: {
    authenticated: function(){

    }
  }
};


</script>