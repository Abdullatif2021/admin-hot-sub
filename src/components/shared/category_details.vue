<template>
  <b-colxx xxs="12">
    <b-card class="mb-4">
      <b-tabs card no-fade>
        <b-tab
          :title="$t(`forms.basic_details`)"
          active
          title-item-class="w-50 text-center"
        >
          <template v-if="!is_Load">
            <b-form @submit.prevent="onGridFormSubmit">
              <b-colxx sm="12">
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
              <div
                v-for="(lang, index) in $v.category_form.$each.$iter"
                :key="index"
              >
                <b-colxx sm="12">
                  <b-form-group
                    class="has-float-label mb-4"
                    :label="$t(`forms.${lang._name.$model}_name`)"
                  >
                    <b-form-input
                      type="text"
                      :state="!lang.name.$error"
                      v-model="lang.name.$model"
                    />
                    <b-form-invalid-feedback v-if="!lang.name.required">{{
                      $t("forms.title_filed")
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="12">
                  <b-form-group
                    class="has-float-label mb-4"
                    :label="$t(`forms.${lang._name.$model}_desc`)"
                  >
                    <b-form-input
                      type="text"
                      :state="!lang.description.$error"
                      v-model="lang.description.$model"
                    />
                    <b-form-invalid-feedback v-if="!lang.description.required">
                      {{ $t("forms.desc_filed") }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
              </div>
              <b-colxx v-if="is_block_category" sm="12">
                <b-form-group
                  class="has-float-label mb-4"
                  :label="$t('forms.type')"
                >
                  <b-form-select
                    :state="!$v.gridForm.select.$error"
                    v-model="$v.gridForm.select.$model"
                    :options="typeOptions"
                    plain
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.select.required"
                    >{{
                      $t("forms.category_type_select")
                    }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12">
                <b-form-group
                  class="has-float-label mb-4"
                  :label="$t('forms.image')"
                >
                  <vue-dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-files-added="fileAdded"
                    @vdropzone-removed-file="fileRemoved"
                  ></vue-dropzone>
                </b-form-group>
              </b-colxx>

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
        </b-tab>
        <b-tab
          :title="$t(`forms.meta_data`)"
          title-item-class="w-50 text-center"
        >
          <meta_data :id="_id" :type="_type" />
        </b-tab>
      </b-tabs>
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
import meta_data from "./meta_data.vue";
const { required } = require("vuelidate/lib/validators");

export default {
  props: ["_id", "_type"],
  components: {
    "vue-dropzone": VueDropzone,
    "datatable-heading": DatatableHeading,
    meta_data: meta_data
  },
  data() {
    return {
      categoryId: null,
      _role: null,
      is_Load: true,
      type: null,
      enable: false,
      edit: true,
      password: null,
      is_block_category: false,
      image: null,
      select: null,
      create_role: null,
      file: null,
      category_form: [],
      typeOptions: [],
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
    category_form: {
      $each: {
        name: {
          required
        },
        description: {},
        _name: {}
      }
    },
    gridForm: {
      select: { required }
    }
  },
  created() {
    this._type == "block"
      ? ((this.is_block_category = true),
        this.getBlockCategory({ id: this._id }),
        this.getBlockCategoryTypes())
      : this.getCategory({ id: this._id }),
      (this.gridForm.select = "just for form submit");
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.category_form);
  },
  methods: {
    ...mapActions([
      "getBlockCategory",
      "updateBlockCategory",
      "updateCategory",
      "getBlockCategoryTypes",

      "getCategory"
    ]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          name: "",
          description: "",
          _name: el.name
        });
      });
    },
    onGridFormSubmit() {
      this.$v.$touch();
      this.$v.gridForm.$touch();
      if (!this.$v.gridForm.$invalid && !this.$v.category_form.$invalid) {
        this.enable = true;
        if (this._type == "block") {
          this.updateBlockCategory({
            type: this.gridForm.select,
            info: this.$v.category_form.$model,
            image: this.file ? this.file[0] : null,
            id: this._id
          });
        } else {
          this.updateCategory({
            info: this.$v.category_form.$model,
            image: this.file ? this.file[0] : null,
            id: this._id
          });
        }
      }
    },
    fileAdded(file) {
      this.file = file;
    },
    fileRemoved(file) {
      this.file = null;
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
    },
    deleteMeta(id) {
    }
  },
  computed: {
    ...mapGetters([
      "_category",
      "_blockCategoryTypes",

      "_successUpdateCategory",
      "_blockCategory",
      "_successUpdateBlockCategory",
      "_isLoadBlock"
    ])
  },
  watch: {
    _category(newInfo, oldOne) {
      this.category_form.forEach(el => {
         el.name = newInfo.locales.[el._name].name;
          el.description = newInfo.locales.[el._name].description;

      });
      this.image = newInfo.image;
      this.is_Load = false;
    },
    _successUpdateCategory(newInfo, oldOne) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Category have been updated successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/categories`);
    },
    _blockCategory(newInfo, oldOne) {
      this.is_block_category = true;
      this.category_form.forEach(el => {
           el.name = newInfo.locales.[el._name].name;
          el.description = newInfo.locales.[el._name].description;

      });
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
    },
    _blockCategoryTypes(newInfo, oldOne) {
      newInfo.forEach(el => {
        this.typeOptions.push(el);
      });
    }
  }
};
</script>
