<template>
  <b-row>
    <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
      <datatable-heading
        :details="true"
        :reload="true"
        :transaction_filter="false"
        :add_new_button="false"
        :title="id ? $t('edit_category') : $t('create_category')"
      ></datatable-heading>
      <category_details v-if="id" :_id="id" :_type="category" />
      <add_category v-if="!id" :_type="category" />
    </b-colxx>
  </b-row>
</template>

<script>
import category_details from "../../../components/shared/category_details.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import add_category from "../../../components/shared/add_category.vue";

export default {
  components: {
    category_details,
    add_category,

    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      category: "category",
      id: null
    };
  },
  created() {
    this.id = this.$route.query.id;
  }
};
</script>
