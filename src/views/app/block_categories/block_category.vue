<template>
  <category_details :_id="id" :_type="blockCategory" />
</template>

<script>
import category_details from "../../../components/shared/category_details.vue";
export default {
  components: {
    category_details
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
