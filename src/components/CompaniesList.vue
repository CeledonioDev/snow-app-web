<template>
  <div>
<table class="table">
        <thead class="text-primary">
          <th>
            Nombre
          </th>
          <th>
            Productos
          </th>
          <th class="text-center">
            Total de ordenes
          </th>
        </thead>
        <tbody>
          <tr v-show="companies.length === 0">
            <td class="text-center" colspan="3">
              <div class="lds-hourglass"></div>
            </td>
          </tr>
          <tr v-for="company in companies" v-bind:key="company.id">
            <td>
              <button @click="openEditCompanyModal(company.id)" class="btn btn-default p4">
                <i class="fa fa-edit new-product">Edit</i>
              </button>
              {{ company.id }}
            </td>
            <td>
              <div class="row">
                <div class="col-sm-6 text-right">
                  {{ company.products }}
                </div>
                <div class="col-sm-6 text-left" style="padding-left: inherit;">
                  <button @click="openAddProductModal(company.id)" class="btn btn-default p4">
                    <i class="fa fa-plus new-product">P+</i>
                  </button>
                </div>
              </div>
            </td>
            <td class="text-center">
              <div class="row">
                <div class="col-sm-6 text-right">
                  {{ company.orders }}
                </div>
                <div class="col-sm-6 text-left" style="padding-left: inherit;">
                  <button @click="openOrdersReportModal(company.id)"
                    class="btn btn-default orders-report p4">
                    <i class="fa fa-line-chart new-product">Rp</i>
                  </button>
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
  </div>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'CompaniesList',
  props: {
    //msg: String
  },
  data: function(){
    return {
      companies: [],
      db: firebase.firestore()
    }
  },
  methods: {
    getCompanies: async function () {
			//l('in getCompanies');
			const COMPANIES = await 
				this
				.db
				.collection("Company")
				.get();

			for (let i = 0; i < COMPANIES.docs.length; i++) {
				const PRODUCTS = await this
					.getCompanyProducts(COMPANIES.docs[i].id);

				const ORDERS = await this
					.getCompanyOrders(COMPANIES.docs[i].id);

				this.companies.push({
					id: COMPANIES.docs[i].id,
					orders: ORDERS.docs.length,
					products: PRODUCTS.docs.length
				});
			}
    },
    
    getCompanyProducts: function(company){
        return this
				.db
				.collection("Company")
				.doc(company)
				.collection('Products')
				.get();
    },
    
    getCompanyOrders: function(company){
      return this
      .db
      .collection("Company")
      .doc(company)
      .collection('Orders')
      .get();
    },

    openAddProductModal: function(company){

    }
  },
  mounted: function(){
    this.getCompanies();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

</style>
