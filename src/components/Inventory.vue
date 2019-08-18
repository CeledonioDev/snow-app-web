<template>
  <div>
    <h5 class="modal-title row">
      <div class="col-sm-8">
        Inventario de ingredientes
      </div>
      <div class="col-sm-4 text-right">
        <button
          type="button"
          class="btn btn-info fs1"
          @click.prevent="openNewModal()"
        >
        <i class="fa fa-plus"></i>
        Nuevo
        </button>
      </div>
    </h5>

 
    <!-- Lista -->
    <div class="row">
      <div class="col-sm-12 list">
        <table class="table">
          <thead class="">
            <tr>
              <th>Ingrediente</th>
              <th>En almacen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ing in ingredientsList" :key="ing.ingredient_id">
              <td>{{ ing.name }}</td>
              <td>
                <input type="number" v-model="ing.quantity" min="0" max="100" class="form-control" />
              </td>
              <td>
                <a title="Eliminar del inventario" @click="deleteItemFromInventory(ing.id)" href="#" class="text-danger">
                  <i class="fa fa-trash fa-2x"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- Botones de accion -->
    <div class="row" style="width: 100%;">
      <div class="col-sm-2 text-left">
        <button
          type="button"
          class="btn btn-danger"
          @click.prevent="resetInventory()"
        >Reiniciar</button>
      </div>
      <div class="col-sm-1">
        <div id="inventory-loading" v-show="loading">
          <div class="lds-hourglass"></div>
        </div>
      </div>
      <div class="col-sm-9 text-right">
        <button
          type="button"
          class="btn btn-primary"
          @click.prevent="updateInventory()"
        >Actualizar</button>
      </div>
    </div>


    <!-- MODAL -->
    <div
      class="modal fade"
      id="new-ingredient-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="roduct-modal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Agregar ingrediente al inventario</h4>            
          </div>
          <div class="modal-body">

            <div class="row">
              <div class="col-sm-5 form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newIngredient.name"
                />
              </div>
              <div class="col-sm-5 form-group">              
                  <label>Cantidad inicial</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    class="form-control"
                    v-model="newIngredient.quantity"
                  />              
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button
            @click="cancelNewIngredient()"
            class="btn btn-default"
            >
              <i class="fa fa-ban"></i>
              Cancelar
            </button>
            <button
            :disabled="isInValidIngredient"
            @click="addIngredientToinventory()"
            class="btn btn-primary"
            >
              <i class="fa fa-save"></i>
              Guardar
            </button>
          </div>
        </div>
      </div>
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
      company: firebase.auth().currentUser.email,
      products: [],
      db: firebase.firestore(),
      storage: firebase.storage().ref("Company"),
      modalOptions: {
        keyboard: false,
        backdrop: false
      },

      newIngredient: {
        name: "",
        quantity: ""
      },
      ingredientsList: [],

      loading: false
    };
  },
  methods: {
    openNewModal: function(){
      $('#new-ingredient-modal').modal(this.modalOptions);

    },

    cancelNewIngredient: function(){
      this.newIngredient = {
        name: "",
        quantity: ""
      };

      $('#new-ingredient-modal').modal('hide');
    },

		getCompanyInventory: async function(){
			this.ingredientsList = [];

			const INV = await this
				.db
				.collection("Company")
				.doc(this.company)
				.collection('Inventory')
				.get();

				INV.docs.forEach(ing => {
					this.ingredientsList.push({
						id: ing.id,
						name: ing.data().ingredient_name,
						quantity: ing.data().quantity
					});
				});

		},	

		addIngredientToinventory: async function(){
			if(this.newIngredient.name && this.newIngredient.quantity){
				this.loading = true;

				try{
					const INGREDIENT = await this					
					.db
					.collection("Company")
					.doc(this.company)
					.collection('Ingredients')
					.add({
						name: this.newIngredient.name
					});

					await this					
					.db
					.collection("Company")
					.doc(this.company)
					.collection('Inventory')
					.doc(INGREDIENT.id)
					.set({
						ingredient_id: INGREDIENT.id,
						ingredient_name: this.newIngredient.name,
						quantity: this.newIngredient.quantity,
						status: 1
					});
					
					this.ingredientsList.push({
						id: INGREDIENT.id,
						name: this.newIngredient.name,
						quantity: this.newIngredient.quantity,
						selected: false,
						stock: this.ingredientsList.quantity
					});
					
					this.newIngredient.name='';
					this.newIngredient.quantity='';

					this.loading = false;
				}catch(e){
					console.log('ERR >> ',e);
					this.loading = false;
				}
			}else{
				this.notify('Nombre o cantidad incorrectos','danger');
			}
		},

		resetInventory: function(company){
			swal({
				title: "Estas seguro?",
				text: "La cantidad de todos los productos sera 0",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			})
			.then((ok) => {
				if (ok) {
					//reset
					console.log('reset inventory for company ',company);
				} 
			});
		},

		deleteItemFromInventory: async function(ingredient){
			console.log('deleteItemFromInventory >> ',ingredient);

			const CONFIRMATION = await swal({
				title: "Estas seguro?",
				text: "Se eliminara toda referencia de este ingrediente",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			});

			if (CONFIRMATION) {
				this.loading = true;
				try{
					const FROM_INGREDIENT = await this
					.db
					.collection("Company")
					.doc(this.company)
					.collection('Ingredients')
					.doc(ingredient)
					.delete();
	
					const FROM_INVETORY = await this
					.db
					.collection("Company")
					.doc(this.company)
					.collection('Inventory')
					.doc(ingredient)
					.delete();
					
					this.ingredientsList = this.ingredientsList.filter(i => i.id !== ingredient);

					this.loading = false;
				}catch(e){
					console.log('ERR > ',e);
					this.loading = false;
				}
			} 
		},

		updateInventory: async function(){
			this.loading = true;
			
			const objInventory = {};
			
			this.ingredientsList.forEach(i => {
				objInventory[i.id] = i.quantity;
			});

			try{
				const INVENTORY_REF = await this
					.db
					.collection("Company")
					.doc(this.company)
					.collection('Inventory');

				let list = await INVENTORY_REF.get();

				list.docs.forEach(ing => {

					if(ing.data().quantity != objInventory[ing.id]){
						
						INVENTORY_REF
						.doc(ing.id)
						.set({
							quantity: objInventory[ing.id]
						},{merge:true});

					}

				});	
        
        swal('Inventario actualizado');
        				
			}catch(e){
				console.log('ERR > ',e);
				this.notify('Error al actualizar inventario','danger');				
			}

			this.loading= false;
		},

		closeInventory: function(){
			$('#modal-inventory').modal('hide');
			this.inventory.company = 0;
			this.inventory.list = [];
		},


  },
  mounted: async function() {
    this.getCompanyInventory();
  },

  computed: {
    isInValidIngredient: function(){
			return this.loading || this.newIngredient.name=='' || this.newIngredient.quantity=='';
		}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.twrap {
  max-height: 300px;
  overflow-y: auto;
}

.list {
  max-height: 300px;
  overflow-y: auto;
}
.fs1{
  font-size: small;
}
</style>
