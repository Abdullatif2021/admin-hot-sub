<template>
  <div>
    <router-view></router-view>
    <div v-show="!_isNavigationON">
      <datatable-heading
        :title="$t('menu.faq-categories-table')"
        :searchChange="searchChange"
        @add_new="add_New('categoryDetials')"
        :transaction_filter="false"
        :reload="true"
        :pagination="true"
        :sort="sort"
        :add_new_button="true"
        :add_new_title="$t('todo.add-new')"
        :Filtered="false"
      ></datatable-heading>
      <b-row>
        <b-colxx xxs="12">
          <template v-if="_isLoadFaq">
            <vuetable
              ref="vuetable"
              class="table-divided order-with-arrow"
              :api-mode="false"
              :reactive-api-url="true"
              :fields="fields"
              pagination-path
              @vuetable:pagination-data="onPaginationData"
            >
              <template slot="actions" slot-scope="props">
                <b-button
                  variant="outline-theme-3"
                  class="icon-button"
                  style="margin-right: 8px;"
                  @click="modify('categoryDetials', props.rowData.id)"
                >
                  <i class="simple-icon-pencil"></i>
                </b-button>
                <b-button
                  variant="outline-theme-6"
                  class="icon-button"
                  @click="open_model('deleteFaqCate', props.rowData.id)"
                >
                  <i class="simple-icon-trash"></i>
                </b-button>
              </template>
            </vuetable>
          </template>
          <template v-else>
            <div class="loading"></div>
          </template>
        </b-colxx>
      </b-row>
      <b-modal
        id="categoryDetials"
        ref="categoryDetials"
        :title="
          isEditCategory
            ? $t('pages.edit-faq-category')
            : $t('pages.add-new-category')
        "
        modal-class="modal-right"
      >
        <template v-if="_categoryProssing">
          <form>
            <div
              v-for="(lang, index) in $v.category_form.$each.$iter"
              :key="index"
            >
              <b-form-group
                :label="$t(`pages.${lang.name.$model}_title`)"
                class="has-float-label mb-4"
              >
                <b-form-input
                  type="text"
                  v-model="lang.title.$model"
                  :state="!lang.title.$error"
                />
                <b-form-invalid-feedback v-if="!lang.title.required">{{
                  $t("forms.title_filed")
                }}</b-form-invalid-feedback>
              </b-form-group>
            </div>
          </form>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
        <template slot="modal-footer">
          <b-button
            variant="outline-secondary"
            @click="hideModal('categoryDetials')"
            >{{ $t("survey.cancel") }}</b-button
          >
          <b-button
            :disabled="enable"
            variant="primary"
            @click="formSubmit()"
            class="mr-1"
            >{{ $t("survey.submit") }}</b-button
          >
        </template>
      </b-modal>
      <b-modal
        id="deleteFaqCate"
        ref="deleteFaqCate"
        :title="$t('modal.modal-delete-faq-category-title')"
      >
        {{ $t("forms.deleteCategoryQuestion") }}
        <template slot="modal-footer">
          <b-button
            :disabled="deleteBtn"
            variant="primary"
            @click="delete_faq_category()"
            class="mr-1"
          >
            {{ $t("button.yes") }}</b-button
          >
          <b-button variant="secondary" @click="hideModal('deleteFaqCate')">{{
            $t("button.no")
          }}</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { adminRoot } from "../../../constants/config";
