<template>
  <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
    <datatable-heading
      :details="true"
      :reload="true"
      :title="id ? $t('edit_block') : $t('create_block')"
    ></datatable-heading>

    <category_details v-if="id" :_id="id" :_type="blockCategory" />
    <add_category v-if="!id" :_type="blockCategory" />
  </b-colxx>
</template>

<script>
import category_details from "../../../components/shared/category_details.vue";
import add_category from "../../../components/shared/add_category.vue";

import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";

export default {
  components: {
    category_details,
    add_category,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      blockCategory: "block",
      id: null
    };
  },
  created() {
    this.id = this.$route.query.id;
  }
};
</script>
