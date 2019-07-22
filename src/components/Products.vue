<template>
  <div>
    <h2>Aqui se cargaran los productos</h2>
    <div class="twrap">
      <table class="table">
        <thead class="text-primary">
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoria</th>
          <th>Ìngredientes</th>
          <th>Descripcion</th>
        </thead>
        <tbody>
          <tr v-show="products.length === 0">
            <td class="text-center" colspan="3">
              <div class="lds-hourglass"></div>
            </td>
          </tr>

          <tr v-for="p in products" v-bind:key="p.id">
            <td>{{ p.name }}</td>
            <td class="text-center">{{ p.price }}</td>
            <td class="text-center">{{ p.category_id }}</td>
            <td class="text-center">{{ p.ingredient }}</td>
            <td class="text-center">{{ p.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Products",
  props: {
    company_id: String
  },
  data: function() {
    return {
      company: "makesushibycristino@gmail.com",
      products: [],
      db: firebase.firestore()
    };
  },
  methods: {
    getCompanyProducts: async function() {
      const PRODUCTS = await this.db
        .collection("Company")
        .doc(this.company)
        .collection("Products")
        .get();

      PRODUCTS.docs.forEach(p => {
        this.products.push({
          id: p.id,
          name: p.data().name,
          price: p.data().price,
          category_id: p.data().category_id,
          ingredient: 'some',//p.data().ingredient
          description: p.data().description
        });
      });
    }
  },
  mounted: function() {
    this.getCompanyProducts();
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
