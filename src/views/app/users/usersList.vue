<template>
  <div>
    <datatable-heading
      :title="
        type === 'admins'
          ? $t('menu.admins_table')
          : $t('menu.accountant_table')
      "
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :category="category"
      :cancle="cancle"
      :changeOrderBy="changeOrderBy"
      :from="from"
      @add_new="add_New"
      :sort="sort"
      :to="to"
      :reload="reload"
      :Filtered="type === 'admins' ? true : false"
      :sortOptions="sortOptions"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="processing">
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
                @click="delete_user(props.rowData.id)"
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
      type: null,
      reload: true,
      search: null,
      actions: null,
      isLoad: false,
      apiBase: "/cakes/fordatatable",
      sort: {
        column: null,
        label: "all"
      },
      page: 1,
      category: false,

      limit: null,
      perPage: 8,
      from: 0,
      to: 0,
      total: 0,
      dataCount: 0,

      lastPage: 0,
      items: [],
      selectedItems: [],
      sortOptions: [
        {
          column: null,
          label: "all"
        },
        {
          column: "admin",
          label: "admin"
        },
        {
          column: "superadmin",
          label: "superadmin"
        }
      ],
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
          name: "first_name",
          sortField: "first_name",
          title: "Name",
          direction: "asc",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "email",
          title: "Email",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
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
          width: "20%"
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
          title: "Active",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%"
        },
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

  created() {
    this.type = this.$route.fullPath.split("/")[2];
    console.log(this.type);
    this.getUsersList({
      type: this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],
      role: null,
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions(["getUsersList", "deleteUser"]),

    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },
    cancle() {
      this.this.getUsersList({
        type: this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],

        role: null,
        dir: null,
        search: null,
        order_by: null,
        limit: null,
        page: null
      });
    },
    modify(id) {
      this.$router.push({
        path: `${adminRoot}/${this.type}/user`,
        query: { id: id }
      });
    },
    add_New() {
      this.$router.push({
        path: `${adminRoot}/${this.type}/user`
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
          this.getUsersList({
            type:
              this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],
            sorting: true,

            role: this.sort.column,
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
          this.getUsersList({
            sorting: true,

            type:
              this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],

            role: this.sort.column,
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
        console.log(page);
        console.log(this.page);
      } else {
        this.page = page;
        this.getUsersList({
          type:
            this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],

          role: this.sort.column,
          dir: this.dir,
          search: this.search,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
      }
    },
    delete_user(id) {
      this.deleteUser({ userId: id });
    },
    changePageSize(perPage) {
      console.log(perPage);
      this.limit = perPage;
      this.getUsersList({
        type: this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],

        role: this.sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    changeOrderBy(sort) {
      this.sort = sort;

      this.getUsersList({
        type: this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],

        role: sort.column,
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
      this.getUsersList({
        type: this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],

        role: this.sort.column,
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
    }
  },
  computed: {
    ...mapGetters([
      "usersList",
      "ListActions",
      "_successDeleteUser",
      "processing"
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
    $route(to, from) {
      this.reload = false;
      this.type = this.$route.fullPath.split("/")[2];
      console.log("from watcher", this.type);
      this.getUsersList({
        type: this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],
        role: null,
        dir: null,
        search: null,
        order_by: null,
        limit: null,
        page: null
      });
    },
    searchChange(newQuestion, oldQuestion) {
      if (newQuestion) {
        console.log("old", oldQuestion);
        console.log("new", newQuestion);
      }
    },
    _successDeleteUser(newVal, old) {
      this.getUsersList({
        role: this.sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    usersList(newList, old) {
      this.$refs.vuetable.setData(newList);
      this.reload = true;
    },
    ListActions(newActions, old) {
      this.perPage = newActions.per_page;
      this.from = newActions.from;
      this.to = newActions.to;
      this.total = newActions.total;
      this.$refs.pagination.setPaginationData(newActions);
    },
    type(newVal, old) {
      console.log("type", newVal);
    }
  }
};
</script>
