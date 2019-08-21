<template>
  <div>
    <button class="btn btn-primary" @click="openModal()">
      <i class="fa fa-plus"></i>
      Nuevo Usuario
    </button>
    <div class="twrap">
      <table class="table">
        <thead class="thead-dark">
          <th>Nombre Completo</th>
          <th>Teléfono</th>
          <th>Nombre Usuario</th>
        </thead>
        <tbody>
          <tr v-show="info.length === 0">
            <td class="text-center" colspan="3">
              <div class="lds-hourglass"></div>
            </td>
          </tr>
          <tr v-for="i in info" v-bind:key="i.id">
            <td class="text-left">{{ i.name }}</td>
            <td class="text-left">{{ i.tel }}</td>
            <td class="text-left">{{ i.username }}</td>
          </tr>
        </tbody>
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
                            <input type="text" v-model="name" class="form-control" />
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Telefono</label>
                            <input type="text" v-model="tel" class="form-control" />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Nombre Usuario</label>
                            <input type="text" v-model="username" class="form-control" />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <button class="btn btn-sucess" @click="saveUser()">
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
import { async } from "q";

export default {
  name: "Info",
  props: {
    // company_id: String
  },
  data: function() {
    return {
      Users: firebase.auth().currentUser.email,
      info: [],
      db: firebase.firestore(),
      //   storage: firebase.storage().ref("Company"),
      correo: "",
      password: "",
      modalOptions: {
        keyboard: false,
        backdrop: false
      },
      company_id: "",
      name: "",
      tel: "",
      username: "",

      loaders: {
        info: false
      }
    };
  },
  methods: {
    registerauthentication: function(e) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.correo, this.password)
        .then(
          user => {
            alert(`Cuenta Creada por ${user.correo}`);
            cleanUsuerFields();
            // this.$router.push("/");
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    },
    notify: function(msg, color) {
      try {
        //alert(msg);
        this.$toasted.show(msg);
      } catch (e) {
        console.error(e);
        alert(msg);
      }
    },
    saveUser: async function() {
      if (this.name.length < 5) {
        this.notify("El nombre ingresado es muy corto.", "danger");
        return false;
      }
      this.loaders.info = true;
      let data = {
        company_id: this.Users,
        name: this.name,
        tel: this.tel,
        username: this.username
      };

      try {
        const NEW_USER = await this.db
          .collection("Users")
          .doc(this.correo)
          .collection("Info")
          .add(data);

        // this.info.push({
        //     id = this.company_id
        // });

         this.cleanUsuerFields();
        this.notify("Registro de Usuario Completado");
        this.loaders.info = false;
        this.getUsers();
      } catch (e) {
        this.notify("Error del Servidor");
      }
    },
    cleanUsuerFields: function() {
      this.name = "";
      this.tel = "";
      this.username = "";
      this.correo = "";
      this.password = "";
    },
    openModal: function() {
      $("#user-modal").modal(this.modalOptions);
    },
    getUsers: async function() {
     
      const INFO = await this.db
        .collection("Users")
        .doc(this.Users)
        .collection("Info")
        .get();

      INFO.docs.forEach(i => {
        this.info.push({
          id: i.id,
          name: i.data().name,
          tel: i.data().tel,
          username: i.data().username
        });
      });
    },
    mounted: function() {
      this.getUsers();
    },
    closeUserModal: function() {
      this.cleanProductFields();
      this.cleanIngredients();
      $("#user-modal").modal("hide");
    }
  },
  mounted: async function() {
   await this.getUsers();
  }
};
</script>