import store from "../../../store";
const { required, requiredIf } = require("vuelidate/lib/validators");
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      isLoad: false,
      sort: "",
      deleteBtn: false,
      page: 1,
      isEditCategory: false,
      search: null,
      perPage: 8,
      search: "",
      from: 0,
      category_form: [],
      enable: false,
      category_id: null,
      isNavigate: false,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],

      fields: [
        {
          name: "id",
          title: "ID",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "locales",
          callback: value => {
            return value.ar.title;
          },
          sortField: "sales",
          title: "Ar title",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "locales",
          callback: value => {
            return value.en.title;
          },
          sortField: "title",
          title: "En title",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "created_at",
          title: "Created at",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ]
    };
  },
    mixins: [validationMixin],
  validations: {
    category_form: {
      $each: {
        title: {
          required
        },
        name: {}
      }
    }
  },
  created() {
    this.getFaqCategories({search: null});
      this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs);
  },
  methods: {
    ...mapActions(["getFaqCategories", "deleteFaqCategory", "getFaqCategory", "createFaqCategory", "updateFaqCategory"]),
       make_collaction(langs) {
      JSON.parse(langs).forEach(el => {
        this.category_form.push({
          title: "",
          name: el.name
        });
      });
    },
    onPaginationData(paginationData) {
      console.log(paginationData);
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    modify(name, id){
           this.category_form.forEach(el => {
        (el.title = null)
      });
      this.$v.$reset();
        this.$refs[name].show();
         this.enable = false;
        this.isEditCategory = true;
        this.getFaqCategory({category_id : id})
        this.category_id = id;
    },
    onChangePage(page) {},
    add_New(name) {
         this.enable = false;
        this.$refs[name].show();
        this.category_form.forEach(el => {
        (el.title = null)
      });
      this.$v.$reset();
    this.isEditCategory = false;
    },
      hideModal(refname) {
      this.$refs[refname].hide();
    },
    changePageSize(perPage) {
      this.perPage = perPage;
    },
    open_model(refName, id, active) {
      this.$refs[refName].show();
      this.category_id = id;
    },
    formSubmit(){
      this.$v.$touch();
      this.$v.category_form.$touch();
      if (!this.$v.category_form.$invalid) {
        this.enable = true;
        if (this.isEditCategory) {
            this.updateFaqCategory({info: this.$v.category_form.$model, category_id: this.category_id})
        }else{
            this.createFaqCategory({info: this.$v.category_form.$model})
        }
      }
    },
    searchChange(val) {
      this.search = val;
      this.getFaqCategories({search: val});
    },
    delete_faq_category() {
      this.deleteBtn = true;
      this.deleteFaqCategory({ category_id: this.category_id });
    }
  },
  computed: {
    ...mapGetters([
      "_FaqCategories",
      "_isLoadFaq",
      "_deleteFaqCategorySuccess",
      "_isNavigationON",
      "_faqCategory",
      "_categoryProssing",
      "_updateFaqCategory",
      "_createFaqCategory"
    ])
  },
  watch: {
    _FaqCategories: function(val) {
      this.$refs.vuetable.setData(val);
    },
    _deleteFaqCategorySuccess: function(val) {
      this.getFaqCategories({search: null});
      this.$refs["deleteFaqCate"].hide();
      this.deleteBtn = false;

      this.$notify(
        "success",
        "Operation completed successfully",
        "FAQ Category have been deleted successfully",
        { duration: 3000, permanent: false }
      );

    },
    _updateFaqCategory: function(val){
        this.getFaqCategories({search: null});
        this.enable = false;
  this.$notify(
        "success",
        "Operation completed successfully",
        "FAQ Category have been updated successfully",
        { duration: 3000, permanent: false }
      );
       this.$refs["categoryDetials"].hide();
          this.category_form.forEach(el => {
        (el.title = null)
      });
      this.$v.$reset();
    },
    _createFaqCategory: function(val){
        this.getFaqCategories({search: null});
        this.enable = false;
    this.$notify(
        "success",
        "Operation completed successfully",
        "FAQ Category have been created successfully",
        { duration: 3000, permanent: false }
      );
       this.$refs["categoryDetials"].hide();
          this.category_form.forEach(el => {
        (el.title = null)
      });
      this.$v.$reset();
    },
    _isNavigationON: function(val) {
      console.log(val);
    },
    _faqCategory: function(val){
        console.log(val);
    this.category_form.forEach(el => {
            el.title = val.locales.[el.name].title;

        })
        }

  }
};
</script>
