<template>
  <div>
    <datatable-heading
      :title="$t('menu.auctions-table')"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :transaction_filter="false"
      :add_new_button="true"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :from="from"
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
        <template v-if="_isLoadAuctions">
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
              <b-button
                variant="outline-theme-3"
                class="icon-button"
                @click="modify(props.rowData.id)"
              >
                <i class="simple-icon-settings"></i>
              </b-button>
              <b-button
                variant="outline-theme-6"
                class="icon-button"
                @click="delete_auction(props.rowData.id)"
              >
                <i class="simple-icon-trash"></i>
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
  </div>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { mapGetters, mapActions } from "vuex";
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
      total: 0,
      dataCount: 0,
      lastPage: 0,
      items: [],
      selectedItems: [],

      fields: [
        {
          name: "locales",
          callback: value => {
            return value.en.title;
          },
          sortField: "title",
          title: "Title",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "locales",
          callback: value => {
            return value.en.terms_conditions;
          },
          sortField: "description",
          title: "Description",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "start_date",

          sortField: "start_date",
          title: "Start Date",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "end_date",

          sortField: "end_date",
          title: "End Date",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "opening_price",

          sortField: "opening_price",
          title: "Opening Price",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "25%"
        }
      ]
    };
  },
  created() {
    this.getAuctions({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions(["getAuctions", "deleteAuction"]),

    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },

    modify(id) {
      console.log(id);
      this.$router.push({
        path: `${adminRoot}/auctions/auction`,
        query: { id: id }
      });
    },

    rowClicked(dataItem, event) {
      const itemId = dataItem.id;
      console.log(dataItem.id);
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
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getAuction({
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
          this.getAuction({
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    },
    delete_auction(id) {
      this.deleteAuction({ Id: id });
    },
    onChangePage(page) {
      if (page == "next" || page == "prev") {
        console.log(page);
      } else {
        this.page = page;
        this.getAuction({
          dir: this.dir,
          search: this.search,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
      }
    },

    changePageSize(perPage) {
      console.log(perPage);
      this.limit = perPage;
      this.getAuction({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    searchChange(val) {
      console.log(val);
      this.search = val;
      this.getAuction({
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
      console.log(
        "context menu item clicked - " + action + ": ",
        this.selectedItems
      );
    },
    add_New() {
      this.$router.push({
        path: `${adminRoot}/auctions/auction`
      });
    }
  },
  computed: {
    ...mapGetters([
      "auctions",
      "auction_paginations",
      "_successDeleteAuction",
      "_isLoadAuctions"
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
        console.log("old", oldQuestion);
        console.log("new", newQuestion);
      }
    },
    _successDeleteAuction(newVal, old) {
      console.log("delete auction", old);
      this.getAuctions({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    auctions(newList, old) {
      console.log(newList);
      this.$refs.vuetable.setData(newList);
    },
    auction_paginations(newActions, old) {
      this.perPage = newActions.per_page;
      this.from = newActions.from;
      this.to = newActions.to;
      this.total = newActions.total;
      this.$refs.pagination.setPaginationData(newActions);
    }
  }
};
</script>
