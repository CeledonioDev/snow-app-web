<template>
  <div>
    <h2>Aqui se cargaran las ordenes</h2>
    <div class="twrap">
      <table class="table">
        <thead class="text-primary">
          <th>Fecha</th>
          <th class="text-center">Estado</th>
          <th class="text-center">Mesa</th>
          <th class="text-center">Total</th>
          <th class="text-center">Detalles</th>
        </thead>
        <tbody>
          <tr v-show="orders.length === 0">
            <td class="text-center" colspan="3">
              <div class="lds-hourglass"></div>
            </td>
          </tr>

          <tr v-for="o in orders" v-bind:key="o.id">
            <td>{{ o.date }}</td>
            <td>{{ o.status }}</td>
            <td>{{ o.table }}</td>
            <td>{{ o.total }}</td>
            <td>
              <button class="btn btn-primary" @click="openModal()">
                <i class="fa fa-plus"></i>
                Detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Inicio Modal -->
    <div
      class="modal fade"
      id="ListOrder-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="roduct-modal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Ordenes</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="card card-user">
              <div class="card-body">
                <div class="twrap">
                  <table class="table">
                    <thead class="text-primary">
                      <th>Service</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Descuento</th>
                    </thead>
                    <tbody>
                     <tr v-show="orders.length === 0">
                    <td class="text-center" colspan="3">
                      <div class="lds-hourglass"></div>
                    </td>
                      </tr>

                      <tr v-for="o in orders" v-bind:key="o.id">
                      <td>{{JSON.parse(o.service).service }}</td>
                      <td>{{JSON.parse(o.service).price }}</td>
                      <td>{{JSON.parse(o.service).quantity }}</td>
                      <td>{{JSON.parse(o.service).desc }}</td>
                      
                     </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin Modal -->
  </div>
</template>

<script>
import firebase from "firebase";
import Navbar from "@/components/Navbar";

export default {
  name: "Orders",
  components: {
    Navbar
  },
  props: {
    company_id: String
  },
  data: function() {
    return {
      company: firebase.auth().currentUser.email,
      orders: [],
      db: firebase.firestore(),
      modalOptions: {
        keyboard: false,
        backdrop: false
      }
    };
  },
  methods: {
    getOrders: async function() {
      const ORDERS = await this.db
        .collection("Company")
        .doc(this.company)
        .collection("Orders")
        .get();

      ORDERS.docs.forEach(o => {
        this.orders.push({
          id: o.id,
          date: this.formatDate(o.data().date),
          status: o.data().sttableatus,
          table: o.data().table,
          total: o.data().total,
          service: o.data().service
        });
      });
    },
    openModal: function() {
      $("#ListOrder-modal").modal(this.modalOptions);
    },
    formatDate: function(d) {
      return typeof d.to_show === "undefined"
        ? new Date(d).toLocaleString()
        : d.to_show;
    }
  },
  mounted: function() {
    this.getOrders();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.twrap {
  max-height: 300px;
  overflow-y: auto;
}
</style>
