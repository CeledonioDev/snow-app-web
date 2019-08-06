<template>
  <div>    
    <div class="row">
      <div class="col-8"><h4>Ordenes de hoy</h4></div>
      <div class="col-4 text-right">
        <label class="switch" title="Ocultar completadas">          
          <input type="checkbox" v-model="hideCompleted">
          <span class="slider"></span>
        </label>        
      </div>
    </div>
    <div class="twrap">
      <table class="table">
        <thead class="text-primary">
          <th>Fecha</th>
          <th class="text-center">Descripcion</th>
          <th class="text-center">Mesa</th>
          <th class="text-center">Total</th>
          <th class="text-center">Completada</th>
        </thead>
        <tbody>
          <tr v-show="orders.length === 0">
            <td class="text-center" colspan="3">
              <div class="lds-hourglass"></div>
            </td>
          </tr>

          <tr v-for="o in orders" 
            v-bind:key="o.id" 
            :class="o.status == 1 ? 'flashit' : ''"
            v-show="!(hideCompleted && o.status != 1)">

            <td>{{ o.date }}</td>
            <td class="text-center" v-html="o.service"></td>
            <td class="text-center"><i class="badge badge-success big-f">{{ o.table }}</i></td>
            <td class="text-center">{{ o.total }}</td>
            <td class="text-center">
              <label class="switch">
                <input type="checkbox" :checked="o.status" @change="updateOrderStatus(o.id, o.status)">
                <span class="slider"></span>
              </label>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
//import Navbar from '@/components/Navbar'

export default {
  name: "Orders",
  components: {

  },
  props: {
    company_id: String
  },
  data: function() {
    return {
      company: firebase.auth().currentUser.email,
      orders: [],
      db: firebase.firestore(),
      hideCompleted: false
    };
  },
  methods: {
    getOrders: async function() {
      const ORDERS = await this.db
        .collection("Company")
        .doc(this.company)
        .collection("Orders")
        //.where('date', '<', 1564203458226)
        .get();

      ORDERS.forEach(o => {
        this.orders.push(this.buildOrder(o));
      });
    },

    getServiceNames: function(json){
      const arr = JSON.parse(json);
      let data = '';
      let name = '';
      arr.forEach((s, i) => {
        name = `<span class="badge badge-warning">
                  <span class="badge badge-danger">
                  ${s.order.quantity}
                  </span>
                  ${s.order.service}
                  <span class="badge badge-danger">
                     ${s.order.price} C/U
                  </span>
                </span>`;

        data += ((i === 0 ? '' : ' ') + name);
      });
      return data;
    },

    sendDesktopNotification: function(total){
      total = total || 0.0;

      this.$notification.show('Nueva orden', {
        body: 'Total RD$ '+total,
        icon: '@/assets/logo.png',
        image: '@/assets/logo.png'
      }, {})
        
    },
    
    verifyIfOrderLoaded: function(id){
      let exists = false;
      this.orders.forEach(o => {
        if(o.id == id){
          //console.log('order already loaded');
          exists = true;
          return;
        }
      });
      return exists;
    },

    listenForNewOrders: function(){
      this.db
      .collection("Company")
      .doc(this.company)
      .collection("Orders")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              let data = change.doc.data();
              if(!this.verifyIfOrderLoaded(change.doc.id)){
                this.sendDesktopNotification(data.total);
                this.orders.unshift(this.buildOrder(change.doc));
              }
            }
        });        
      });      
    },

    buildOrder: function(o){
      return {
          id: o.id,
          date: this.$helpers.getTime(o.data().date),
          status: o.data().status,
          table: o.data().table == '' ? 'N/D' : o.data().table,
          total: this.$helpers.asMoney(o.data().total),
          service: this.getServiceNames(o.data().service)
      };
    },

    updateOrderStatus: async function(oId, oldStatus){
      try{
        const newStatus = (oldStatus == '0' ? '1' : '0');
        const ORDER = await this.db
          .collection("Company")
          .doc(this.company)
          .collection("Orders")
          .doc(oId)
          .set({
            status: newStatus
          }, {merge: true});

          this.orders.forEach(o => {
            if(o.id === oId){
              o.status = newStatus;
              return;
            }
          });
      }catch(e){
        console.error(e);
      }
    }

  },
  mounted: async function() {
    await this.getOrders();

    this.listenForNewOrders();

  },

  watch: {
    hideCompleted: function(value){
      console.log('hideCompleted ',value);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.twrap{
  max-height: 300px;
  overflow-y: auto;
}
/* Flash class and keyframe animation */
.flashit{
  background-color:#f2f;
	-webkit-animation: flash linear 1s infinite;
	animation: flash linear 1s infinite;
}
@-webkit-keyframes flash {
	0% { opacity: 1; } 
	50% { opacity: .1; } 
	100% { opacity: 1; }
}
@keyframes flash {
	0% { opacity: 1; } 
	50% { opacity: .1; } 
	100% { opacity: 1; }
}

.big-f{
  font-size: large !important;
}

</style>
