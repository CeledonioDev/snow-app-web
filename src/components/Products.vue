<template>
  <div>
    <button class="btn btn-primary" @click="openModal()">
      <i class="fa fa-plus"></i>
      Nuevo
    </button>
    <div class="twrap">
      <table class="table">
        <thead class="text-primary">
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoria</th>
          <th>Ìngredientes</th>
          <th>Descripcion</th>
          <th></th>  
        </thead>
        <tbody>
          <tr v-show="products.length === 0">
            <td class="text-center" colspan="5">
              <div class="lds-hourglass"></div>
            </td>
          </tr>

          <tr v-for="p in products" v-bind:key="p.id">
            <td><b>{{ p.name }}</b></td>
            <td class="text-center">{{ p.price }}</td>
            <td class="text-center">{{ p.category_id }}</td>
            <td class="text-center">{{ p.ingredient }}</td>
            <td class="">{{ p.description }}</td>
            <td>
              <a title="Eliminar producto" @click="deleteProduct(p.id)" href="#" class="text-danger">
                <i class="fa fa-trash fa-2x"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div
      class="modal fade"
      id="product-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="roduct-modal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles del producto</h5>
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
                      href="#tab-product-info"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >Informacion principal</a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="profile-tab"
                      data-toggle="tab"
                      href="#tab-product-photo"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >Imagen</a>
                  </li>
                  <li class="nav-item" v-show="involvesPreparation">
                    <a
                      class="nav-link"
                      id="profile-tab"
                      data-toggle="tab"
                      href="#tab-product-ingredients"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >Ingredientes</a>
                  </li>
                </ul>
                <br />
                <form>
                  <div class="tab-content" id="myTabContent">
                    <div
                      class="tab-pane fade show active"
                      id="tab-product-info"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="exampleInputEmail1">Categoria</label>
                            &nbsp;
                            <a
                              href="#"
                              @click="addCategory()"
                              class="add-product-category"
                            >
                              <b>Nueva</b>
                            </a>
                            <select v-model="category" class="form-control">
                              <option
                                v-for="pCategory in categories"
                                :value="pCategory.id"
                                :key="pCategory.id"
                              >{{ pCategory.name }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Nombre</label>
                            <input type="text" v-model="name" class="form-control" />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Descripcion</label>
                            <textarea
                              rows="5"
                              v-model="description"
                              class="form-control textarea"
                            ></textarea>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="exampleInputEmail1">Precio(RD$)</label>
                            <input
                              type="number"
                              v-model="price"
                              min="0"
                              max="50000"
                              class="form-control"
                            />
                          </div>

                          <div class="form-group">
                            <label>Conlleva preparacion</label>
                            <br />
                            <label class="switch">
                              <input type="checkbox" v-model="involvesPreparation" />
                              <span class="slider"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="tab-product-photo"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                    >
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="form-group">
                            <input
                              accept="image/*"
                              type="file"
                              id="product-photo"
                              class="form-control btn btn-sm btn-default"
                              @change="managePhoto($event)"
                            />
                          </div>
                          <br />
                          <div class="form-group text-center" id="product-photo-preview">
                            <img
                              :src="photoPreview"
                              v-show="photoPreview != ''"
                              alt="Foto del producto"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="tab-product-ingredients"
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                    >
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Sel.</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th class="text-center">En stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="ing in ingredients"
                            :class="ing.stock == 0 ? 'bg-danger' : '' "
                            :key="ing.id"
                          >
                            <td>
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  :disabled="ing.stock == 0"
                                  v-model="ing.selected"
                                  :value="ing.id"
                                  class="product-ingredient-selection"
                                />
                                <span class="slider"></span>
                              </label>
                            </td>
                            <td>{{ ing.name }}</td>
                            <td>
                              <input
                                style="width: auto;"
                                type="number"
                                :disabled="ing.stock == 0"
                                v-model="ing.quantity"
                                min="0"
                                :max="ing.stock"
                                class="form-control"
                              />
                            </td>
                            <td class="text-center">{{ ing.stock }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="row" style="width: 100%;">
              <div class="col-sm-3">
                <div id="product-category-loading" v-show="loaders.product">
                  <div class="lds-hourglass"></div>
                </div>
              </div>
              <div class="col-sm-9 text-right">
                <button type="button" :disabled="loading" class="btn btn-secondary" @click="closeProductModal()">Cerrar</button>
                <button type="button" :disabled="loading" class="btn btn-primary" @click="saveProduct()">Guardar cambios</button>
              </div>
            </div>
        </div>
      </div>
    </div>
    <!-- MODAL END -->

    <div class="modal fade" id="category-modal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLongTitle" aria-hidden="true">
          <div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="max-width: 402px !important;">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Agregar categoria</h5>
       
              </div>
              <div class="modal-body">

                <div class="card-body">
                  <form>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>Nombre</label>
                          <input type="text" v-model="category.name" class="form-control">

                        </div>
                      </div>
                    </div>

                  </form>
                </div>



              </div>
              <div class="modal-footer">
                <div class="row" style="width: 100%;">
                  <div class="col-sm-3">
                    <div id="product-category-loading" v-show="loaders.category">
                      <div class="lds-hourglass"></div>
                    </div>
                  </div>
                  <div class="col-sm-9 text-right">
                    <button type="button" class="btn btn-secondary" @click="closeCategoryModal()">Cancelar</button>
                    <button :disabled="loaders.category" type="button" class="btn btn-primary"
                      @click.prevent="saveCategory()">Guardar</button>
                  </div>
                </div>
              </div>
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
      db: firebase.firestore().collection("Company").doc(firebase.auth().currentUser.email),
      storage: firebase.storage().ref('Company'),
      modalOptions: {
        keyboard: false,
        backdrop: false
      },
      name: '',
      description: '',
      price: '',
      category_id: '',
      photo: '',
			photoPreview: '',
			involvesPreparation: false,
      
      category: {
        name: ''
      },

      categories: [],
      ingredients: [],

      loading: false,

      loaders: {
        category: false,
        product: false
      },

      VALID_IMG_TYPES: [
        'image/jpg',
        'image/jpeg',
        'image/gif',
        'image/png'
      ],

    };
  },
  methods: {

		saveProduct: async function () {
			if (this.name.length < 3) {
				this.notify('El nombre es muy corto.', 'danger');
				return false;
			}
			if (this.price.length === 0 || isNaN(this.price)) {
				this.notify('El telefono es invalido.', 'danger');
				return false;
			}
			this.loaders.product = true;
			let photo = '';
			if (this.photo) {
				const photoUploadUrl = await this.saveProductPhoto(this.photo);
				photo = photoUploadUrl;
			}
			let data = {
				name: this.name,
				price: this.price,
				category_id: this.category,
				description: this.description,
				photo: photo,
				ingredients: ''				
			};

			if(this.involvesPreparation){
				data.ingredients = this.getIngredientsToSave();
			}

			try {
				const NEW_PRODUCT = await this.db
					.collection('Products')
					.doc()
					.set(data);

        this.cleanProductFields();
				
				$('#product-photo').val('');

				this.notify('Producto guardado');
        this.loaders.product = false;
        this.getProducts();
			} catch (e) {
        this.loaders.product = false;
        this.notify('Error del servidor');
			}			
    },

    cleanProductFields: function(){
      
      this.name='';
      this.price='';
      this.category='';
      this.description= '';
      this.photo='';
      this.photoPreview='';
      this.involvesPreparation = false;
				
    },
    
	  saveProductPhoto: async function(file){
      let name = file.name;
      const uploadTask = await this
                              .storage
                              .child(this.company)
                              .child('Products/'+name)
                              .put(file);

      uploadTask.task.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        console.error('Upload >> ',error);
        // Handle unsuccessful uploads
      });

      const uri = await uploadTask.ref.getDownloadURL();
      return uri;
    },    

    getProducts: async function() {
      this.products = [];
      const PRODUCTS = await this.db
        .collection("Products")
        .get();

      PRODUCTS.docs.forEach(p => {
        this.products.push({
          id: p.id,
          name: p.data().name,
          price: p.data().price,
          category_id: this.getCategoryName(p.data().category_id),
          ingredient: "some", //p.data().ingredient
          description: p.data().description
        });
      });
    },

    openModal: function() {
      $("#product-modal").modal(this.modalOptions);
    },

    closeProductModal: function() {
      this.cleanProductFields();
      this.cleanIngredients();
      $("#product-modal").modal('hide');
    },

    getCategories: async function () {
			this.categories = [];

      const CATEGORIES = await this.db
        .collection('Category')
        .get();

      //this.productCategoriesCache[company] = CATEGORIES.docs;

      CATEGORIES.docs.forEach(category => {
       //console.log('cat > ',category.id, ' name > ',category.data().name);
				this.categories.push({
					id: category.id,
					name: category.data().name
				});
			});

		},

    getIngredients: async function () {
			this.ingredients = [];

      const INGREDIENTS = await this.db
        .collection('Inventory')
        .get();

      INGREDIENTS.docs.forEach(inventory => {
				this.ingredients.push({
					id: inventory.id,
					name: inventory.data().ingredient_name,
					quantity: 0,
					selected: false,
					stock: inventory.data().quantity
				});
			});

    },

		getIngredientsToSave: function(){
			let data = [];
			this.ingredients.forEach(ing => {
				if(ing.selected){
					data.push({
						indredient_id: ing.id,
						quantity: ing.quantity
					});
				}
			});
			this.cleanIngredients();
			return JSON.stringify(data);
		},

		cleanIngredients: function(){
			this.ingredients.forEach(ing => {
				ing.selected = false;
				ing.quantity = 0;
			});
    },
    
		saveCategory: async function () {
			if (this.category.name.length < 3) {
				this.notify('El nombre es muy corto.', 'danger');
				return false;
			}
			this.loaders.category = true;

			let data = {
				name: this.category.name
			};

			try {
				const NEW_CATEGORY = await this.db
					.collection('Category')
					.add(data);

				//const categoriesReady = await this.getCategories();
        this.categories.push({
          name: this.category.name,
          id: NEW_CATEGORY.id
        });

				this.category.name = '';
				this.notify('Categoria guardada');
        this.loaders.category = false;
			} catch (e) {
        this.loaders.category = false;
        console.log(e);
        this.notify('Error del servidor');        
			}
			
		},    
    
    managePhoto(e) {			
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length){
        return;
      }
			this.photo = files[0];
			this.photoPreview = URL.createObjectURL(files[0]);
    },

    notify: function(msg, color){
      try{
        //alert(msg);
        this.$toasted.show(msg);
      }catch(e){
        console.error(e);
        alert(msg);
      }
    },

    getCategoryName: function(id){
      let name = 'N/D';
      for(let i = 0; i < this.categories.length; i++){
        if(this.categories[i].id == id){
          name = this.categories[i].name;
          break;
        }
      }
      return name;
    },

    addCategory: function(){
      $("#category-modal").modal(this.modalOptions);
    },

    deleteProduct: function(id){
      console.log('deleteProduct >> ',id);
      swal({
				title: "Estas seguro?",
				text: "El producto se eliminara",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			})
			.then((ok) => {
				if (ok) {
          this.db.collection('Products').doc(id).delete();
          this.products = this.products.filter(p => p.id !== id);
				} 
			});
    },

    closeCategoryModal: function(){
      this.category.name = '';
      $('#category-modal').modal('hide');

    }
        
  },
  mounted: async function() {
    const CAT = await this.getCategories();
    this.getProducts();
    this.getIngredients();
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
