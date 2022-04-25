<template>
  <div>
    <datatable-heading
      :title="$t('menu.users-table')"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :cancle="cancle"
      :changeOrderBy="changeOrderBy"
      :from="from"
      :sort="sort"
      :to="to"
      :Filtered="true"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <vuetable
          ref="vuetable"
          class="table-divided order-with-arrow"
          :api-mode="false"
          :data-total="dataCount"
          :query-params="makeQueryParams"
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
          </template>
        </vuetable>
        <vuetable-pagination-bootstrap
          class="mt-4"
          ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        />
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
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      dir: null,
      role: null,
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
          name: "first_name",
          sortField: "first_name",
          title: "Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "50%"
        },
        {
          name: "email",
          sortField: "email",
          title: "Email",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%"
        },
        {
          name: "role",
          callback: value => {
            return value[0];
          },
          sortField: "role",
          title: "Role",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%"
        },
        {
          name: "active",
          callback: value => {
            return value === "1" ? "Active" : "Not Active";
          },
          sortField: "active",
          title: "Active",
          titleClass: "",
          dataClass: "text-muted",
          width: "25%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "5%"
        }
      ]
    };
  },
  mounted() {
    this.$refs.vuetable.setData(this.usersList);
  },
  created() {
    this.getUsersList({
      role: null,
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
    setTimeout(() => {
      this.$refs.vuetable.setData(this.usersList);
      this.perPage = this.ListActions.per_page;
      this.from = this.ListActions.from;
      this.to = this.ListActions.to;
      this.total = this.ListActions.total;
      this.$refs.pagination.setPaginationData(this.ListActions);
    }, 2000);
  },
  methods: {
    ...mapActions(["getUsersList"]),
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.selectedItems = [];
      return sortOrder[0]
        ? {
            sort: sortOrder[0]
              ? sortOrder[0].field + "|" + sortOrder[0].direction
              : "",
            page: currentPage,
            per_page: this.perPage,
            search: this.search
          }
        : {
            page: currentPage,
            per_page: this.perPage,
            search: this.search
          };
    },
    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },
    cancle() {
      this.this.getUsersList({
        role: null,
        dir: null,
        search: null,
        order_by: null,
        limit: null,
        page: null
      });
      setTimeout(() => {
        this.$refs.vuetable.setData(this.usersList);
        this.perPage = this.ListActions.per_page;
        this.from = this.ListActions.from;
        this.to = this.ListActions.to;
        this.total = this.ListActions.total;
        this.$refs.pagination.setPaginationData(this.ListActions);
      }, 2000);
    },
    modify(id) {
      this.$router.push({
        path: `${adminRoot}/users/user`,
        query: { id: id }
      });
    },
    getSortParam(sortOrder) {
      console.log(sortOrder);
    },

    rowClicked(dataItem, event) {
      const itemId = dataItem.id;
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.items;
        var start = this.getIndex(itemId, itemsForToggle, "id");
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          "id"
        );
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
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
      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        // this.dir = sortOrder[0].direction;
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getUsersList({
            role: this.sort.column,
            dir: "ASC",
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
          setTimeout(() => {
            this.$refs.vuetable.setData(this.usersList);
            this.perPage = this.ListActions.per_page;
            this.from = this.ListActions.from;
            this.to = this.ListActions.to;
            this.total = this.ListActions.total;
            this.$refs.pagination.setPaginationData(this.ListActions);
          }, 2000);
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getUsersList({
            role: this.sort.column,
            dir: "DESC",
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
          setTimeout(() => {
            this.$refs.vuetable.setData(this.usersList);
            this.perPage = this.ListActions.per_page;
            this.from = this.ListActions.from;
            this.to = this.ListActions.to;
            this.total = this.ListActions.total;
            this.$refs.pagination.setPaginationData(this.ListActions);
          }, 2000);
        }
      }
    },

    onChangePage(page) {
      // console.log(page);
      if (page == "next" || page == "prev") {
        console.log(page);
      } else {
        this.page = page;
        this.getUsersList({
          role: this.sort.column,
          dir: "DESC",
          search: this.search,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
        setTimeout(() => {
          this.$refs.vuetable.setData(this.usersList);
          this.perPage = this.ListActions.per_page;
          this.from = this.ListActions.from;
          this.to = this.ListActions.to;
          this.total = this.ListActions.total;
          this.$refs.pagination.setPaginationData(this.ListActions);
        }, 2000);
      }
    },

    changePageSize(perPage) {
      console.log(perPage);
      this.limit = perPage;
      this.getUsersList({
        role: this.sort.column,
        dir: "DESC",
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
      setTimeout(() => {
        this.$refs.vuetable.setData(this.usersList);
        this.perPage = this.ListActions.per_page;
        this.from = this.ListActions.from;
        this.to = this.ListActions.to;
        this.total = this.ListActions.total;
      }, 1000);
    },

    changeOrderBy(sort) {
      this.sort = sort;

      this.getUsersList({
        role: sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
      setTimeout(() => {
        this.$refs.vuetable.setData(this.usersList);
        this.perPage = this.ListActions.per_page;
        this.from = this.ListActions.from;
        this.to = this.ListActions.to;
        this.total = this.ListActions.total;
        this.$refs.pagination.setPaginationData(this.ListActions);
      }, 2000);
    },
    searchChange(val) {
      console.log(val);
      this.search = val;
      this.getUsersList({
        role: this.sort.column,
        dir: this.dir,
        search: val,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });

      setTimeout(() => {
        this.$refs.vuetable.setData(this.usersList);
      }, 1000);
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
    }
  },
  computed: {
    ...mapGetters(["usersList", "ListActions"]),
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
        console.log("sdfsdf", oldQuestion);
        console.log("new", newQuestion);
      }
    }
  }
};
</script>
