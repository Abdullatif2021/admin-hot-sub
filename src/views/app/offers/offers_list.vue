<template>
  <div>
    <datatable-heading
      title="Offers"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :from="from"
      @add_new="add_New"
      :transaction_filter="false"
      :reload="true"
      :sort="sort"
      :pagination="true"
      :search="false"
      :add_new_button="true"
      :add_new_title="$t('todo.add-new')"
      :to="to"
      :Filtered="false"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="isLoadOffers">
          <vuetable
            ref="vuetable"
            class="table-divided order-with-arrow"
            :api-mode="false"
            :data-total="dataCount"
            :per-page="perPage"
            :data="offers"
            :data-manager="dataManager"
            :reactive-api-url="true"
            :fields="fields"
            pagination-path
            :row-class="onRowClass"
          >
            <template slot="actions" slot-scope="props">
              <!-- <b-button
                :variant="
                  props.rowData.active === 1
                    ? 'outline-theme-7'
                    : 'outline-theme-6'
                "
                class="icon-button"
                @click="
                  open_active_model(
                    'activeCategory',
                    props.rowData.id,
                    props.rowData.active
                  )
                "
              >
                <i class="iconsminds-radioactive"></i>
                <b-tooltip
                  :target="props.rowData"
                  ref="statusTooltip"
                  placement="top"
                  title="Active"
                  >Active</b-tooltip
                > 
              </b-button> -->
              <b-button
                variant="outline-theme-6"
                class="icon-button"
                style="margin-right: 8px;"
                @click="open_model('deleteCategory', props.rowData.id)"
              >
                <i class="simple-icon-trash"></i>
              </b-button>
              <!-- <b-button
                variant="outline-theme-3"
                class="icon-button"
                @click="modify(props.rowData.id)"
              >
                <i class="simple-icon-arrow-right"></i>
              </b-button> -->
            </template>
          </vuetable>
          <!-- <vuetable-pagination-bootstrap
            class="mt-4"
            ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          /> -->
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-colxx>
    </b-row>

    <!-- <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="onContextMenuAction('copy')">
        <i class="simple-icon-docs" />
        <span>Copy</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('move-to-archive')">
        <i class="simple-icon-drawer" />
        <span>Move to archive</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('delete')">
        <i class="simple-icon-trash" />
        <span>Delete</span>
      </v-contextmenu-item>
    </v-contextmenu> -->
    <b-modal
      id="activeCategory"
      ref="activeCategory"
      :title="$t('modal.modal-active-category-title')"
    >
      {{
        active === 1
          ? $t("forms.activeCategoryQuestion")
          : $t("forms.inactiveCategoryQuestion")
      }}
      <template slot="modal-footer">
        <b-button variant="primary" @click="active_category()" class="mr-1">
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('activeCategory')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal id="deleteCategory" ref="deleteCategory" title="Offer Delete">
      Are you sure you want to delete this Offer ?
      <template slot="modal-footer">
        <b-button
          :disabled="deleteBtn"
          variant="primary"
          @click="delete_offer()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('deleteCategory')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal
      id="modalright"
      ref="modalright"
      title="Add New Offer"
      modal-class="modal-right"
    >
      <form>
        <b-form-group label="Name" class="has-float-label mb-4">
          <b-form-input type="text" v-model="name" />
        </b-form-group>

        <label class="form-group has-float-label">
          <b-colxx xxs="12" style="padding: 0px;">
            <b-form-group>
              <b-form-input
                style="display: none;"
                :state="!$v.file_form.desc_image.$error"
                v-model="$v.file_form.desc_image.$model"
              />
              <vue-dropzone
                ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-files-added="descAdded"
                @vdropzone-removed-file="descRemoved"
              ></vue-dropzone>
              <b-form-invalid-feedback v-if="!$v.file_form.desc_image.required"
                >Please insert desktop image size</b-form-invalid-feedback
              >
            </b-form-group>
          </b-colxx>
          <span>Desktop size</span>
        </label>
        <label class="form-group has-float-label">
          <b-colxx xxs="12" style="padding: 0px;">
            <b-form-group>
              <b-form-input
                style="display: none;"
                :state="!$v.file_form.mob_image.$error"
                v-model="$v.file_form.mob_image.$model"
              />
              <vue-dropzone
                ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-files-added="mobAdded"
                @vdropzone-removed-file="mobRemoved"
              ></vue-dropzone>
              <b-form-invalid-feedback v-if="!$v.file_form.mob_image.required"
                >Please insert mobile image size</b-form-invalid-feedback
              >
            </b-form-group>
          </b-colxx>
          <span>Mobile size</span>
        </label>
      </form>
      <template slot="modal-footer">
        <b-button
          variant="outline-secondary"
          @click="hideModal('modalright')"
          >{{ $t("survey.cancel") }}</b-button
        >
        <b-button
          :disabled="enable"
          variant="primary"
          @click="formSubmit()"
          class="mr-1"
          >{{ $t("survey.submit") }}</b-button
        >
      </template>
    </b-modal>
    <!-- <deleteModal
      :hideModel="hideModel"
      :message="$t('forms.deleteCategoryQuestion')"
      :modalName="modalName"
      @delete_event="delete_offer()"
    /> -->
  </div>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { mapGetters, mapActions } from "vuex";
