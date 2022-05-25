<template>
  <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
    <datatable-heading
      :details="true"
      :reload="true"
      :title="$t(blockCategory)"
    ></datatable-heading>

    <category_details :_id="id" :_type="blockCategory" />
  </b-colxx>
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
      blockCategory: null,
      id: null
    };
  },
  created() {
    this.id = this.$route.query.id;
    console.log(this.id);
    if (this.id) {
      this.blockCategory = "edit_block";
    } else {
      this.blockCategory = "create_block";
    }
  }
};
</script>
