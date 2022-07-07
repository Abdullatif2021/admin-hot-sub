<template>
  <b-row>
    <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
      <datatable-heading
        :details="true"
        :reload="true"
        :transaction_filter="false"
        :add_new_button="showAddBtn"
        @add_new="add_newCustomField"
        :add_new_title="$t('todo.add-new-custom-filed')"
        :title="id ? $t('edit_category') : $t('create_category')"
      ></datatable-heading>
      <category_details
        @showAddCustomField="showAddCustomField"
        @createdSuccessfuly="createdSuccessfuly"
        :showCreateModal="showCreateModal"
        v-if="id"
        :_id="id"
        :_type="category"
      />
      <add_category v-if="!id" :_type="category" />
    </b-colxx>
  </b-row>
</template>

<script>
import category_details from "../../../components/shared/category_details.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import add_category from "../../../components/shared/add_category.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    category_details,
    add_category,

    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      category: "category",
      id: null,
      showAddBtn: false,
      showCreateModal: false
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  methods: {
    showAddCustomField(val) {
      this.showAddBtn = val;
    },
    add_newCustomField() {
      this.showCreateModal = true;
    },
    createdSuccessfuly() {
      this.showCreateModal = false;
    }
  },
  computed: {
    ...mapGetters(["_isLoadCustomField"])
  },
  watch: {
    _createCustomField: function(val) {
      console.log("frfrfrfrfrfrfrfr");
      this.showCreateModal = false;
    }
  }
};
</script>
