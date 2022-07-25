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
        @modifySubCategory="modifySubCategory"
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
      ref="subCategoryModal"
      id="subCategoryModal"
      size="lg"
      :title="
        isModify
          ? $t('forms.editSubCategoryTitle')
          : $t('forms.addSubCategoryTitle')
      "
      :hide-backdrop="true"
      :no-close-on-backdrop="true"
    >
      <div>
        <b-colxx v-if="iseEditCategory" sm="12">
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
              :label="$t('forms.icon')"
            >
              <b-form-input
                style="display: none;"
                :state="!$v.icon_form.icon.$error"
                v-model="$v.icon_form.icon.$model"
              />
              <vue-dropzone
                ref="iconVueDropzone"
                id="dropzone"
                :options="iconDropzoneOptions"
                @vdropzone-files-added="iconAdded"
                @vdropzone-removed-file="iconRemoved"
              ></vue-dropzone>
              <b-form-invalid-feedback v-if="!$v.icon_form.icon.required">{{
                $t("forms.choose-icon-message")
              }}</b-form-invalid-feedback>
              <div v-if="icon" class="image-review-show">
                <img
                  style="max-width: 100%;max-height: 100%;"
                  :src="isiconModify ? icon : getIconUrl"
                  alt="icon"
                />
                <span
                  :class="
                    language === 'en' ? 'delete-span-en' : 'delete-span-ar'
                  "
                >
                  <i
                    v-if="isModify"
                    @click="iconRemoved"
                    class="simple-icon-trash"
                  ></i>
                </span>
              </div>
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
            <div v-if="image" class="image-review-show">
              <img
                style="max-width: 100%;max-height: 100%;"
                :src="isimgModify ? image : getImageUrl"
                alt="image"
              />
              <span
                :class="language === 'en' ? 'delete-span-en' : 'delete-span-ar'"
              >
                <i
                  v-if="isModify"
                  @click="fileRemoved"
                  class="simple-icon-trash"
                ></i>
              </span>
            </div>
          </b-colxx>
        </b-form>
      </div>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          :disabled="enable"
          @click="addSubCategory()"
          class="mr-1"
          >{{ isModify ? $t("forms.submit") : $t("pages.add-new") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('subCategoryModal')">{{
          $t("pages.cancel")
        }}</b-button>
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
import { getCurrentLanguage } from "../../../utils";
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
      isimgModify: false,
      isiconModify: false,
      icon_form: {
        icon: null
      },
      image: null,
      isModify: false,
      enable: false,
      iseEditCategory: false,
      icon: null,
      addBtnTitle: null,
      isSubCategory: false,
      AddBtn: false,
      showCreateModal: false,
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
        acceptedFiles: ".svg"
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
    lang_form: {
      $each: {
        name: {
          required
        },
        description: {},
        _name: {}
      }
    },
    icon_form: {
      icon: {
        required
      }
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.lang_form);
           this.language = getCurrentLanguage();

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
      this.$v.icon_form.$touch();
      if (!this.$v.lang_form.$invalid && !this.$v.icon_form.$invalid) {
        this.enable = true;
        this.createSubCategory({
          info: this.$v.lang_form.$model,
          image: this.image ? this.image[0] : null,
          icon: this.icon ? this.icon[0] : null,
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
    modifySubCategory(item) {
      this.isModify = true;
      this.isimgModify = true;
      this.isiconModify = true;
       this.lang_form.forEach(el => {
        el.name = item.locales.[el._name].name;
        el.description = item.locales.[el._name].description;
      });
      this.image = item.image;
      this.icon = item.icon;
    this.$refs["subCategoryModal"].show();
      console.log(item);
    },
    add_new() {
       this.isModify = false;
         this.lang_form.forEach(el => {
        el.name = null;
        el.description = null;
      });
      this.icon_form.icon = null;
      this.image = null;
      this.icon = null;
      this.$v.$reset();
      if (this.isSubCategory) {
        this.isModify = false;
        this.$refs["subCategoryModal"].show();
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
      this.isimgModify = false;
    },
    iconAdded(icon) {
      this.icon_form.icon = "icon";
      this.icon = icon;


    },
    iconRemoved(icon) {
      this.icon_form.icon = null;
      this.isiconModify = false;
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
      "_isLoadCustomField",
      "_successCreateSubCategory",
      "_create_category_success"
    ]),
    getImageUrl(){
        return URL.createObjectURL(this.image[0]);

    },
    getIconUrl(){
         return URL.createObjectURL(this.icon[0]);

    }
  },
  watch: {
    _createCustomField: function(val) {
      console.log("frfrfrfrfrfrfrfr");
      this.showCreateModal = false;
    },
    _successCreateSubCategory: function(val) {
      this.lang_form.forEach(el => {
        el.name = null;
        el.description = null;
      });
      this.icon_form.icon = null;
      this.$v.$reset();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction Sub Category have been created successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["subCategoryModal"].hide();
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
