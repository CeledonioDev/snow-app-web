<template>
  <div>
    <h2>Aqui se cargaran las ordenes</h2>
    <div class="twrap">
      <table class="table">
        <thead class="text-primary">
          <th>Fecha</th>
          <th>Estado</th>
          <th>Mesa</th>
          <th>Total</th>
          <!-- <th>Descripcion</th> -->
        </thead>
        <tbody>
          <tr v-show="orders.length === 0">
            <td class="text-center" colspan="3">
              <div class="lds-hourglass"></div>
            </td>
          </tr>

          <tr v-for="o in orders" v-bind:key="o.id">
            <td>{{ o.date }}</td>
            <td class="text-center">{{ o.status }}</td>
            <td class="text-center">{{ o.table }}</td>
            <td class="text-center">{{ o.total }}</td>
            <!-- <td class="text-center">{{ o.description }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Orders",
  props: {
    company_id: String
  },
  data: function() {
    return {
      company: "makesushibycristino@gmail.com",
      orders: [],
      db: firebase.firestore()
    };
  },
  methods: {
    getCompanyOrders: async function() {
      const ORDERS = await this.db
        .collection("Company")
        .doc(this.company)
        .collection("Orders")
        .get();

      ORDERS.docs.forEach(o => {
        this.orders.push({
          id: o.id,
          date: this.formatDate(o.data().date),
          status: o.data().status,
          table: o.data().table,
          total: o.data().total,
        });
      });
    },

    formatDate: function(d){
      return typeof d.to_show === 'undefined'
            ? new Date(d).toLocaleDateString()
            : d.to_show;
    }
  },
  mounted: function() {
    this.getCompanyOrders();
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
