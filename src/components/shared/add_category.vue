<template>
  <b-colxx xxs="12">
    <b-card class="mb-4">
      <template v-if="_isLoadBlock">
        <b-form @submit.prevent="onGridFormSubmit">
          <b-row>
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
              <b-form-group :label="$t('forms.type')">
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
          <b-button
            :disabled="enable"
            type="submit"
            variant="primary"
            class="mt-4"
            >{{ $t("forms.save") }}</b-button
          >
        </b-form>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-card>
  </b-colxx>
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
  props: ["_type"],
  components: {
    "vue-dropzone": VueDropzone,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      is_block_category: false,
      file: null,
      enable: false,
      typeOptions: [],
      gridForm: {
        ar_name: "",
        en_name: "",
        en_description: "",
        ar_description: "",
        select: ""
      },
      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
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
      select: {
        required
      }
    }
  },
  created() {
    this._type == "block"
      ? ((this.is_block_category = true), this.getBlockCategoryTypes())
      : (this.gridForm.select = "just for form submit");
  },
  methods: {
    ...mapActions([
      "createBlockCategory",
      "createCategory",
      "getBlockCategoryTypes"
    ]),
    onGridFormSubmit() {
      this.$v.$touch();
      this.$v.gridForm.$touch();
      if (!this.$v.gridForm.$invalid) {
        this.enable = true;
        if (this._type == "block") {
          this.createBlockCategory({
            info: {
              "ar[name]": this.gridForm.ar_name,
              "ar[description]": this.gridForm.ar_description,
              "en[name]": this.gridForm.en_name,
              "en[description]": this.gridForm.en_description,
              type: this.gridForm.select
            },
            image: this.file ? this.file[0] : null
          });
        } else {
          this.createCategory({
            info: {
              "ar[name]": this.gridForm.ar_name,
              "ar[description]": this.gridForm.ar_description,
              "en[name]": this.gridForm.en_name,
              "en[description]": this.gridForm.en_description
            },
            image: this.file ? this.file[0] : null
          });
        }
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
      "_blockCategoryTypes",
      "_create_block_category_success",
      "_create_category_success",
      "_isLoadBlock"
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
      router.push(`${adminRoot}/categories`);
    },

    _blockCategoryTypes(newInfo, oldOne) {
      console.log(newInfo);
      newInfo.forEach(el => {
        this.typeOptions.push(el);
      });
    }
  }
};
</script>