import router from "../../../router";
import { getCurrentLanguage } from "../../../utils";
import { adminRoot } from "../../../constants/config";
import deleteModal from "../../../components/shared/deleteModal.vue";
import axios from "axios";
import VueDropzone from "vue2-dropzone";
import { validationMixin } from "vuelidate";
const { required, email } = require("vuelidate/lib/validators");
export default {
  components: {
    vuetable: Vuetable,
    deleteModal: deleteModal,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      dir: null,
      order_by: null,
      search: null,
      isLoadOffers: false,
      modalName: null,
      deleteBtn: false,
      hideModel: false,
      desc_image: null,
      mob_image: null,
      actions: null,
      name: null,
      enable: false,
      isLoad: false,
      apiBase: "/cakes/fordatatable",
      file_form: {
        desc_image: null,
        mob_image: null
      },
      sort: {
        column: null,
        label: "All"
      },
      page: 1,
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
      limit: null,
      perPage: 8,
      from: 0,
      to: 0,
      language: null,
      total: 0,
      dataCount: 0,
      id: null,
      active: null,
      lastPage: 0,
      items: [],
      selectedItems: [],
      offers: [],
      fields: [
        {
          name: "name",

          title: "Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%"
        },
        {
          name: "desc_image",
          callback: value => {
            return `<img src="${value}" alt="Image" height="100">`;
          },
          title: "Desktop Image",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%"
        },
        {
          name: "mob_image",
          callback: value => {
            return `<img src="${value}" alt="Image" height="100">`;
          },
          title: "Mobile Image",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%"
        },
        // {
        //   name: "locales",
        //   callback: value => {
        //     return value[this.language].name;
        //   },
        //   sortField: "slug",
        //   title: "Title",
        //   titleClass: "title",
        //   dataClass: "list-item-heading",
        //   width: "30%"
        // },
        // {
        //   name: "locales",
        //   callback: value => {
        //     return value[this.language].description;
        //   },
        //   sortField: "description",
        //   title: "Description",
        //   titleClass: "",
        //   dataClass: "list-item-heading",
        //   width: "20%"
        // },
        // {
        //   name: "",
        //    callback: value => {
        //     return `<b-button class="${value.active === 1 ? 'toggle_btn_on': 'toggle_btn_off'}" variant="primary">
        //       <span class="${value.active === 1 ? 'toggle_span_on': 'toggle_span_off'}"></span>
        // </b-button>`;

        //   },
        //   title: "Activate",
        //   titleClass: "",
        //   dataClass: "list-item-heading",
        //   width: "8%"
        // },

        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%"
        }
      ]
    };
  },
  mixins: [validationMixin],
  validations: {
    file_form: {
      desc_image: { required },
      mob_image: { required }
    }
  },
  created() {
    this.language = getCurrentLanguage();
    this.getOffers();
  },
  methods: {
    getOffers() {
      axios
        .get("http://back-end.hot-sub.ca/api/offers")
        .then(response => {
          console.log({ response });
          this.offers = response.data.data;
          this.isLoadOffers = true;
        })
        .catch(error => {
          console.error("There was an error fetching the offers:", error);
        });
    },
    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },
    active_category() {
      this.categoryActivate({ id: this.id, active: this.active === 1 ? 0 : 1 });
    },
    modify(id) {
      this.$refs["modalright"].show();
    },

    rowClicked(dataItem, field) {
      if (
        field.srcElement.localName === "span" ||
        field.srcElement.localName === "b-button"
      ) {
        if (field.srcElement.classList[0] !== "badge") {
          this.open_active_model(
            "activeCategory",
            dataItem.id,
            dataItem.active
          );
        }
      }
    },
    rightClicked(dataItem, field, event) {
      event.preventDefault();
      if (!this.selectedItems.includes(dataItem.id)) {
        this.selectedItems = [dataItem.id];
      }
      this.$refs.contextmenu.show({ top: event.pageY, left: event.pageX });
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    dataManager(sortOrder, pagination) {
      if (sortOrder.length > 0) {
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getCategories({
            sorting: true,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";
          this.getCategories({
            sorting: true,

            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    },
    formSubmit() {
      this.$v.$touch();
      this.$v.file_form.$touch();
      if (!this.$v.file_form.$invalid) {
        this.enable = true;
        const formData = new FormData();
        formData.append("desc_image", this.desc_image[0]);
        formData.append("mob_image", this.mob_image[0]);
        formData.append("name", this.name);

        axios
          .post("http://back-end.hot-sub.ca/api/offers", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(response => {
            this.$refs["modalright"].hide();
            this.name = null;
            this.desc_image = null;
            this.mob_image = null;
            this.file_form.mob_image = null;
            this.file_form.desc_image = null;
            this.$v.$reset();
            this.$notify(
              "success",
              "Operation completed successfully",
              "Offer have been created successfully",
              { duration: 3000, permanent: false }
            );
            this.getOffers();
            this.enable = false;
          })
          .catch(error => {
            console.error("There was an error!", error);
            this.$refs["modalright"].hide();
            this.$notify("error", "Error via Create", "Please try again", {
              duration: 4000,
              permanent: false
            });
            this.enable = false;
          });
      }
    },
    delete_offer() {
      this.deleteBtn = true;
      axios
        .delete(`http://back-end.hot-sub.ca/api/offers/${this.id}`)
        .then(response => {
          console.log("Delete successful", response);
          this.deleteBtn = false;
          this.$notify(
            "success",
            "Operation completed successfully",
            "Offer have been deleted successfully",
            { duration: 3000, permanent: false }
          );
          this.getOffers();
          this.$refs["deleteCategory"].hide();
        })
        .catch(error => {
          console.error("There was an error deleting the offer!", error);
          this.deleteBtn = false;
          this.$refs["deleteCategory"].hide();

          this.$notify("error", "Error via Delete", "Please try again", {
            duration: 4000,
            permanent: false
          });
          // Handle error here, e.g., show an error message to the user
        });
    },
    onChangePage(page) {
      if (page == "next" || page == "prev") {
      } else {
        this.page = page;
        this.getCategories({
          dir: this.dir,
          search: this.search,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
      }
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
    descAdded(file) {
      this.desc_image = file;
      this.file_form.desc_image =
        "*just for form validation as a fake input filed";
    },
    descRemoved(file) {
      this.desc_image = null;
      this.file_form.desc_image = null;
    },
    mobAdded(file) {
      this.mob_image = file;
      this.file_form.mob_image =
        "*just for form validation as a fake input filed";
    },
    mobRemoved(file) {
      this.mob_image = null;
      this.file_form.mob_image = null;
    },
    open_active_model(refname, id, active) {
      this.$refs[refname].show();
      this.id = id;
      this.active = active;
    },
    open_model(refname, id, active) {
      this.$refs[refname].show();
      this.id = id;
      this.active = active;
    },
    changePageSize(perPage) {
      this.limit = perPage;
      this.getCategories({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    searchChange(val) {
      this.search = val;
      this.getCategories({
        dir: this.dir,
        search: val,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map(x => x.id);
      }
    },
    keymap(event) {
      switch (event.srcKey) {
        case "select":
          this.selectAll(false);
          break;
        case "undo":
          this.selectedItems = [];
          break;
      }
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },

    onContextMenuAction(action) {},
    add_New() {
      this.name = null;
      this.desc_image = null;
      this.mob_image = null;
      this.file_form.mob_image = null;
      this.file_form.desc_image = null;
      this.$v.$reset();

      this.$refs["modalright"].show();
    }
  },
  computed: {
    ...mapGetters([
      "categories",
      "cate_paginations",
      "_successDeleteCategory",
      "_successActiveCategory",
      "_isLoadCategories"
    ]),
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    }
  },
  watch: {
    searchChange(newQuestion, oldQuestion) {
      if (newQuestion) {
      }
    },
    _successDeleteCategory(newVal, old) {
      this.hideModel = !this.hideModel;
      this.deleteBtn = false;
      this.$refs["deleteCategory"].hide();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Category have been deleted successfully",
        { duration: 3000, permanent: false }
      );
      this.getCategories({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    _successActiveCategory(newVal, old) {
      this.$refs["activeCategory"].hide();

      this.$notify(
        "success",
        "Operation completed successfully",
        "the state of Category have been changed successfully",
        { duration: 4000, permanent: false }
      );
      this.getCategories({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    offers(newList, old) {
      console.log({ newList });
      // this.$refs.vuetable.setData(newList);
    },
    cate_paginations(newActions, old) {
      this.perPage = newActions.per_page;
      this.from = newActions.from;
      this.to = newActions.to;
      this.total = newActions.total;
      this.$refs.pagination.setPaginationData(newActions);
    }
  }
};
</script>
