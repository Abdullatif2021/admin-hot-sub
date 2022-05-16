<template>
  <b-card b-refresh-button>
    <vue-perfect-scrollbar class="scroll dashboard-list-with-thumbs">
      <recent-order-item
        v-for="(order, index) in _ImageList"
        :order="order"
        :key="index"
        @delete_img="deleteImg"
      />
    </vue-perfect-scrollbar>
  </b-card>
</template>
<script>
import RecentOrderItem from "../../components/Listing/RecentOrderItem.vue";

export default {
  components: {
    "recent-order-item": RecentOrderItem
  },
  props: ["_ImageList"],
  data() {
    return {};
  },
  methods: {
    deleteImg(img_id) {
      this.$emit("deleteImage", img_id);
    }
  }
};
</script>
