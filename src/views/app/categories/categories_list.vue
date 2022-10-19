<template>
  <div>
    <datatable-heading
      :title="$t('menu.categories-table')"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :from="from"
      @add_new="add_New"
      :transaction_filter="false"
      :reload="true"
      :sort="sort"
      :add_new_button="true"
      :add_new_title="$t('todo.add-new')"
      :to="to"
      :Filtered="false"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="_isLoadCategories">
          <vuetable
            ref="vuetable"
            class="table-divided order-with-arrow"
            :api-mode="false"
            :data-total="dataCount"
            :per-page="perPage"
            :data-manager="dataManager"
            :reactive-api-url="true"
            :fields="fields"
            pagination-path
            :row-class="onRowClass"
            @vuetable:pagination-data="onPaginationData"
            @vuetable:row-clicked="rowClicked"
            @vuetable:cell-rightclicked="rightClicked"
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
                variant="outline-theme-3"
                class="icon-button"
                @click="modify(props.rowData.id)"
              >
              <i  class="simple-icon-arrow-right"></i>
              </b-button>
              <!-- <b-button
                variant="outline-theme-6"
                class="icon-button"
                @click="open_model('deleteCategory', props.rowData.id)"
              >
                <i class="simple-icon-trash"></i>
              </b-button> -->
            </template>
          </vuetable>
          <vuetable-pagination-bootstrap
            class="mt-4"
            ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          />
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-colxx>
    </b-row>

    <v-contextmenu ref="contextmenu">
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
    </v-contextmenu>
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
    <b-modal
      id="deleteCategory"
      ref="deleteCategory"
      :title="$t('modal.modal-delete-category-title')"
    >
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
    <!-- <deleteModal
      :hideModel="hideModel"
      :message="$t('forms.deleteCategoryQuestion')"
      :modalName="modalName"
      @delete_event="delete_category()"
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
import deleteModal from "../../../components/shared/deleteModal.vue"

export default {
  components: {
    vuetable: Vuetable,
    'deleteModal': deleteModal,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      dir: null,
      order_by: null,
      search: null,
      modalName: null,
      deleteBtn: false,
      hideModel: false,
      actions: null,
      isLoad: false,
      apiBase: "/cakes/fordatatable",
      sort: {
        column: null,
        label: "All"
      },
      page: 1,
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

      fields: [
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
          width: "30%"
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
          width: "20%"
        },
        {
          name: "",
           callback: value => {
            return `<b-button class="${value.active === 1 ? 'toggle_btn_on': 'toggle_btn_off'}" variant="primary">
              <span class="${value.active === 1 ? 'toggle_span_on': 'toggle_span_off'}"></span>
        </b-button>`;

          },
          title: "Activate",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "8%"
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
  created() {
       this.language = getCurrentLanguage();
    this.getCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions(["getCategories", "categoryActivate", "deleteCategory"]),

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
      this.$router.push({
        path: `${adminRoot}/categories/category`,
        query: { id: id }
      });
    },

    rowClicked(dataItem, field) {
      if( field.srcElement.localName === 'span' || field.srcElement.localName === 'b-button'){
        if( field.srcElement.classList[0] !== 'badge'){
          this.open_active_model('activeCategory', dataItem.id, dataItem.active) 
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
    delete_category() {
      this.deleteBtn = true;
      this.deleteCategory({ id: this.id });
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
    open_active_model(refname, id, active) {
      this.$refs[refname].show();
      this.id = id;
      this.active = active
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

    onContextMenuAction(action) {

    },
    add_New() {
      this.$router.push({
        path: `${adminRoot}/categories/category`
      });
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
      this.hideModel = !this.hideModel
      this.deleteBtn = false;
      this.$refs['deleteCategory'].hide();
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
    categories(newList, old) {
      this.$refs.vuetable.setData(newList);
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
