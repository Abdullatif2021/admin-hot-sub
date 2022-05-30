<template>
  <b-row>
    <b-colxx xxs="12">
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <template v-if="_isLoadBlockCategoryMeta || _isLoadCategories">
            <b-card class="mb-4" no-body>
              <b-row>
                <b-colxx xs="12" md="6" class="mb-3">
                  <b-card>
                    <vuetable
                      ref="vuetable"
                      :api-mode="false"
                      :data-total="dataCount"
                      :per-page="perPage"
                      :reactive-api-url="true"
                      :fields="fields"
                      pagination-path
                    >
                      <template slot="actions" slot-scope="props">
                        <b-dropdown
                          id="langddm"
                          class="ml-2"
                          variant="light"
                          size="sm"
                          toggle-class="language-button"
                        >
                          <template #button-content>
                            <i class="simple-icon-settings"></i>
                          </template>
                          <b-dropdown-item
                            v-for="(item, index) in Options"
                            :key="index"
                            @click="
                              editAction(item.name, item.value, props.rowData)
                            "
                            >{{ item.name }}</b-dropdown-item
                          >
                        </b-dropdown>
                      </template>
                    </vuetable>
                  </b-card>
                  <!-- <vuetable-pagination-bootstrap
                      class="mt-4"
                      ref="pagination"
                      @vuetable-pagination:change-page="onChangePage"
                    /> -->
                </b-colxx>
                <b-colxx xs="12" md="6" class="mb-3">
                  <b-card
                    class="mb-4"
                    :title="edit ? $t('forms.edit') : $t('forms.create')"
                  >
                    <b-form
                      @submit.prevent="onValitadeFormSubmit()"
                      class="av-tooltip tooltip-label-right"
                    >
                      <b-form-group label="Option">
                        <b-form-select
                          :state="!$v.gridForm.select.$error"
                          v-model="$v.gridForm.select.$model"
                          :options="selectOptions"
                          plain
                        />

                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.select.required"
                          >Please select category type</b-form-invalid-feedback
                        >
                      </b-form-group>
                      <b-form-group label="English Content">
                        <b-textarea
                          :state="!$v.gridForm.en_detail.$error"
                          v-model="$v.gridForm.en_detail.$model"
                        ></b-textarea>
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.en_detail.required"
                          >Please enter English details</b-form-invalid-feedback
                        >
                      </b-form-group>
                      <b-form-group label="Arabic Content">
                        <b-textarea
                          :state="!$v.gridForm.ar_detail.$error"
                          v-model="$v.gridForm.ar_detail.$model"
                        ></b-textarea>
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.ar_detail.required"
                          >Please enter Arabic details</b-form-invalid-feedback
                        >
                      </b-form-group>
                      <b-button
                        :disabled="enable"
                        type="submit"
                        variant="primary"
                        class="mt-4"
                        >{{
                          edit ? $t("forms.save") : $t("forms.submit")
                        }}</b-button
                      >
                    </b-form>
                  </b-card>
                </b-colxx>
              </b-row>
            </b-card>
          </template>
          <template v-else>
            <div class="loading"></div>
          </template>
        </b-colxx>
      </b-row>
    </b-colxx>
  </b-row>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { mapGetters, mapActions } from "vuex";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../containers/appliaction/AddNewModal.vue";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");
import DatatableHeading from "../../containers/datatable/DatatableHeading.vue";

