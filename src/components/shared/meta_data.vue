<template>
  <b-row>
    <b-colxx xxs="12">
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <template v-if="_isLoadBlockCategoryMeta || _isLoadCategories">
            <b-card style="box-shadow: none; background: none;" class="mb-4" no-body>
              <b-row>
                <b-colxx xs="12" md="6" class="mb-3">
                  <b-card style="
    border-radius: 15px;
">
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
                    style="
    border-radius: 15px;
"
                    :title="edit ? $t('forms.edit') : $t('forms.create')"
                  >
                    <b-form
                      @submit.prevent="onValitadeFormSubmit()"
                      class="av-tooltip tooltip-label-right"
                    >
                      <b-form-group
                        class="has-float-label mb-4"
                        :label="$t('forms.type')"
                      >
                        <b-form-select
                          :state="!$v.select_form.select.$error"
                          v-model="$v.select_form.select.$model"
                          :options="selectOptions"
                          plain
                        />

                        <b-form-invalid-feedback
                          v-if="!$v.select_form.select.required"
                          >{{
                            $t("forms.category_type_select")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                      <div
                        v-for="(lang, index) in $v.meta_form.$each.$iter"
                        :key="index"
                      >
                        <b-form-group
                          :label="$t(`forms.${lang.name.$model}_content`)"
                          class="has-float-label mb-4"
                        >
                          <b-form-input
                            type="text"
                            v-model="lang.content.$model"
                            :state="!lang.content.$error"
                          />
                          <b-form-invalid-feedback
                            v-if="!lang.content.required"
                            >{{
                              $t("forms.content_message")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </div>
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
import { getCurrentLanguage } from "../../utils";

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
      language: null,
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
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      meta_form: [],
      select_form: {
        select: null
      },

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
            return value[this.language].meta_content;
          },
          title: "Content",
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
    meta_form: {
      $each: {
        content: {
          required
        },
        name: {}
      },
      id: {}
    },
    select_form: {
      select: { required }
    }
  },

  created() {
    this.language = getCurrentLanguage();
    this.langs = localStorage.getItem("Languages");
    this.getCategoryMetaTypeList();
    this.type == "block"
      ? this.getBlockCategoryMetadata({ id: this.id })
      : this.getCategoryMetadata({ id: this.id });
    this.make_collaction(this.langs, this.meta_form);
  },

  methods: {
    ...mapActions([
      // block category
      "getBlockCategoryMetadata",
      "createBlockCategoryMetadata",
      "updateBlockCategoryMeta",
      "deleteBlockCategoryMetadata",
      "getCategoryMetaTypeList",
      // category
      "getCategoryMetadata",
      "createCategoryMetadata",
      "updateCategoryMetadata",
      "deleteCategoryMetadata"
    ]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          content: "",
          name: el.name
        });
      });
    },
    onValitadeFormSubmit() {
      this.$v.$touch();
      this.$v.meta_form.$touch();
      this.$v.select_form.$touch();
      if (!this.$v.meta_form.$invalid && !this.$v.select_form.$invalid) {
        this.enable = true;
        if (this.meta_form.id) {
          if (this.type === "block") {
            this.updateBlockCategoryMeta({
              id: this.id,
              metadata_id: this.meta_form.id,
              meta_type_id: this.select_form.select,
              info: this.$v.meta_form.$model
            });
          } else {
            this.updateCategoryMetadata({
              id: this.id,
              metadata_id: this.meta_form.id,

              meta_type_id: this.select_form.select,
              info: this.$v.meta_form.$model
            });
          }
        } else {
          if (this.type === "block") {
            this.createBlockCategoryMetadata({
              id: this.id,
              meta_type_id: this.select_form.select,
              info: this.$v.meta_form.$model
            });
          } else {
            this.createCategoryMetadata({
              id: this.id,
              meta_type_id: this.select_form.select,
              info: this.$v.meta_form.$model
            });
          }
        }
      }
    },
    editAction(f, value, item) {
      if (value == 1) {
        this.edit = true;
        this.meta_form.id = item.id;

        this.select_form.select = item.meta_type_id;
        this.meta_form.forEach(el => {
          el.content = item.locales[el.name].meta_content;
        });
      } else {
        this.edit = false;
        this.select_form.select = null;
        this.meta_form.forEach(el => {
          el.content = null;
        });
        this.$v.$reset()
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
      "_errorCate",
      "_updateblockCategoryMetaSuccess",
      "_categoryMetaTypeList",
      "_isLoadBlockCategoryMeta",
      "_CategoryMeta",
      "_errorCategory",
      "_create_block_category_meta_success",
      "_isLoadBlockCategoryMeta",
      "_isLoadCategories",
      "_updateCategoryMetaSuccess"
    ])
  },
  watch: {
    _errorCategory: function(val){
      this.$notify(
        "error",
        "Something went wrong",
        "Please try again",
        { duration: 4000, permanent: false }
      );
      this.enable = false;
    },
    _create_block_category_meta_success(newData, oldest) {
      this.enable = false;

      this.edit = false;
      this.meta_form.forEach(el => {
        el.content = null;
      });
      this.select_form.select = null;
      this.$v.$reset()
    },
    _create_category_meta_success: function(val){
      this.enable = false;
      this.edit = false;
      this.meta_form.forEach(el => {
        el.content = null;
      });
      this.select_form.select = null;
      this.$v.$reset()
    },
    _blockCategoryMeta(newList, old) {
      this.$refs.vuetable.setData(newList);
      this.enable = false;

      this.edit = false;
      this.meta_form.forEach(el => {
        el.content = null;
      });
      this.select_form.select = null;
      this.$v.$reset()

    },
    _CategoryMeta(newList, old) {
      this.enable = false;

      this.edit = false;
      this.meta_form.forEach(el => {
        el.content = null;
      });
      this.select_form.select = null;
      this.$v.$reset()
      this.$refs.vuetable.setData(newList);
    },
    _updateblockCategoryMetaSuccess(newActions, old) {
      this.enable = false;
      this.meta_form.id = null;
      this.edit = false;
      this.meta_form.forEach(el => {
        el.content = null;
      });
      this.select_form.select = null;
      this.$v.$reset()
    },
    _updateCategoryMetaSuccess(newActions, old) {
      this.enable = false;
      this.meta_form.id = null;
      this.edit = false;
      this.meta_form.forEach(el => {
        el.content = null;
      });
      this.select_form.select = null;
      this.$v.$reset()
    },
    _categoryMetaTypeList(newContent, old) {
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
