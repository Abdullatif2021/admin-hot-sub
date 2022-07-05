<template>
  <div>
    <datatable-heading
      :title="$t('menu.auctions-table')"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :transaction_filter="false"
      :add_new_button="true"
      :add_new_title="$t('todo.add-new')"
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
                <i class="simple-icon-pencil"></i>
              </b-button>
              <b-button
                variant="outline-theme-6"
                class="icon-button"
                @click="open_model('deleteModal', props.rowData.id)"
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
    <deleteModal
      :hideModel="hideModel"
      :message="$t('forms.deleteAuctionQuestion')"
      :modalName="modalName"
      @delete_event="delete_auction()"
    />
  </div>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import deleteModal from "../../../components/shared/deleteModal.vue"
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { mapGetters, mapActions } from "vuex";
import { getCurrentLanguage } from "../../../utils";
import router from "../../../router";
import { adminRoot } from "../../../constants/config";
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
      hideModel: false,
      auctionId: null,
      isLoad: false,
      apiBase: "/cakes/fordatatable",
      sort: {
        column: null,
        label: "All"
      },
      page: 1,
      language: null,
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
            return value.[this.language].title;
          },
          title: "Title",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },

        {
          name: "start_date",
          callback: value => {
            return value ;
          },

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
          title: "Opening Price",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "minimum_paid",
          sortField: "minimum_paid",
          title: "Minimum Paid",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
          {
          name: "minimum_paid",
          sortField: "minimum_paid",
          title: "number of bidding",
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
    this.language = getCurrentLanguage();

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
      this.$router.push({
        path: `${adminRoot}/auctions/auction`,
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
      open_model(refname, id) {
      this.modalName = refname;
      this.auctionId = id;
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
          this.getAuctions({
            dir: this.dir,
            sorting: true,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";
          this.getAuctions({
            dir: this.dir,
            sorting: true,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    },
    delete_auction() {
      this.deleteAuction({ Id: this.auctionId });
    },
    onChangePage(page) {
      if (page == "next" || page == "prev") {
      } else {
        this.page = page;
        this.getAuctions({
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
      this.getAuctions({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    searchChange(val) {
      this.search = val;
      this.getAuctions({
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
        path: `${adminRoot}/auctions/auction`
      });
    },
        toDateFormat(value){
      console.log(value);
     return value.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    },
  },
  computed: {
    ...mapGetters([
      "auctions",
      "auction_paginations",
      "_successDeleteAuction",
      "_isLoadAuctions"
    ]),
    // toDateFormat(value){
    //   console.log(value);
    //  return value.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    // },
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
    _successDeleteAuction(newVal, old) {
            this.hideModel = !this.hideModel

      this.$notify(
        "success",
        "Operation completed successfully",
        "the auction have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      this.getAuctions({
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    auctions(newList, old) {
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
