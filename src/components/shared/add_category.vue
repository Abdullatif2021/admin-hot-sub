<template>
  <b-colxx xxs="12">
    <b-card class="mb-4">
      <template v-if="_isLoadBlock">
        <b-form @submit.prevent="onGridFormSubmit">
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
              <b-form-invalid-feedback v-if="!$v.gridForm.select.required">{{
                $t("forms.category_type_select")
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-colxx>
          <b-colxx xxs="12">
            <b-form-group
              class="has-float-label mb-4"
              :label="$t('forms.icon')"
            >
              <b-form-input
                style="display: none;"
                :state="!$v.icon_form.icon.$error"
                v-model="$v.icon_form.icon.$model"
              />
              <vue-dropzone
                ref="myVueDropzone"
                id="dropzone"
                :options="iconDropzoneOptions"
                @vdropzone-files-added="iconAdded"
                @vdropzone-removed-file="iconRemoved"
              ></vue-dropzone>
              <b-form-invalid-feedback v-if="!$v.icon_form.icon.required">{{
                $t("forms.choose-icon-message")
              }}</b-form-invalid-feedback>
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
      icon: null,
      category_form: [],
      icon_form: {
        icon: null
      },
      gridForm: {
        select: ""
      },
      iconDropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles: "image/svg"
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
      select: {
        required
      }
    },
    icon_form: {
      icon: {
        required
      }
    }
  },
  created() {
    this._type == "block"
      ? ((this.is_block_category = true), this.getBlockCategoryTypes())
      : (this.gridForm.select = "just for form submit");
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.category_form);
  },
  methods: {
    ...mapActions(["createBlockCategory", "getBlockCategoryTypes"]),
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
      this.$v.icon_form.$touch();

      this.$v.category_form.$touch();
      if (
        !this.$v.gridForm.$invalid &&
        !this.$v.category_form.$invalid &&
        !this.$v.icon_form.$invalid
      ) {
        this.enable = true;
        this.$emit(
          "create-category",
          this.$v.category_form.$model,
          this.file ? this.file[0] : null,
          this.gridForm.select,
          this.icon ? this.icon[0] : null
        );
      }
    },
    fileAdded(file) {
      this.file = file;
    },
    fileRemoved(file) {
      this.file = null;
    },
    iconAdded(icon) {
      this.icon = icon;
    },
    iconRemoved() {
      this.icon = null;
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
    // _create_category_success(newInfo, oldOne) {
    //   this.$notify(
    //     "success",
    //     "Operation completed successfully",
    //     "Category have been created successfully",
    //     { duration: 3000, permanent: false }
    //   );
    //   router.push(`${adminRoot}/categories`);
    // },

    _blockCategoryTypes(newInfo, oldOne) {
      newInfo.forEach(el => {
        this.typeOptions.push(el);
      });
    }
  }
};
</script>
