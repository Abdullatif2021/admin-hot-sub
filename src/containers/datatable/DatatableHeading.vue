<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ title }}</h1>
      <div class="top-right-button-container">
        <b-button
          v-if="!details && !add_new"
          v-b-modal.modalright
          variant="primary"
          size="lg"
          class="top-right-button"
          @click="add_New()"
          >{{ $t("todo.add-new") }}</b-button
        >
      </div>
      <piaf-breadcrumb v-if="reload" />
      <div v-if="!details || !show" class="mb-2 mt-2">
        <b-collapse id="displayOptions" class="d-md-block">
          <div v-if="reload" class="d-block d-md-inline-block pt-1">
            <b-dropdown
              v-if="Filtered"
              id="ddown1"
              :text="
                category
                  ? `${$t('todo.orderbycategory')} ${$t(sort.label)}`
                  : `${$t('todo.orderbyrole')} ${$t(sort.label)}`
              "
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

            <div class="search-sm d-inline-block float-md-left mr-1 align-top">
              <b-input
                :placeholder="$t('menu.search')"
                @input="val => searchChange(val)"
              />
            </div>
            <!-- <i @click="cancle()" class="simple-icon-close" /> -->
          </div>
          <div class="float-md-right pt-1">
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
      <div class="separator mb-5" />
    </b-colxx>
  </b-row>
</template>
<script>
export default {
  props: [
    "title",
    "selectAll",
    "isSelectedAll",
    "isAnyItemSelected",
    "keymap",
    "changePageSize",
    "searchChange",
    "cancle",
    "changeOrderBy",
    "from",
    "to",
    "sort",
    "total",
    "perPage",
    "Filtered",
    "show",
    "sortOptions",
    "category",
    "details",
    "add_new",
    "reload"
  ],
  data() {
    return {
      categories: [
        {
          label: "Cakes",
          value: "Cakes"
        },
        {
          label: "Cupcakes",
          value: "Cupcakes"
        },
        {
          label: "Desserts",
          value: "Desserts"
        }
      ],
      statuses: [
        {
          text: "ON HOLD",
          value: "ON HOLD"
        },
        {
          text: "PROCESSED",
          value: "PROCESSED"
        }
      ],

      pageSizes: [4, 8, 12]
    };
  },
  methods: {
    add_New() {
      this.$emit("add_new");
    }
  }
};
</script>
