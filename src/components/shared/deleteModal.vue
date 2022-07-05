<template>
  <b-modal
    id="deleteModal"
    ref="deleteModal"
    :title="$t('modal.modal-delete-category-title')"
  >
    {{ message }}
    <template slot="modal-footer">
      <b-button variant="primary" @click="$emit('delete_event')" class="mr-1">
        {{ $t("button.yes") }}</b-button
      >
      <b-button variant="secondary" @click="hideModal('deleteModal')">{{
        $t("button.no")
      }}</b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  props: ["message", "modalName", "hideModel"],
  data() {
    return {
      refname: "deleteModal"
    };
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    }
  },
  watch: {
    modalName: function(val) {
      this.$refs[val].show();
    },
    hideModel: function(val) {
      this.hideModal(this.refname);
    }
  }
};
</script>
