<template>
  <div>
    <datatable-heading
      title="Items"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :from="from"
      @add_new="add_New"
      :transaction_filter="false"
      :reload="true"
      :search="true"
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
        <template v-if="isLoadCates">
          <vuetable
            ref="vuetable"
            :data="categories"
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
            <template slot="category" slot-scope="props">
              {{ categoryMap[props.rowData.category_id] }}
            </template>
            <template slot="price" slot-scope="props">
              $ {{ props.rowData.price }}
            </template>
            <template slot="actions" slot-scope="props">
              <b-button
                variant="outline-theme-6"
                class="icon-button mr-2"
                @click="open_model('deleteItem', props.rowData.id)"
              >
                <i class="simple-icon-trash"></i>
              </b-button>
              <b-button
                variant="outline-theme-3"
                class="icon-button"
                @click="modify(props.rowData)"
              >
                <i class="simple-icon-arrow-right"></i>
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
    <b-modal id="deleteItem" ref="deleteItem" title="Delete Item">
      Are you sure you want to delete this item
      <template slot="modal-footer">
        <b-button
          :disabled="deleteBtn"
          variant="primary"
          @click="delete_item()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button
          :disabled="deleteBtn"
          variant="outline-secondary"
          @click="hideModal('deleteItem')"
          >{{ $t("button.no") }}</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { mapGetters, mapActions } from "vuex";
import router from "../../../router";
import { adminRoot } from "../../../constants/config";
import deleteModal from "../../../components/shared/deleteModal.vue";
import { validationMixin } from "vuelidate";
const { required, email } = require("vuelidate/lib/validators");
import axios from "axios";

export default {
  components: {
    vuetable: Vuetable,
    deleteModal: deleteModal,
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
      isLoadCates: false,
      hideModel: false,
      actions: null,
      isLoad: false,
      is_edit: false,
      enable: false,
      apiBase: "/cakes/fordatatable",
      sort: {
        column: null,
        label: "All"
      },
      page: 1,
      limit: null,
      categoryMap: {},
      perPage: 8,
      from: 0,
      to: 0,
      language: null,
      total: 0,
      dataCount: 0,
      file_form: {
        en_name: null,
        fr_name: null
      },
      id: null,
      active: null,
      lastPage: 0,
      categories: [],
      items: [],
      selectedItems: [],

      fields: [
        {
          name: "image",
          callback: value => {
            return `<img src="${value}" style="border-radius: 34%;" alt="Image" width="50" height="50">`;
          },
          title: "",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "en_name",
          title: "English Name",
          titleClass: "title",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "fr_name",
          title: "Franch Name",
          titleClass: "title",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "__slot:category",
          title: "Category",
          titleClass: "title",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "__slot:price",
          title: "Price",
          titleClass: "title",
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
  mixins: [validationMixin],
  validations: {
    file_form: {
      en_name: { required },
      fr_name: { required }
    }
  },
  created() {
    this.getCategories();
    this.getItems();
  },
  methods: {
    getCategories() {
      axios
        .get("http://back-end.hot-sub.ca/api/categories")
        .then(response => {
          console.log({ response });
          const categoryOptions = response.data.data;
          const categoryMap = {};
          categoryOptions.forEach(el => {
            categoryMap[el.id] = el.en_name;
          });
          this.categoryMap = categoryMap;
          console.log({ categoryMap });
        })
        .catch(error => {
          console.error("There was an error fetching the categories:", error);
        });
    },
    getItems(params = {}) {
      this.isLoadCates = false;
      const defaultParams = {
        per_page: this.perPage,
        page: this.page,
        sort_column: this.sort.column,
        sort_direction: this.sort.dir,
        search: this.search
      };
      const queryParams = { ...defaultParams, ...params };
      axios
        .get("http://back-end.hot-sub.ca/api/items", { params: queryParams })
        .then(response => {
          console.log({ response });
          const paginationData = response.data.data;
          this.categories = paginationData.data;
          this.from = paginationData.from;
          this.to = paginationData.to;
          this.total = paginationData.total;
          this.lastPage = paginationData.last_page;
          this.isLoadCates = true;
          this.onPaginationData(paginationData);
          if (this.$refs.pagination) {
            console.log("Pagination data is being set");
            this.$refs.pagination.setPaginationData(paginationData);
          }
        })
        .catch(error => {
          console.error("There was an error fetching the items:", error);
        });
    },
    modify(item) {
      this.$router.push({
        path: `${adminRoot}/items/item`,
        query: { id: item.id }
      });
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      if (this.$refs.pagination) {
        this.$refs.pagination.setPaginationData(paginationData);
      }
    },
    open_model(refname, id) {
      this.$refs[refname].show();
      this.id = id;
      this.active = active;
    },
    dataManager(sortOrder, pagination) {
      this.sort.column = sortOrder.sortBy;
      this.sort.dir = sortOrder.sortAsc ? "asc" : "desc";
      this.page = pagination.page;
      this.perPage = pagination.perPage;
      this.getItems();
    },
    onChangePage(page) {
      this.page = page;
      this.getItems();
    },
    onSortChange(sortColumn, sortDirection) {
      this.sort.column = sortColumn;
      this.sort.dir = sortDirection;
      this.getItems();
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    changePageSize(perPage) {
      this.perPage = perPage;
      this.getItems();
    },
    searchChange(val) {
      this.search = val;
      this.getItems();
    },
    async delete_item() {
      this.deleteBtn = true;
      try {
        const response = await axios.delete(
          `http://back-end.hot-sub.ca/api/items/${this.id}`
        );
        console.log("Delete successful", response);
        this.deleteBtn = false;

        if (response) {
          this.$notify(
            "success",
            "Operation completed successfully",
            "Item has been deleted successfully",
            { duration: 3000, permanent: false }
          );
        }

        this.getItems();
        this.$refs["deleteItem"].hide();
      } catch (error) {
        console.error("There was an error deleting the category!", error);
        this.deleteBtn = false;
        this.$refs["deleteItem"].hide();
        if (error) {
          this.$notify(
            "error",
            "Error via Delete",
            "Something went wrong, please try again",
            {
              duration: 7000,
              permanent: false
            }
          );
        }
      }
    },
    add_New() {
      this.$router.push({
        path: `${adminRoot}/items/item`
      });
    }
  }
};
</script>
