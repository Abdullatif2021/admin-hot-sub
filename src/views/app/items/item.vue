<template>
  <div>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="item_head" />

      <div class="separator mb-5"></div>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card class="mb-4">
        <template v-if="isLoadFaq">
          <!-- Image Preview -->
          <div v-if="item_form.image" class="text-center mb-4">
            <img
              :src="item_form.image || placeholderImage"
              alt="Item Image"
              style="
    height: 100px;
"
              class="circular-image"
            />
          </div>
          <b-form @submit.prevent="onGridFormSubmit">
            <b-colxx sm="12">
              <b-form-group class="has-float-label mb-4" label="English Name">
                <b-form-input
                  type="text"
                  :state="!$v.item_form.en_name.$error"
                  v-model="$v.item_form.en_name.$model"
                />
                <b-form-invalid-feedback v-if="!$v.item_form.en_name.required"
                  >Please enter english name</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
              <b-form-group class="has-float-label mb-4" label="Franch Name">
                <b-form-input
                  type="text"
                  :state="!$v.item_form.fr_name.$error"
                  v-model="$v.item_form.fr_name.$model"
                />
                <b-form-invalid-feedback v-if="!$v.item_form.fr_name.required"
                  >Please enter franch name</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>

            <b-colxx sm="12">
              <b-form-group
                class="has-float-label mb-4"
                label="English Ingredients"
              >
                <b-form-textarea
                  id="textarea"
                  rows="3"
                  max-rows="6"
                  :state="!$v.item_form.en_ingredients.$error"
                  v-model="$v.item_form.en_ingredients.$model"
                ></b-form-textarea>
                <b-form-invalid-feedback
                  v-if="!$v.item_form.en_ingredients.required"
                  >Please insert the english
                  ingredients</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
              <b-form-group
                class="has-float-label mb-4"
                label="Franch Ingredients"
              >
                <b-form-textarea
                  id="textarea"
                  rows="3"
                  max-rows="6"
                  :state="!$v.item_form.fr_ingredients.$error"
                  v-model="$v.item_form.fr_ingredients.$model"
                ></b-form-textarea>
                <b-form-invalid-feedback
                  v-if="!$v.item_form.fr_ingredients.required"
                  >Please insert the franch ingredients</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>

            <b-colxx sm="12">
              <b-form-group
                class="has-float-label mb-4"
                :label="$t('forms.category')"
              >
                <b-form-select
                  :state="!$v.item_form.category_id.$error"
                  v-model="$v.item_form.category_id.$model"
                  :options="categoryOptions"
                  plain
                />
                <b-form-invalid-feedback
                  v-if="!$v.item_form.category_id.required"
                  >Please select category</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
              <b-form-group class="has-float-label mb-4" label="Price">
                <b-form-input
                  type="number"
                  :state="!$v.item_form.price.$error"
                  v-model="$v.item_form.price.$model"
                />
                <b-form-invalid-feedback v-if="!$v.item_form.price.required"
                  >Please enter the price</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>
            <b-colxx xxs="12">
              <b-form-group class="has-float-label mb-4" label="Image">
                <b-form-input
                  style="display: none;"
                  :state="!$v.item_form.image.$error"
                  v-model="$v.item_form.image.$model"
                />
                <vue-dropzone
                  ref="myVueDropzone"
                  id="dropzone"
                  :options="dropzoneOptions"
                  @vdropzone-files-added="imageAdded"
                  @vdropzone-removed-file="imageRemoved"
                ></vue-dropzone>
                <b-form-invalid-feedback v-if="!$v.item_form.image.required"
                  >Please insert item image</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>
            <b-button
              :disabled="enable"
              type="submit"
              style="float: right;     padding: 10px 32px 10px 33px;"
              variant="primary"
              class="mt-4"
              >Save</b-button
            >
            <b-button
              :disabled="enable"
              @click="return_back"
              style="float: right;   padding: 10px 32px 10px 33px;"
              variant="outline-secondary"
              class="mt-4 mr-3"
              >Cancel</b-button
            >
          </b-form>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-card>
    </b-colxx>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
const { required, requiredIf } = require("vuelidate/lib/validators");
import axios from "axios";
import VueDropzone from "vue2-dropzone";
import { adminRoot } from "../../../constants/config";
import router from "../../../router";

