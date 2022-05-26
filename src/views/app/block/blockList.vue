<template>
  <div>
    <datatable-heading
      :title="$t('menu.blocks-table')"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :sortOptions="sortOptions"
      :reload="true"
      :category="category"
      :cancle="cancle"
      :changeOrderBy="changeOrderBy"
      :from="from"
      :sort="sort"
      :to="to"
      :Filtered="false"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="_isLoadBlock">
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
                @click="delete_block(props.rowData.id)"
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
      search: null,
      actions: null,
      category: true,
      sortOptions: [],
      isLoad: false,
      sort: {
        column: null,
        label: "All"
      },
      page: 1,
      limit: 8,
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
          name: "slug",
          sortField: "slug",
          title: "Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "post_date",
          title: "Date",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },

        {
          name: "visible",
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
    const type = this.$route.fullPath.split("/")[4];
    console.log(type);
    this.getBlocksList({
      block_category_id: type,
      dir: null,
      search: null,
      order_by: null,
      limit: 8,
      page: null
    });
    this.getBlockCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions(["getBlocksList", "getBlockCategories", "deleteBlock"]),

    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },
    delete_block(id) {
      this.deleteBlock({ blockId: id });
    },
    cancle() {
      this.this.getBlocksList({
        block_category_id: null,
        dir: null,
        search: null,
        order_by: null,
        limit: null,
        page: this.page
      });
    },
    modify(id) {
      console.log(id);
      this.$router.push({
        path: `${adminRoot}/blocks/block`,
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
          this.getBlocksList({
            block_category_id: this.sort.column,
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
          this.getBlocksList({
            block_category_id: this.sort.column,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    },

    onChangePage(_page) {
      if (_page == "next") {
        // this.getBlocksList({
        //   block_category_id: this.sort.column,
        //   dir: this.dir,
        //   search: this.search,
        //   order_by: this.order_by,
        //   limit: this.limit,
        //   page: this.page + 1
        // });
      }
      if (_page == "prev") {
        // this.getBlocksList({
        //   block_category_id: this.sort.column,
        //   dir: this.dir,
        //   search: this.search,
        //   order_by: this.order_by,
        //   limit: this.limit,
        //   page: this.page - 1
        // });
      } else {
        this.page = _page;
        this.getBlocksList({
          block_category_id: this.sort.column,
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
      this.getBlocksList({
        block_category_id: this.sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    changeOrderBy(sort) {
      this.sort = sort;

      this.getBlocksList({
        block_category_id: sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    searchChange(val) {
      this.search = val;
      this.getBlocksList({
        block_category_id: this.sort.column,
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
      "_blocks",
      "_isLoadBlock",
      "_blockPaginations",
      "_blockCategories",
      "_successDeleteBlock"
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
      const type = this.$route.fullPath.split("/")[4];
      console.log(type);

      this.getBlocksList({
        block_category_id: type,
        dir: null,
        search: null,
        order_by: null,
        limit: 8,
        page: null
      });
    },
    searchChange(newQuestion, oldQuestion) {
      if (newQuestion) {
        console.log("old", oldQuestion);
        console.log("new", newQuestion);
      }
    },
    _successDeleteBlock(newVal, old) {
      this.getBlocksList({
        block_category_id: this.sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    _blocks(newList, old) {
      this.$refs.vuetable.setData(newList);
    },
    _blockPaginations(newActions, old) {
      this.perPage = newActions.per_page;
      this.from = newActions.from;
      this.to = newActions.to;
      this.total = newActions.total;
      this.$refs.pagination.setPaginationData(newActions);
    },
    _blockCategories(newval, old) {
      console.log("watch", newval);
      newval.forEach(option => {
        this.sortOptions.push(
          new Object({
            column: option.id,
            label: option.slug.toUpperCase()
          })
        );
      });
    }
  }
};
</script>
