<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{$t('edit_category')}}</h1>
        <div v-if="!isMetaData" class="top-right-button-container">
          <b-button
            variant="primary"
            size="lg"
            class="top-right-button"
            @click="add_new()"
            >{{ $t(`${add_new_title}`) }}</b-button>
        </div>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
          <b-tab 
            :title="$t(`forms.basic_details`)"
            active
            @click="displayAddBtn('todo.add-new-sub-category', false, true ), getBasic()"
           >
            <template v-if="_isLoadCategories">
              <b-row>
                <b-colxx xxs="12" xs="6" lg="6"> 
                  <Category_basic_details :basicData="_category" @deleteBtnClicked="open_delete_model('deleteCategory')" :isAuctionCategory="true" :enableSubmitBtn="enableSubmitBtn" @formSubmited="basicDetailsSubmit" />
                </b-colxx>
                <b-colxx xxs="12" xs="6" lg="6">
                    <b-card class="mb-4 basicDetailsContainer" no-body>
                      <h5 class="card-title">{{$t(`forms.sub-category`)}}</h5>
                      <vuetable
                        class="tableSubCategory"
                        ref="subVuetable"
                        :api-mode="false"
                        :reactive-api-url="true"
                        :fields="subCategoryFields">
                        <template slot="actions" slot-scope="props">
                          <b-button
                            variant="outline-theme-3"
                            class="icon-button"
                            @click="modifySubCategory(props.rowData)">
                            <i class="simple-icon-arrow-right"></i>
                          </b-button>
                        </template>
                      </vuetable>
                    </b-card>
                </b-colxx>
              </b-row>
            </template>
            <template v-else>
              <div class="loading"></div>
            </template>
          </b-tab>
          <b-tab 
            :title="$t(`forms.custom_field`)"
            @click="displayAddBtn('todo.add-new-custom-filed', false, false), getCutom()"
            >
              <template v-if="_isLoadCustomField">
                <b-colxx xs="12" md="12" class="mb-3">
                  <b-card>
                    <vuetable
                      ref="custom_vuetable"
                      :api-mode="false"
                      :reactive-api-url="true"
                      :fields="fields">
                      <template slot="actions" slot-scope="props">
                        <b-button
                          variant="outline-theme-3"
                          class="icon-button"
                          @click="modify(props.rowData)">
                          <i class="simple-icon-arrow-right"></i>
                        </b-button>
                      </template>
                    </vuetable>
                  </b-card>
                </b-colxx>
              </template>
              <template v-else>
                <div class="loading"></div>
              </template>
              <add-new-custom-field
                :hideCustomModal="hideCustomModal"
                @create-custom-field="create_custom_field"
                @update-custom-field="update_custom_field"
                @delete-custom-field="delete_custom_field"
                :showCreateModal="showCreateModal"
                :showUpdateModal="showUpdateModal"
                :customFieldInfo="customFieldInfo"
              />
          </b-tab>
          <b-tab 
            :title="$t(`forms.meta_data`)"
            @click="displayAddBtn('meta', true, false), getMeta()">
            <metaData
                :list="_CategoryMeta"
                :meta_type_list="_categoryMetaTypeList"
                :isLoad="_isLoadCategories"
                :meta_success_create="_create_category_meta_success"
                @create-meta="createMeta"
                @update-meta="updateMeta"
                @delete-meta="deleteMeta"
              /> 
          </b-tab>
        </b-tabs>
      </b-colxx>
    </b-row>
    <b-modal
      id="deleteCategory"
      ref="deleteCategory"
      :title="$t('modal.modal-delete-category-title')">
      {{ $t("forms.deleteCategoryQuestion") }}
      <template slot="modal-footer">
        <b-button
          :disabled="deleteBtn"
          variant="primary"
          @click="delete_category()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('deleteCategory')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal id="deleteModal" ref="deleteModal" :title="$t('modal.modal-delete-category-title')">{{ $t(`forms.deleteCustomFieldQuestion`) }}
      <template slot="modal-footer">
        <b-button variant="primary" :disabled="disableCutomBtn" @click="delete_custom" class="mr-1">{{ $t("button.yes") }}</b-button>
        <b-button variant="secondary" @click="hideModal('deleteModal')">{{$t("button.no")}}</b-button>
      </template>
    </b-modal>
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
  </div>
</template>

<script>
import VueDropzone from "vue2-dropzone";
import Vuetable from "vuetable-2/src/components/Vuetable";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import add_category from "../../../components/shared/add_category.vue";
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { getCurrentLanguage } from "../../../utils";
const { required } = require("vuelidate/lib/validators");
import router from "../../../router";
import { adminRoot } from "../../../constants/config";
import addCustomField from "../../../components/shared/addCustomField.vue";
import metaData from "../../../components/shared/metaData.vue";
import Category_basic_details from "../../../components/shared/category_basic_details.vue";


