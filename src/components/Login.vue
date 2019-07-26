<template>
  <div id="bg">

    <div class="login-page">
      <div class="form">
        <div class="text-center">
          <img src="../assets/logo.png" alt="SnowEats Logo">
        </div>
        <form class="register-form">
          <input type="text" placeholder="name"/>
          <input type="password" placeholder="password"/>
          <input type="text" placeholder="email address"/>
          <button>create</button>
          <p class="message">Already registered? <a href="#">Sign In</a></p>
        </form>
        <form class="login-form">
          <input v-model="username" type="text" placeholder="Cuenta de usuario" />
          <input v-model="password" type="password" placeholder="Clave" />
          <button 
          :disabled="inRequest"
          @click.prevent="makeLogin()" 
          class="btn btn-info btn-block login">
            {{ inRequest ? 'Espere' : 'Entrar' }}
          </button>
        <br>
        <span v-show="error.length > 0">
          {{ error }}
        </span>
        </form>
      </div>
    </div>


  </div>
</template>

<script>
import firebase from "firebase";
import router from '../router.js'

export default {
  name: "Login",
  props: {
    //company_id: String
  },
  data: function() {
    return {
      username: "",
      password: "",
      db: firebase.firestore(),
      inRequest: false,
      error: ''
    };
  },
  methods: {
    makeLogin: function() {
      if(this.username == '' || this.password == ''){
        return false;
      }
      this.inRequest = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then(user => {
          this.error = '';
          this.checkModulesConfiguration();
        })
        .catch(e => {
          this.error = e.message;
          console.error("Login ERR > ", e);
        })
        .then(() => {
          this.inRequest = false;
        });
    },

    checkModulesConfiguration: async function(){
      let currentUser = firebase.auth().currentUser.email;
      if(!currentUser){
        return false;
      }
      //console.log('currentUser > ',currentUser);
      const USER_MODULES = await this.getModulesConfig(currentUser);
      if(!USER_MODULES){
        console.error('Error al obtener modulos del usuario >> ',e);
        alert('ERR #2');
        return false;
      }

      //console.log('USER_MODULES >> ',USER_MODULES);
      this.$emit('logged', USER_MODULES);
      router.push('/orders');
    },

    getModulesConfig: async function(user){
      let data = [];
      const LIST = await this
                    .db.collection('Company')
                    .doc(user)
                    .get();

      let tempModules = LIST.data().ModuleConfiguration;

      const NAMES = await this
                    .db.collection('Modules')
                    .get();

      NAMES.docs.forEach(m => {
        if(tempModules.indexOf(m.id) !== -1){
          data.push(m.data().name);
        }
      });

      return data;
    },


  },

  mounted: function(){
    firebase.auth().signOut();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

img{
  height: 130px;
  width: auto;
  margin-bottom: 40px;
}

#bg{
  background-image: url('../assets/bg.jpg');
  height: -webkit-fill-available;
}

.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  max-width: 360px;
  margin: 0 auto 40px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.form button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #4CAF50;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.form button:hover,.form button:active,.form button:focus {
  background: #43A047;
}
.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: #4CAF50;
  text-decoration: none;
}
.form .register-form {
  display: none;
}
.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin: 0 auto;
}
.container:before, .container:after {
  content: "";
  display: block;
  clear: both;
}
.container .info {
  margin: 50px auto;
  text-align: center;
}
.container .info h1 {
  margin: 0 0 15px;
  padding: 0;
  font-size: 36px;
  font-weight: 300;
  color: #1a1a1a;
}
.container .info span {
  color: #4d4d4d;
  font-size: 12px;
}
.container .info span a {
  color: #000000;
  text-decoration: none;
}
.container .info span .fa {
  color: #EF3B3A;
}
body {
  background: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(right, #76b852, #8DC26F);
  background: -moz-linear-gradient(right, #76b852, #8DC26F);
  background: -o-linear-gradient(right, #76b852, #8DC26F);
  background: linear-gradient(to left, #76b852, #8DC26F);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;      
}
</style>
