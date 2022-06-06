<template>
  <div class="d-flex flex-row mb-3">
    <div class="d-block position-relative">
      <img
        :src="order.path"
        :alt="order.locales.en.title"
        class="list-thumbnail border-0"
      />
    </div>
    <div class="pl-3 pt-2 pr-2 pb-2" style="width: 100%;">
      <p class="list-item-heading">{{ order.locales.en.title }}</p>
      <div class="pr-4">
        <p class="text-muted mb-1 text-small">
          {{ order.locales.en.description }}
        </p>
      </div>
      <div class="text-primary text-small font-weight-medium d-none d-sm-block">
        {{ order.created_at }}
      </div>
      <div class="pr-4" :style="BtnStyle">
        <i
          @click="delete_img(order.id)"
          class="simple-icon-trash"
          style="font-size: 23px;color: red; cursor: pointer;"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getDirection } from "../../utils";
export default {
  props: ["order"],
  data() {
    return {
      BtnStyle: null
    };
  },
  created() {
    const direction = getDirection();
    if (direction.isRtl) {
      this.BtnStyle = `float: left;margin-top: -29px;`;
    } else {
      this.BtnStyle = `float: right;margin-top: -29px;`;
    }
  },
  methods: {
    delete_img(id) {
      this.$emit("delete_img", id);
    }
  }
};
</script>