export default {
  components: {
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      language: null,
      isLoadFaq: true,
      item_head: "Create Item",
      enable: false,
      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 50,
        thumbnailWidth: 100,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles: "image/jpeg,image/png,image/gif"
      },
      categories: [],
      image: null,
      placeholderImage: null,
      item_form: {
        category_id: null,
        en_name: "",
        fr_name: "",
        en_ingredients: "",
        fr_ingredients: "",
        price: "",
        image: null
      },
      itemId: null,
      categoryOptions: []
    };
  },
  mixins: [validationMixin],
  validations: {
    item_form: {
      category_id: { required },
      en_name: { required },
      fr_name: { required },
      en_ingredients: { required },
      fr_ingredients: { required },
      image: { required },
      price: { required }
    }
  },
  created() {
    this.itemId = this.$route.query.id;
    if (this.itemId) {
      this.getItem(this.itemId);
      this.item_head = "Update Item";
    }
    this.getCategories({ search: null });
  },
  methods: {
    getCategories() {
      axios
        .get("http://back-end.hot-sub.ca/api/categories")
        .then(response => {
          console.log({ response });
          response.data.data.forEach(el => {
            this.categoryOptions.push(
              new Object({
                value: el.id,
                text: el.en_name
              })
            );
          });
        })
        .catch(error => {
          console.error("There was an error fetching the offers:", error);
        });
    },
    getItem(id) {
      axios
        .get(`http://back-end.hot-sub.ca/api/items/${id}`)
        .then(response => {
          const item = response.data.data;

          // Populate form data with item data
          this.item_form.category_id = item.category_id;
          this.item_form.en_name = item.en_name;
          this.item_form.fr_name = item.fr_name;
          this.item_form.en_ingredients = item.en_ingredients;
          this.item_form.fr_ingredients = item.fr_ingredients;
          this.item_form.price = item.price;
          this.item_form.image = item.image;

          // Update image preview in dropzone
          if (item.image) {
            const mockFile = {
              name: item.image.split("/").pop(),
              size: 1234, // provide a dummy size, or fetch the actual size
              dataURL: item.image
            };
            this.$refs.myVueDropzone.manuallyAddFile(mockFile, item.image);
          }
        })
        .catch(error => {
          console.error("There was an error fetching the item:", error);
        });
    },
    onGridFormSubmit() {
      this.$v.$touch();
      this.$v.item_form.$touch();
      if (!this.$v.item_form.$invalid) {
        this.enable = true;
        if (this.itemId) {
          const formData = new FormData();
          formData.append("category_id", this.item_form.category_id);
          formData.append("en_name", this.item_form.en_name);
          formData.append("fr_name", this.item_form.fr_name);
          formData.append("en_ingredients", this.item_form.en_ingredients);
          formData.append("fr_ingredients", this.item_form.fr_ingredients);
          formData.append("price", this.item_form.price);
          if (this.image) {
            formData.append("image", this.image);
          }

          axios
            .post(
              `http://back-end.hot-sub.ca/api/items/${this.itemId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            )
            .then(response => {
              console.log("Item successfully updated:", response.data);
              this.enable = false;

              this.$notify(
                "success",
                "Operation completed successfully",
                "Item have been updated successfully",
                { duration: 3000, permanent: false }
              );
            })
            .catch(error => {
              this.enable = false;

              console.error("There was an error creating the item:", error);
              this.$notify(
                "error",
                "Something went wrong",
                "Please try again later.",
                { duration: 4000, permanent: false }
              );
            });
        } else {
          const formData = new FormData();
          formData.append("category_id", this.item_form.category_id);
          formData.append("en_name", this.item_form.en_name);
          formData.append("fr_name", this.item_form.fr_name);
          formData.append("en_ingredients", this.item_form.en_ingredients);
          formData.append("fr_ingredients", this.item_form.fr_ingredients);
          formData.append("price", this.item_form.price);
          if (this.item_form.image) {
            formData.append("image", this.image);
          }

          axios
            .post("http://back-end.hot-sub.ca/api/items", formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(response => {
              console.log("Item successfully created:", response.data);
              this.$notify(
                "success",
                "Operation completed successfully",
                "Item have been created successfully",
                { duration: 3000, permanent: false }
              );
              router.push(`${adminRoot}/items`);
              this.enable = false;
            })
            .catch(error => {
              this.enable = false;

              console.error("There was an error creating the item:", error);
              this.$notify(
                "error",
                "Something went wrong",
                "Please try again later.",
                { duration: 4000, permanent: false }
              );
            });
        }
      }
    },
    imageAdded(file) {
      this.image = file[0];
      this.item_form.image = URL.createObjectURL(file[0]);
    },
    return_back() {
      router.push(`${adminRoot}/items`);
    },
    imageRemoved(file) {
      this.image = null;
      this.item_form.image = null;
    },
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `;
    }
  },
  computed: {},
  watch: {}
};
</script>