export default {
  props: ["id", "type"],
  components: {
    "add-new-modal": AddNewModal,
    "quill-editor": quillEditor,
    vuetable: Vuetable,
    "datatable-heading": DatatableHeading,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap
  },
  data() {
    return {
      pageId: null,
      pageData: null,
      _data: null,
      itemId: null,
      enable: false,
      meta_type_id: null,
      textarea: null,
      file: null,
      itemForEdit: null,
      selectOptions: [],

      // vue table-2
      Options: [
        { name: "EDIT", value: 1 },
        { name: "DELETE", value: 0 }
      ],
      sort: "",
      dataCount: 0,
      perPage: 12,
      search: "",
      from: 0,
      gridForm: {
        select: "",
        en_detail: "",
        ar_detail: "",
        id: ""
      },
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      selectedItems: [],
      edit: false,
      fields: [
        {
          name: "id",
          title: "ID",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "40%"
        },
        {
          name: "locales",
          callback: value => {
            return value.ar.meta_content;
          },
          title: "Arabic Content",
          titleClass: "",
          dataClass: "text-muted",
          width: "40%"
        },
        {
          name: "locales",
          callback: value => {
            return value.en.meta_content;
          },
          title: "English Content",
          titleClass: "",
          dataClass: "text-muted",
          width: "40%"
        },

        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ]
      // vue table-2
    };
  },
  mixins: [validationMixin],
  validations: {
    gridForm: {
      select: {
        required
      },
      ar_detail: {
        required
      },
      en_detail: {
        required
      }
    }
  },

  created() {
    console.log("hi from created", this.type);
    this.getMetaTypeList();
    this.type == "block"
      ? this.getBlockCategoryMetadata({ id: this.id })
      : this.getCategoryMetadata({ id: this.id });
  },

  methods: {
    ...mapActions([
      // block category
      "getBlockCategoryMetadata",
      "createBlockCategoryMetadata",
      "updateBlockCategoryMeta",
      "deleteBlockCategoryMetadata",
      "getMetaTypeList",
      // category
      "getCategoryMetadata",
      "createCategoryMetadata",
      "updateCategoryMetadata",
      "deleteCategoryMetadata"
    ]),

    onValitadeFormSubmit() {
      this.$v.$touch();
      this.$v.gridForm.$touch();
      if (!this.$v.gridForm.$invalid) {
        this.enable = true;
        console.log(this.gridForm.id);
        if (this.gridForm.id) {
          if (this.type === "block") {
            this.updateBlockCategoryMeta({
              meta_type_id: this.gridForm.select,
              id: this.id,
              metadata_id: this.gridForm.id,
              ar_content: this.gridForm.ar_detail,
              en_content: this.gridForm.en_detail
            });
          } else {
            this.updateCategoryMetadata({
              meta_type_id: this.gridForm.select,
              id: this.id,
              metadata_id: this.gridForm.id,
              ar_content: this.gridForm.ar_detail,
              en_content: this.gridForm.en_detail
            });
          }
        } else {
          if (this.type === "block") {
            this.createBlockCategoryMetadata({
              meta_type_id: this.gridForm.select,
              id: this.id,
              metadata_id: this.gridForm.id,
              ar_content: this.gridForm.ar_detail,
              en_content: this.gridForm.en_detail
            });
          } else {
            this.createCategoryMetadata({
              meta_type_id: this.gridForm.select,
              id: this.id,
              ar_content: this.gridForm.ar_detail,
              en_content: this.gridForm.en_detail
            });
          }
        }
      }
    },
    editAction(f, value, item) {
      if (value == 1) {
        this.edit = true;
        this.gridForm.id = item.id;
        this.gridForm.select = item.meta_type_id;
        this.gridForm.en_detail = item.locales.en.meta_content;
        this.gridForm.ar_detail = item.locales.ar.meta_content;
      } else {
        this.edit = false;
        this.gridForm.select = null;
        this.gridForm.en_detail = null;
        this.gridForm.ar_detail = null;
        this.type == "block"
          ? this.deleteBlockCategoryMetadata({
              id: this.id,
              metadata_id: item.id
            })
          : this.deleteCategoryMetadata({
              id: this.id,
              metadata_id: item.id
            });
      }
    }
  },
  computed: {
    ...mapGetters([
      "_blockCategoryMeta",
      "_updateblockCategoryMetaSuccess",
      "_blockMetaTypeList",
      "_isLoadBlockCategoryMeta",
      "_CategoryMeta",
      "_create_block_category_meta_success",
      "_isLoadBlockCategoryMeta",
      "_isLoadCategories",
      "_updateCategoryMetaSuccess"
    ])
  },
  watch: {
    _create_block_category_meta_success(newData, oldest) {
      console.log("_create_block_category_meta_success");
      this.enable = false;

      this.edit = false;
      this.gridForm.select = null;
      this.gridForm.en_detail = null;
      this.gridForm.ar_detail = null;
    },
    _blockCategoryMeta(newList, old) {
      console.log("_blockCategoryMeta");
      this.enable = false;

      this.edit = false;
      this.gridForm.select = null;
      this.gridForm.en_detail = null;
      this.gridForm.ar_detail = null;
      this.$refs.vuetable.setData(newList);
    },
    _CategoryMeta(newList, old) {
      console.log("_CategoryMeta");
      this.enable = false;

      this.edit = false;
      this.gridForm.select = null;
      this.gridForm.en_detail = null;
      this.gridForm.ar_detail = null;
      this.$refs.vuetable.setData(newList);
    },
    _updateblockCategoryMetaSuccess(newActions, old) {
      console.log("_updateMetaPage");
      this.enable = false;

      this.edit = false;
      this.gridForm.select = null;
      this.gridForm.en_detail = null;
      this.gridForm.ar_detail = null;
    },
    _updateCategoryMetaSuccess(newActions, old) {
      console.log("_updateMetaPage");
      this.enable = false;

      this.edit = false;
      this.gridForm.select = null;
      this.gridForm.en_detail = null;
      this.gridForm.ar_detail = null;
    },
    _blockMetaTypeList(newContent, old) {
      console.log("_blockMetaList");
      newContent.forEach(option => {
        this.selectOptions.push(
          new Object({
            value: option.id,
            text: option.type
          })
        );
      });
    }
  }
};
</script>
