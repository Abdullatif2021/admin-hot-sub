<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ title }}</h1>
      <div v-if="add_new_button" class="top-right-button-container">
        <b-button
          variant="primary"
          size="lg"
          class="top-right-button"
          @click="add_New()"
          >{{ add_new_title }}</b-button
        >
      </div>
      <div v-if="categoryBtn" class="top-right-button-container">
        <b-button
          v-b-modal.modalright
          variant="primary"
          size="lg"
          class="top-right-button edit-category"
          @click="$emit('edit_category')"
          >{{ $t("todo.edit-block-category") }} {{ categoryName }}</b-button
        >
      </div>
      <piaf-breadcrumb />
      <div v-if="!details" class="mb-2 mt-2">
        <b-collapse id="displayOptions" class="d-md-block">
          <div class="d-block d-md-inline-block pt-1">
            <b-dropdown
              v-if="Filtered"
              id="ddown1"
              :text="`${sortTitle} ${$t(sort.label)}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(order, index) in sortOptions"
                :key="`order${index}`"
                @click="changeOrderBy(order)"
                >{{ $t(order.label) }}</b-dropdown-item
              >
            </b-dropdown>

            <div
              v-if="search"
              class="search-sm d-inline-block float-md-left mr-1 align-top"
            >
              <b-input
                :placeholder="$t('menu.search')"
                @input="val => searchChange(val)"
              />
            </div>
            <!-- <i @click="cancle()" class="simple-icon-close" /> -->
          </div>
          <div v-if="!pagination" class="float-md-right pt-1">
            <span class="text-muted text-small mr-1 mb-2"
              >{{ from }}-{{ to }} {{ $t("forms.of") }} {{ total }}</span
            >
            <b-dropdown
              id="ddown2"
              right
              :text="`${perPage}`"
              variant="outline-dark"
              class="d-inline-block"
              size="xs"
            >
              <b-dropdown-item
                v-for="(size, index) in pageSizes"
                :key="index"
                @click="changePageSize(size)"
                >{{ size }}</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </b-collapse>
      </div>
      <div v-if="transaction_filter" class="mb-2 mt-2">
        <b-collapse id="displayOptions" class="d-md-block">
          <div class="d-block d-md-inline-block pt-1">
            <b-dropdown
              id="ddown1"
              :text="`${$t('todo.orderbymethod')} ${$t(method_sort.label)}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(method, index) in transactions_method"
                :key="`order${index}`"
                @click="changeOrderBy(method, 'method')"
                >{{ method.label }}</b-dropdown-item
              >
            </b-dropdown>
            <b-dropdown
              id="ddown1"
              :text="`${$t('todo.orderbystate')} ${$t(state_sort.label)}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(state, index) in transactions_state"
                :key="`order${index}`"
                @click="changeOrderBy(state, 'state')"
                >{{ state.label }}</b-dropdown-item
              >
            </b-dropdown>
            <b-dropdown
              id="ddown1"
              :text="`${$t('todo.orderbytype')} ${$t(type_sort.label)}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(type, index) in transactions_type"
                :key="`order${index}`"
                @click="changeOrderBy(type, 'type')"
                >{{ type.label }}</b-dropdown-item
              >
            </b-dropdown>

            <div class="search-sm d-inline-block float-md-left mr-1 align-top">
              <b-input
                :placeholder="$t('menu.search')"
                @input="val => searchChange(val)"
              />
            </div>
            <!-- <i @click="cancle()" class="simple-icon-close" /> -->
          </div>
        </b-collapse>
      </div>

      <div class="separator mb-5" />
    </b-colxx>
  </b-row>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: "NONE"
    },
    name: {
      type: String,
      default: "NONE"
    },
    name: {
      type: String,
      default: "NONE"
    }
  },
  props: [
    "title",
    "selectAll",
    "categoryName",
    "isSelectedAll",
    "isAnyItemSelected",
    "keymap",
    "changePageSize",

    "searchChange",
    "cancle",
    "changeOrderBy",
    "categoryBtn",
    "from",
    "add_new_button",
    "to",
    "sortTitle",
    "add_new_title",
    "sort",
    "state_sort",
    "pagination",
    "search",
    "method_sort",
    "type_sort",
    "total",
    "perPage",
    "Filtered",
    "show",
    "sortOptions",
    "transactions_method",
    "transactions_state",
    "transactions_type",
    "transaction_filter",
    "category",
    "details",
    "attachment",
    "add_new",
    "pageSize",
    "reload" // this is for userList to reload the breadcrumb wherever user change the route between users lists
  ],
  data() {
    return {
      pageSizes: [1, 8, 12]
    };
  },
  methods: {
    add_New() {
      this.$emit("add_new");
    }
  }
};
</script>
