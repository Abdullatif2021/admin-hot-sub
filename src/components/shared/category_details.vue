<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :reload="true"
        :title="$t(_type)"
      ></datatable-heading>
      <b-card class="mb-4">
        <template v-if="!is_Load">
          <b-form @submit.prevent="onGridFormSubmit">
            <b-row>
              <b-colxx v-if="is_edit" sm="12">
                <label
                  style="display: flex;justify-content: center;"
                  class="form-group has-float-label"
                >
                  <img
                    :src="image"
                    style="border-radius: 20%;"
                    alt="Image"
                    width="120"
                    height="120"
                  />
                </label>
              </b-colxx>

              <b-colxx sm="6">
                <b-form-group :label="$t('forms.en_title')">
                  <b-form-input
                    type="text"
                    :state="!$v.gridForm.en_name.$error"
                    v-model="$v.gridForm.en_name.$model"
                  />
                  <b-form-invalid-feedback v-if="!$v.gridForm.en_name.required"
                    >Please enter Arabic title</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.ar_title')">
                  <b-form-input
                    type="text"
                    :state="!$v.gridForm.ar_name.$error"
                    v-model="$v.gridForm.ar_name.$model"
                  />
                  <b-form-invalid-feedback v-if="!$v.gridForm.ar_name.required"
                    >Please enter English title</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.en_desc')">
                  <b-form-input
                    type="text"
                    v-model="$v.gridForm.en_description.$model"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.ar_desc')">
                  <b-form-input
                    type="text"
                    :state="!$v.gridForm.ar_description.$error"
                    v-model="$v.gridForm.ar_description.$model"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx v-if="is_block_category" sm="12">
                <b-form-group label="Option">
                  <b-form-select
                    :state="!$v.gridForm.select.$error"
                    v-model="$v.gridForm.select.$model"
                    :options="typeOptions"
                    plain
                  />
                  <b-form-invalid-feedback v-if="!$v.gridForm.select.required"
                    >Please select category type</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <!-- <b-colxx v-if="category" sm="6">
              <b-form-group :label="$t('forms.ar_desc')">
                <b-form-input type="text" v-model="gridForm.add_to_menu" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group v-if="category"  :label="$t('forms.add_to_menu')">
                <b-form-input type="text" v-model="gridForm.perant_id" />
              </b-form-group>
            </b-colxx> -->

              <b-colxx xxs="12">
                <b-form-group :label="$t('forms.image')">
                  <vue-dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-files-added="fileAdded"
                    @vdropzone-sending-multiple="sendMessage"
                    @vdropzone-removed-file="fileRemoved"
                  ></vue-dropzone>
                </b-form-group>
              </b-colxx>
            </b-row>

            <b-button type="submit" variant="primary" class="mt-4">{{
              $t("forms.save")
            }}</b-button>
          </b-form>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import VueDropzone from "vue2-dropzone";
import DatatableHeading from "../../containers/datatable/DatatableHeading.vue";
import router from "../../router";
import { adminRoot } from "../../constants/config";

const { required } = require("vuelidate/lib/validators");

