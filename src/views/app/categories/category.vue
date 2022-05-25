<template>
  <b-row>
    <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
      <datatable-heading
        :details="true"
        :reload="true"
        :title="$t(category)"
      ></datatable-heading>

      <category_details :_id="id" :_type="category" />
    </b-colxx>
  </b-row>
</template>

<script>
import category_details from "../../../components/shared/category_details.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";

export default {
  components: {
    category_details,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      category: null,
      id: null
    };
  },
  created() {
    this.id = this.$route.query.id;
    console.log(this.id);
    if (this.id) {
      this.category = "edit_category";
    } else {
      this.category = "create_category";
    }
  }
};
</script>
