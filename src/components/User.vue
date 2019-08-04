<template>
  <div>
    <button class="btn btn-primary" @click="openModal()">
      <i class="fa fa-plus"></i>
      Nuevo Usuario
    </button>
    <div class="twrap">
      <table class="table">
        <thead class="thead-dark">
          <th>Correo</th>
          <th>Nombre Completo</th>
          <th>Telefono</th>
          <th>Nombre Usuario</th>
        </thead>
      </table>
    </div>
    <!-- Inicio Modal -->
    <div
      class="modal fade"
      id="user-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="roduct-modal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registro de Usuarios</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="card card-user">
              <div class="card-body">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      id="home-tab"
                      data-toggle="tab"
                      href="#tab-credenciales"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >Autentificar Usuario</a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="usuario-tab"
                      data-toggle="tab"
                      href="#tab-register-user"
                      role="tab"
                      aria-controls="user"
                      aria-selected="false"
                    >Completar Registro Usuario</a>
                  </li>
                </ul>
                <br />
                <form>
                  <div class="tab-content" id="myTabContent">
                    <div
                      class="tab-pane fade show active"
                      id="tab-credenciales"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Correo Electronio</label>
                            <input type="text" v-model="correo" class="form-control" />
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Password</label>
                            <input type="password" v-model="password" class="form-control" />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="form-group">
                          <button class="btn btn-sucess" v-on:click="registerauthentication">
                            <i class="fa fa-save"></i>
                            Autentificar Usuario
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="tab-register-user"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" v-model="nombre" class="form-control" />
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Telefono</label>
                            <input type="text" v-model="telefono" class="form-control" />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Nombre Usuario</label>
                            <input type="text" v-model="nomUsuario" class="form-control" />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <button class="btn btn-sucess">
                              <i class="fa fa-save"></i>
                              Guardar Registro
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Final Modal -->
  </div>
</template>
<script>
import firebase from "firebase";

export default {
  name: "user",
  data: function() {
    return {
      correo : '',
      password: '',
      modalOptions: {
        keyboard: false,
        backdrop: false
      }
    };
  },
  methods: {
   
   registerauthentication: function(e){
       firebase.auth().createUserWithEmailAndPassword(this.correo,this.password)
       .then(user =>{
           alert(`Cuenta Creada por ${user.correo}`);
           this.$router.push('/');
       },
       err=>{
           alert(err.message);
       })
       e.preventDefault();
   },
    openModal: function() {
      $("#user-modal").modal(this.modalOptions);
    },

    closeUserModal: function() {
      this.cleanProductFields();
      this.cleanIngredients();
      $("#user-modal").modal("hide");
    }
  }
};
</script>