export default {
  components: {
    add_category,
    vuetable: Vuetable,
    metaData,
    Category_basic_details,
    "vue-dropzone": VueDropzone,
    "datatable-heading": DatatableHeading,
    "add-new-custom-field": addCustomField,
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
      deleteBtn: false,
      enableSubmitBtn: false,
      sub_id : null,
      isModify: false,
      disableCutomBtn: false,
      isMetaData: false,
      enable: false,
      iseEditCategory: false,
      customFieldInfo: null,
      customFieldId: null,
      icon: null,
      add_new_title: 'todo.add-new-sub-category',
      addBtnTitle: null,
      hideCustomModal: false,
      isSubCategory: false,
      AddBtn: false,
      showUpdateModal: false,
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
      },
      fields: [
        {
          name: "icon",
           callback: value => {
            return `<img src="${value}" style="border-radius: 34%;" alt="Image" width="50" height="50">`;
          },
          title: "Icon",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "25%"
        },
        {
          name: "locales",
          callback: value => {
            return value.ar.name;
          },
          title: "Arabic Title",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "25%"
        },
        {
          name: "locales",
          callback: value => {
            return value.en.name;
          },
          title: "English Title",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "25%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "25%"
        }
      ],
      subCategoryFields: [
         {
          name: "image",
          callback: value => {
            return `<img src="${value}" style="border-radius: 34%;" alt="Image" width="50" height="50">`;
          },
          title: "Image",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "locales",
          callback: value => {
            return value[this.language].name;
          },
          sortField: "slug",
          title: "Title",
          titleClass: "title",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "locales",
          callback: value => {
            return value[this.language].description;
          },
          sortField: "description",
          title: "Description",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%"
        },
        {
          name: "active",
          callback: value => {
            return value === 1
              ? `<span class="badge badge-pill badge-success handle mr-1">
                Active
              </span>`
              : `<span class="badge badge-pill badge-danger handle mr-1">
                Inactive
              </span>`;
          },
          sortField: "active",
          title: "Status",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ]
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
    this.getCategory({ id: this.$route.query.id })
    this.getSubCategories({ id: this.$route.query.id })
  },
  methods: {
    ...mapActions([
      "createCategory",
      "deleteCategory",
      "updateCategory",
      "getCategory",
      // ----- sub categories
      "getSubCategories",
      "createSubCategory",
      "updateSubCategory",
      "deleteSubCategory",
      
      //  ----- metadata -----
      "getCategoryMetadata",
      "getCategoryMetaTypeList",
      "createCategoryMetadata",
      "updateCategoryMetadata",
      "deleteCategoryMetadata",

      // ------ custom fields -----
      "updateCustomField",
      "getCustomFieldList",
      "deleteCustomField",
      "createCustomField",
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
    basicDetailsSubmit(langsData, img){
      this.enableSubmitBtn = true;
      this.updateCategory({
            info: langsData,
            image: img,
            id: this.id
          });
    },
    displayAddBtn(title, isMetaData, isSubCategory){
      this.add_new_title = title;
      this.isMetaData = isMetaData;
      this.isSubCategory = isSubCategory;
    },
    open_delete_model(refname) {
        this.$refs[refname].show();
    },
    delete_category() {
      this.deleteBtn = true;
      this.deleteCategory({ id: this.id });
    },
    addSubCategory() {
      this.$v.$touch();
      this.$v.lang_form.$touch();
      this.$v.icon_form.$touch();
      if (!this.$v.lang_form.$invalid && !this.$v.icon_form.$invalid) {
        this.enable = true;
        if (this.isModify) {
           this.updateSubCategory({
          info: this.$v.lang_form.$model,
          image: this.isimgModify ? null: this.image[0] ,
          icon: this.isiconModify ? null : this.icon[0],
          sub_id: this.sub_id,
          id: this.id
        });
        }else{
        this.createSubCategory({
          info: this.$v.lang_form.$model,
          image: this.image ? this.image[0] : null,
          icon: this.icon ? this.icon[0] : null,
          id: this.id
        });
        }

      }
    },
    create_category(info, img, type, icon) {
      this.createCategory({ info: info, image: img, icon: icon });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    modifySubCategory(item) {
      this.isModify = true;
      this.isimgModify = true;
      this.isiconModify = true;
       this.lang_form.forEach(el => {
        el.name = item.locales[el._name].name;
        el.description = item.locales[el._name].description;
      });
      this.image = item.image;
      this.sub_id = item.id
      this.icon = item.icon;
      this.icon_form.icon = "icon";
    this.$refs["subCategoryModal"].show();
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
        // this for custom field
        this.showCreateModal = !this.showCreateModal;
      }
    },
    getBasic(){
      this.getCategory({ id: this.$route.query.id })
      this.getSubCategories({ id: this.$route.query.id })
    },
  // -------------------custom filed --------------------------------
      getCutom(){
        console.log('errfrfnrfnrfnrfunruneune');
        this.getCustomFieldList({id: this.id})
      },
      modify(data){
        this.customFieldInfo = data;
        this.showUpdateModal = !this.showUpdateModal;
      },
      create_custom_field(val,type){
        this.createCustomField({info: val, type: type, categoryId: this.id })
      },
      update_custom_field(val,type,custom_id){
        this.updateCustomField({info: val, type: type, categoryId: this.id,custom_id: custom_id })
      },
      delete_custom_field(custom_id){
        this.customFieldId = custom_id
        this.$refs['deleteModal'].show();
      },
      delete_custom(){
        this.deleteCustomField({categoryId: this.id, custom_id: this.customFieldId})
      },
  // ===================meta_data===========================
      getMeta(){
          this.getCategoryMetadata({ id: this.id })
          this.getCategoryMetaTypeList();
        },
      createMeta(type, info){
        this.createCategoryMetadata({
                id: this.id,
                meta_type_id: type,
                info: info
              });
      },
      updateMeta(type, info, metaID){
        this.updateCategoryMetadata({
                id: this.id,
                metadata_id: metaID,
                meta_type_id: type,
                info: info
              });
      },
      deleteMeta(metaID){
        this.deleteCategoryMetadata({
                id: this.id,
                metadata_id: metaID
              })
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
      "_successUpdateSubCategory",
      "_create_category_success",
      "_categoryMetaTypeList",
      "_create_category_meta_success",
      "_CategoryMeta",
      "_category",
      "_successUpdateCategory",
      "_errorCategory",
      "_successDeleteCategory",
      "_isLoadCategories",
      "_updateCategoryMetaSuccess",
      "_customFields",
      "_updateCustomField",
      "_successDeleteCustomField",
      "_createCustomField",
     "_isLoadCustomField",
     "_subCategories"
    ]),
    getImageUrl(){
        return URL.createObjectURL(this.image[0]);

    },
    getIconUrl(){
         return URL.createObjectURL(this.icon[0]);

    }
  },
  watch: {
    _subCategories: function(val){
      console.log('subbbbbbb',val);
      this.$refs.subVuetable.setData(val);
    },

  
    _createCustomField: function(val){
        this.hideCustomModal = !this.hideCustomModal;
       this.$notify(
        "success",
        "Operation completed successfully",
        "Custom Field have been created successfully",
        { duration: 3000, permanent: false }
      );


    },
    _updateCustomField: function(val){
      this.hideCustomModal = !this.hideCustomModal;
        this.$notify(
          "success",
          "Operation completed successfully",
          "Custom Field have been updated successfully",
          { duration: 3000, permanent: false }
        );
    },
    _customFields(newList, old) {
      console.log(newList);
      this.$refs.custom_vuetable.setData(newList);
    },
    _successDeleteCustomField(newVal, old) {
      this.hideModel = !this.hideModel
      this.hideCustomModal = !this.hideCustomModal;
      this.disableDeleteBtn = false;
      this.disableCutomBtn = false;
      this.modalName = null;
      this.$notify(
        "success",
        "Operation completed successfully",
        "Custom Field have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      this.$refs['deleteModal'].hide();
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
      this.getBasic();
    },
    _successUpdateSubCategory: function(val) {
            this.lang_form.forEach(el => {
        el.name = null;
        el.description = null;
      });
      this.icon_form.icon = null;
      this.$v.$reset();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction Sub Category have been updated successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["subCategoryModal"].hide();
      this.enable = false;
      this.getBasic();
    },
    _create_category_success: function(val) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction Category have been created successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/categories`);
    },
    _successUpdateCategory: function(val){
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction Category have been updated successfully",
        { duration: 3000, permanent: false }
      );
      this.enableSubmitBtn = false;
    },
    _errorCategory: function(val){
      this.$notify(
        "error",
        "Something went wrong",
        "Please try again",
        { duration: 4000, permanent: false }
      );
      this.enable = false;
    },
    _successDeleteCategory(newVal, old) {
      this.hideModel = !this.hideModel
      this.deleteBtn = false;
      this.$refs['deleteCategory'].hide();
      router.push(`${adminRoot}/categories`);
      this.$notify(
        "success",
        "Operation completed successfully",
        "Category have been deleted successfully",
        { duration: 3000, permanent: false }
      );
    }
  }
};
</script>