export default {
  props: ["_id", "_type"],
  components: {
    "vue-dropzone": VueDropzone,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      categoryId: null,
      _role: null,
      is_Load: true,
      is_edit: false,
      type: null,
      edit: true,
      password: null,
      is_block_category: false,
      image: null,
      select: null,
      create_role: null,
      file: null,
      typeOptions: [
        "Photo Gallery",
        "Video Gallery",
        "Blog",
        "Stuff",
        "Slider",
        "Events",
        "News",
        "Services"
      ],
      gridForm: {
        ar_name: "",
        en_name: "",
        en_description: "",
        ar_description: "",
        select: ""
      },
      dropzoneOptions: {
        url:
          "https://lilacmarketingevents.com/tarrab-api/public/api/blocks/images/54?en[title]=dddddddddddddd&en[description]=dddddddddddddd",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles: "image/jpeg,image/png,image/gif"
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    gridForm: {
      en_name: {
        required
      },
      ar_name: {
        required
      },
      en_description: {},
      ar_description: {},
      select: {}
    }
  },
  created() {
    if (this._type == "edit_block") this.getBlockCategory({ id: this._id });
    else if (this._type == "edit_category") this.getCategory({ id: this._id });
    else if (this._type == "create_block") {
      this.is_block_category = true;
      this.is_Load = false;
    } else this.is_Load = false;
  },
  methods: {
    ...mapActions([
      "getBlockCategory",
      "updateBlockCategory",
      "createBlockCategory",
      "updateCategory",
      "createCategory",
      "getCategory"
    ]),
    onGridFormSubmit() {
      this.$v.$touch();
      this.$v.gridForm.$touch();
      if (!this.$v.gridForm.$invalid) {
        console.log("wrferfewrferferf");
        if (this._type == "edit_block") {
          this.updateBlockCategory({
            info: this.gridForm,
            img: this.file ? this.file[0] : null,
            id: this._id
          });
        } else if (this._type == "edit_category") {
          this.updateCategory({
            info: this.gridForm,
            img: this.file ? this.file[0] : null,
            id: this._id
          });
        } else if (this._type == "create_block") {
          this.createBlockCategory({
            info: this.gridForm,
            img: this.file ? this.file[0] : null
          });
        } else if (this._type == "create_category") {
          this.createCategory({
            info: this.gridForm,
            img: this.file ? this.file[0] : null
          });
        } else console.log("no one");
      }
    },
    fileAdded(file) {
      console.log(file);
      this.file = file;
    },
    fileRemoved(file) {
      this.file = null;
    },
    shootMessage: async function() {
      this.$refs.myVueDropzone.processQueue();
    },
    sendMessage: async function(files, xhr, formData) {},

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
  computed: {
    ...mapGetters([
      "_category",
      "_successUpdateCategory",
      "_blockCategory",
      "_successUpdateBlockCategory",
      "_create_block_category_success",
      "_create_category_success"
    ])
  },
  watch: {
    _create_block_category_success(newInfo, oldOne) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Block Category have been created successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/blockCategories`);
    },
    _create_category_success(newInfo, oldOne) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Category have been created successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/blockCategories`);
    },
    _category(newInfo, oldOne) {
      this.is_edit = true;
      this.gridForm.ar_name = newInfo.locales.ar.name
        ? newInfo.locales.ar.name
        : null;
      this.gridForm.en_name = newInfo.locales.en.name
        ? newInfo.locales.en.name
        : null;
      this.gridForm.ar_description = newInfo.locales.ar.description
        ? newInfo.locales.ar.description
        : null;
      this.gridForm.en_description = newInfo.locales.en.description
        ? newInfo.locales.en.description
        : null;
      this.image = newInfo.image;
      this.is_Load = false;
    },
    _successUpdateCategory(newInfo, oldOne) {
      console.log("hiiiiii");
      this.$notify(
        "success",
        "Operation completed successfully",
        "Category have been updated successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/categories`);
    },
    _blockCategory(newInfo, oldOne) {
      this.is_edit = true;
      this.is_block_category = true;
      this.gridForm.ar_name = newInfo.locales.ar.name
        ? newInfo.locales.ar.name
        : null;
      this.gridForm.en_name = newInfo.locales.en.name
        ? newInfo.locales.en.name
        : null;
      this.gridForm.ar_description = newInfo.locales.ar.description
        ? newInfo.locales.ar.description
        : null;
      this.gridForm.en_description = newInfo.locales.en.description
        ? newInfo.locales.en.description
        : null;
      this.image = newInfo.image;
      this.gridForm.select = newInfo.type;
      this.is_Load = false;
    },
    _successUpdateBlockCategory(newInfo, oldOne) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Block Category have been updated successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/blockCategories`);
    }
  }
};
</script>
