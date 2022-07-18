<template>
  <b-row>
    <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
      <datatable-heading
        :details="true"
        :reload="true"
        :transaction_filter="false"
        :add_new_button="AddBtn"
        @add_new="add_new"
        :add_new_title="addBtnTitle"
        :title="
          id
            ? $t('edit_category')
            : isSubCategory
            ? $t('create_sub_category')
            : $t('create_category')
        "
      ></datatable-heading>
      <category_details
        @showAddButton="showAddButton"
        @createdSuccessfuly="createdSuccessfuly"
        :showCreateModal="showCreateModal"
        v-if="id"
        :_id="id"
        :_type="category"
      />
      <add_category
        @create-category="create_category"
        :isSubCategory="isSubCategory"
        v-if="!id"
        :_type="category"
      />
    </b-colxx>

    <b-modal
      ref="addSubCategoryModal"
      id="addSubCategoryModal"
      size="lg"
      :title="$t('forms.addSubCategoryTitle')"
      :hide-backdrop="true"
      :no-close-on-backdrop="true"
    >
      <div>
        <b-form @submit.prevent="onGridFormSubmit">
          <div v-for="(lang, index) in $v.lang_form.$each.$iter" :key="index">
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
          <!-- <b-button
            :disabled="enable"
            type="submit"
            variant="primary"
            class="mt-4"
            >{{ $t("forms.save") }}</b-button
          > -->
        </b-form>
      </div>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          :disabled="enable"
          @click="addSubCategory()"
          class="mr-1"
          >{{ $t("pages.add-new") }}</b-button
        >
        <b-button
          variant="secondary"
          @click="hideModal('addSubCategoryModal')"
          >{{ $t("pages.cancel") }}</b-button
        >
      </template>
    </b-modal>
  </b-row>
</template>

<script>
import VueDropzone from "vue2-dropzone";
import category_details from "../../../components/shared/category_details.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import add_category from "../../../components/shared/add_category.vue";
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");
import router from "../../../router";
import { adminRoot } from "../../../constants/config";

export default {
  components: {
    category_details,
    add_category,
    "vue-dropzone": VueDropzone,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      category: "category",
      id: null,
      lang_form: [],
      image: null,
      enable: false,
      addBtnTitle: null,
      isSubCategory: false,
      AddBtn: false,
      showCreateModal: false,
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
    lang_form: {
      $each: {
        name: {
          required
        },
        description: {},
        _name: {}
      }
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.lang_form);
  },
  methods: {
    ...mapActions(["createSubCategory", "createCategory"]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          name: "",
          description: "",
          _name: el.name
        });
      });
    },
    addSubCategory() {
      this.$v.$touch();
      this.$v.lang_form.$touch();
      if (!this.$v.lang_form.$invalid) {
        this.enable = true;
        this.createSubCategory({
          info: this.$v.lang_form.$model,
          image: this.image[0],
          id: this.id
        });
      }
    },
    showAddButton(val, title, isSubCategory) {
      this.isSubCategory = isSubCategory;
      this.AddBtn = val;
      this.addBtnTitle = title;
    },
    create_category(info, img, type) {
      this.createCategory({ info: info, image: img });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    add_new() {
      if (this.isSubCategory) {
        this.$refs["addSubCategoryModal"].show();
      } else {
        this.showCreateModal = true;
      }
    },
    createdSuccessfuly() {
      this.showCreateModal = false;
    },
    fileAdded(image) {
      this.image = image;
    },
    fileRemoved(image) {
      this.image = null;
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
      "_isLoadCustomField",
      "_successCreateSubCategory",
      "_create_category_success"
    ])
  },
  watch: {
    _createCustomField: function(val) {
      console.log("frfrfrfrfrfrfrfr");
      this.showCreateModal = false;
    },
    _successCreateSubCategory: function(val) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction Sub Category have been created successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["addSubCategoryModal"].hide();
      this.enable = false;
    },
    _create_category_success: function(val) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction Category have been created successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/categories`);
    }
  }
};
</script>
