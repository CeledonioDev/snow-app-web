<template>
  <div id="app">
    <div id="nav" class="sidebar" data-color="white" data-active-color="danger">
      <!--Tip 1: You can change the color of the sidebar using: data-color="blue | green | orange | red | yellow"-->
      <div class="logo">
        <a href class="simple-text logo-mini">
          <div class="logo-image-small">
            <img src="./assets/logo.png" />
          </div>
        </a>

        <a href class="simple-text logo-normal">
          Usuario 1
          <!-- <div class="logo-image-big">
					<img src="../assets/img/logo-big.png">
          </div>-->
        </a>
      </div>

      <div class="sidebar-wrapper">
        <ul class="nav">
          <li :class="$route.name=='home'?'active':''">
            <router-link to="/">
              <i class="nc-icon nc-bank"></i>
              <p>Panel de control</p>
            </router-link>
          </li>
          <li :class="$route.name=='companies'?'active':''">
            <router-link to="/companies">
              <i class="nc-icon nc-shop"></i>
              <p>Afiliados</p>
            </router-link>
          </li>
          <li :class="$route.name=='about'?'active':''">
            <router-link to="/about">
              <i class="nc-icon nc-shop"></i>
              <p>Ordenes</p>
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
						<a class="navbar-brand" href="#pablo">SnowEats</a>
					</div>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation"
						aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-bar navbar-kebab"></span>
						<span class="navbar-toggler-bar navbar-kebab"></span>
						<span class="navbar-toggler-bar navbar-kebab"></span>
					</button>
					<div class="collapse navbar-collapse justify-content-end" id="navigation">

						<ul class="navbar-nav">
							<li class="nav-item btn-rotate dropdown">
								<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
									data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<i class="nc-icon nc-bell-55"></i>
									<p>
										<span class="d-lg-none d-md-block">Herramientas</span>
									</p>
								</a>
								<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
									<a class="dropdown-item" href="#">Notificaciones</a>
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
                <vue-page-transition name="fade" style="top: 200px;">
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
 
require('@/assets/css/bootstrap.min.css')
require('@/assets/css/style.css')
require('@/assets/css/paper-dashboard.css')

</script>