<template>
  <div>
    <datatable-heading
    :title="$t('menu.block-categories-table')"
    :isAnyItemSelected="isAnyItemSelected"
    :keymap="keymap"
    :changePageSize="changePageSize"
    :searchChange="searchChange"
    :transaction_filter="false"
    :from="from"
    :add_new_button="true"
    :add_new_title="$t('todo.add-new')"
    @add_new="add_New"
    :reload="true"
    :sort="sort"
    :to="to"
    :Filtered="false"
    :total="total"
    :perPage="perPage"
  ></datatable-heading>
    <b-row>
        <b-colxx v-for="(category,CIndex) in _blockCategories" xxs="12" lg="6" class="mb-5" :key="`category_${CIndex}`">
            <b-card class="flex-row listing-card-container cateCard" no-body>
                <div class="w-30 position-relative">
                    <router-link to="blog-detail">
                        <img class="cateImg" :src="category.image" alt="Card cap" />
                        <!-- <b-badge  variant="primary" pill class="position-absolute badge-top-left">new</b-badge> -->
                    </router-link>
                </div>
                <div class="w-70 d-flex align-items-center">
                    <b-card-body>
                        <router-link :to="`${adminRoot}/blockCategories/category?id=${category.id}`">
                            <h5 class="mb-3 listing-heading" v-line-clamp="2">{{ category.locales.en.name }}</h5>
                        </router-link>
                        <p class="listing-desc text-muted" v-line-clamp="3">{{ category.locales.en.description }}</p>
                        <b-button size="xs" @click="modify(category.id)" variant="outline-primary">Edit</b-button>
                    </b-card-body>
                </div>
            </b-card>
        </b-colxx>
    </b-row>
    
</div>
  <!-- <div>
    <datatable-heading
      :title="$t('menu.block-categories-table')"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :transaction_filter="false"
      :from="from"
      :add_new_button="true"
      :add_new_title="$t('todo.add-new')"
      @add_new="add_New"
      :reload="true"
      :sort="sort"
      :to="to"
      :Filtered="false"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="_isLoadCategories">
          <b-colxx v-for="(category,CIndex) in _blockCategories" xxs="12" lg="6" class="mb-5" :key="`category_${CIndex}`">
            <b-card class="flex-row listing-card-container" no-body>
                <div class="w-40 position-relative">
                    <router-link to="blog-detail">
                        <img class="card-img-left" :src="category.image" alt="Card cap" />
                        <b-badge  variant="primary" pill class="position-absolute badge-top-left">new</b-badge>
                    </router-link>
                </div>
                <div class="w-60 d-flex align-items-center">
                    <b-card-body>
                        <router-link to="blog-detail">
                            <h5 class="mb-3 listing-heading" v-line-clamp="2">{{ category.locales.en.name }}</h5>
                        </router-link>
                        <p class="listing-desc text-muted" v-line-clamp="3">{{ category.locales.en.description }}</p>
                    </b-card-body>
                </div>
            </b-card>
        </b-colxx>
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
            @vuetable:pagination-data="onPaginationData"
          >
            <template slot="actions" slot-scope="props">
              <b-button
                variant="outline-theme-3"
                class="icon-button"
                @click="modify(props.rowData.id)"
              >
              <i  class="simple-icon-arrow-right"></i>
              </b-button>
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
  </div> -->
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { mapGetters, mapActions } from "vuex";
import { getCurrentLanguage } from "../../../utils";
import router from "../../../router";
import { adminRoot } from "../../../constants/config";
export default {
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      dir: null,
      order_by: null,
      search: null,
      language: null,
      sort: {
        column: null,
        label: "All"
      },
      actions: null,
      isLoad: false,
      page: 1,
      limit: null,
      perPage: 8,
      adminRoot: adminRoot,
      from: 0,
      to: 0,
      total: 0,
      dataCount: 0,

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
          width: "30%"
        },
        {
          name: "locales",
          callback: value => {
            return value[this.language].name;
          },
          sortField: "slug",
          title: "Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%"
        },
        {
          name: "type",

          sortField: "type",
          title: "Type",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
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
    this.getBlockCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions(["getBlockCategories"]),

    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },

    modify(id) {
      this.$router.push({
        path: `${adminRoot}/blockCategories/category`,
        query: { id: id }
      });
    },

    rowClicked(dataItem, event) {
      const itemId = dataItem.id;
      if (event.shiftKey && this.selectedItems.length > 0) {
        this.selectedItems.push(
          dataItem.map(item => {
            return item.id;
          })
        );
        this.selectedItems = [...new Set(this.selectedItems)];
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId);
        } else this.selectedItems.push(itemId);
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
          this.getBlockCategories({
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
          this.getBlockCategories({
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
    onChangePage(page) {
      if (page == "next" || page == "prev") {
      } else {
        this.page = page;
        this.getBlockCategories({
          dir: this.dir,
          search: this.search,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
      }
    },

    changePageSize(perPage) {
      this.limit = perPage;
      this.getBlockCategories({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    searchChange(val) {
      this.search = val;
      this.getBlockCategories({
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
      this.$router.push({
        path: `${adminRoot}/blockCategories/category`
      });
    }
  },
  computed: {
    ...mapGetters([
      "_blockCategories",
      "_block_category_paginate",
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
    _blockCategories(newList, old) {
      this.$refs.vuetable.setData(newList);
    },
    _block_category_paginate(newActions, old) {
      this.perPage = newActions.per_page;
      this.from = newActions.from;
      this.to = newActions.to;
      this.total = newActions.total;
      // this.$refs.pagination.setPaginationData(newActions);
    }
  }
};
</script>
