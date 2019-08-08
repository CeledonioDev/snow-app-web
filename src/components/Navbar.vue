<template>
  <div class="">
      <div id="nav" class="sidebar" data-color="white" data-active-color="danger">
        <!--Tip 1: You can change the color of the sidebar using: data-color="blue | green | orange | red | yellow"-->
        <div class="logo">
          <a href="#" class="simple-text logo-mini">
            <div class="logo-image-small">
              <img src="../assets/logo.png" />
            </div>
          </a>

          <span class="simple-text logo-normal" :title="user">
            {{ user }}
          </span>
          <span class="badge badge-primary">PLAN INICIAL</span>
        </div>

        <div class="sidebar-wrapper">
          <ul class="nav">
            <li v-if="userModules.indexOf('Orders') !== -1"  
              :class="$route.name=='orders'?'active':''">
              <router-link to="/orders">
                <i class="fa fa-shopping-cart"></i>
                <p>Ordenes</p>
              </router-link>
            </li>
            <li v-if="userModules.indexOf('Products') !== -1"  
              :class="$route.name=='products'?'active':''">
              <router-link to="/products">
                <i class="fa fa-cutlery"></i>
                <p>Productos</p>
              </router-link>
            </li>
            <li v-if="userModules.indexOf('Reports') !== -1" 
              :class="$route.name=='reports'?'active':''">
              <router-link to="/reports">
                <i class="fa fa-line-chart"></i>
                <p>Reportes</p>
              </router-link>
            </li>
            <li :class="$route.name=='user'?'active':''">
              <router-link to="/user">
                <i class="fa fa-user"></i>
                <p>Usuarios</p>
              </router-link>
            </li>   
            <li v-if="userModules.indexOf('Inventory') !== -1"
              :class="$route.name=='inventory'?'active':''">
              <router-link to="/inventory">
                <i class="fa fa-building"></i>
                <p>Inventario</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="main-panel">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
          <div class="container-fluid">
            <div class="navbar-wrapper">
              <div class="navbar-toggle">
                <button type="button" class="navbar-toggler">
                  <span class="navbar-toggler-bar bar1"></span>
                  <span class="navbar-toggler-bar bar2"></span>
                  <span class="navbar-toggler-bar bar3"></span>
                </button>
              </div>
              <a class="navbar-brand" href="#pablo">
                {{ getTodayDate() }}
                <b>
                  {{ time }}
                </b>
              </a>
            </div>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navigation"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-bar navbar-kebab"></span>
              <span class="navbar-toggler-bar navbar-kebab"></span>
              <span class="navbar-toggler-bar navbar-kebab"></span>
            </button>
			
			
			<div class="collapse navbar-collapse justify-content-end" id="navigation">

				<ul class="navbar-nav">

					<li class="nav-item btn-rotate dropdown">

						<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
							data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<i class="fa fa-user"></i>
							
						</a>
						<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
							<a class="dropdown-item" href="#"><i class="fa fa-bell"></i>&nbsp;Notificaciones</a>
							<a class="dropdown-item" href="#"><i class="fa fa-cog"></i>&nbsp;Configuraciones</a>
              <a @click="logout()" class="dropdown-item" href="#"><i class="fa fa-sign-out"></i>&nbsp;Salir</a>
						</div>
					</li>

				</ul>
				
			</div>
			
			
          </div>
        </nav>
        <!-- End Navbar -->

        <div class="content">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-body">
                  <vue-page-transition name="fade" style>
                    <router-view />
                  </vue-page-transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    
  </div>
</template>

<script>
import firebase from 'firebase'
import router from '../router.js'

export default {
  name: 'Navbar',
  props: {
    userModules: Array
  },
  data:function(){
    return {
      user: 'USUARIO 1',
      time: '00:00'
    }
  },

  beforeMount: function(){
    setInterval(() => {
      this.time = this.$helpers.getTime();  
    }, 1000);
  },

  methods: {
    
    getTodayDate: function(){
      const d = new Date();
      let day = d.getUTCDate();
      let month = d.getUTCMonth()+1;
      return this.$helpers.getDayName(d.getDay())+' '+day+' de '+ this.$helpers.getMonthName(month);
    },

    logout: function(){
      firebase.auth().signOut();
      window.location.assign('login')
    }

  },

  mounted: function() {
    let user = firebase.auth().currentUser;
    if(user){
      this.user = user.email.split('@')[0];
    }
  }
  
}
</script>

