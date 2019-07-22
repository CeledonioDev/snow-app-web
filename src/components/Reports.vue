<template>
  <div>
    <h2>Reportes</h2>

    <button class="btn btn-primary">Ordenes por mes</button>
    &nbsp;|&nbsp;
    <button class="btn btn-success">Productos mas vendidos</button>

    <div class="twrap">

    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Reports",
  props: {
    company_id: String
  },
  data: function() {
    return {
      company: "makesushibycristino@gmail.com",

      db: firebase.firestore()
    };
  },
  methods: {



  },
  mounted: function() {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.twrap{
  max-height: 300px;
  overflow-y: auto;
}
</style>
