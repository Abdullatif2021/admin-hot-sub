<template>
  <div>
    <datatable-heading
      :title="$t('menu.faq')"
      :add_new_button="true"
      :add_new_title="$t(`forms.new_faq`)"
      :sortOptions="sortOptions"
      :sortTitle="$t(`todo.orderbycategory`)"
      :searchChange="searchChange"
      @add_new="add_New"
      :categoryBtn="categoryName ? true : false"
      :reload="true"
      :categoryName="categoryName"
      :pagination="true"
      :changeOrderBy="changeOrderBy"
      :sort="sort"
      :Filtered="true"
    ></datatable-heading>
    <b-row>
      <!-- <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.faq')" />
        <b-button
          variant="primary"
          size="lg"
          :class="dir.isRtl ? 'top-faq-left-button' : 'top-faq-right-button'"
          >{{ $t(`forms.new_faq`) }}</b-button
        >
        <b-button
          variant="primary"
          size="lg"
          :class="
            dir.isRtl
              ? 'top-faq-category-left-button'
              : 'top-faq-category-right-button'
          "
          >{{ $t(`forms.edit`) }} {{ category }}</b-button
        >

        <div class="separator mb-5"></div>
      </b-colxx> -->
      <template v-if="_isLoadFaq">
        <b-colxx xxs="12" class="mb-4">
          <b-card
            no-body
            class="d-flex mb-3"
            v-for="(item, index) in faqData"
            :key="`faq_${index}`"
          >
            <div class="d-flex flex-grow-1 min-width-zero" role="tab">
              <b-button
                href="#"
                class="card-body  btn-empty btn-link list-item-heading text-left text-one"
                v-b-toggle="`faq_${index}`"
                variant="link"
                >{{ item.question }}</b-button
              >
              <div style="margin: 22px;">
                <b-button
                  variant="outline-theme-3"
                  class="icon-button"
                  style="margin-right: 8px;"
                  @click="modify(item.id)"
                >
                  <i class="simple-icon-pencil"></i>
                </b-button>
                <b-button
                  variant="outline-theme-6"
                  class="icon-button"
                  @click="open_model('deleteFaq', item.id)"
                >
                  <i class="simple-icon-trash"></i>
                </b-button>
              </div>
            </div>
            <b-collapse
              :id="`faq_${index}`"
              :visible="index === 0"
              accordion="faq-accordion"
              role="tabpanel"
            >
              <div
                class="card-body accordion-content pt-0"
                v-html="item.answer"
              />
            </b-collapse>
          </b-card>
        </b-colxx>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-row>
    <b-modal
      id="deleteFaq"
      ref="deleteFaq"
      :title="$t('modal.modal-delete-faq-title')"
    >
      {{ $t("forms.deleteFaqQuestion") }}
      <template slot="modal-footer">
        <b-button
          :disabled="deleteBtn"
          variant="primary"
          @click="delete_faq()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('deleteFaq')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { getDirection, getCurrentLanguage } from "../../../utils";
import { mapGetters, mapActions } from "vuex";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { adminRoot } from "../../../constants/config";

export default {
    components: {
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      faqData: [],
      categoryName: null,
      sort: {
        column: null,
        label: "All"
      },
      deleteBtn: false,
      category: "bull",
      sortOptions: [
        {
        column: null,
        label: "All"
      },
      ],
      language: null,
      faq_id: null,
      dir: null
    };
  },
  created() {
    this.dir = getDirection();
    this.language = getCurrentLanguage();
    this.getFaqs({category_id: null});
    this.getFaqCategory();
  },
  methods: {
       ...mapActions(["getFaqs", "updateFaq", "deleteFaq", "getFaqCategory"]),
    delete_faq() {
      this.deleteBtn = true;
      console.log("delete_faq");
      this.deleteFaq({faq_id: this.faq_id})
    },
    add_New(){
            this.$router.push({
        path: `${adminRoot}/faq/faq`
      });
    },
    modify(id){

      this.$router.push({
        path: `${adminRoot}/faq/faq`,
        query: { id: id }
      });
    },
    open_model(refName, id, active) {
      this.$refs[refName].show();
      this.faq_id = id;
    },
    hideModal(refName) {
      this.$refs[refName].hide();
    },
    searchChange(){

    },
    changeOrderBy(sort){
      console.log(sort);
      this.sort = sort;
      if (!sort.column) {
        this.categoryName= null
      }
      this.categoryName= sort.label

      this.getFaqs({
          category_id : sort.column,
        });
    },
  },
  computed: {
  ...mapGetters(["_Faqs", "_isLoadFaq", "_deleteFaqSuccessfuly", "_FaqCategories", "_FaqCategories"]),
  },
  watch: {
    _Faqs: function(val) {
      this.faqData = [];
         val.forEach(el => {
        this.faqData.push({
          question: el.locales.[this.language].question,
          answer: el.locales.[this.language].answer,
          id: el.id
        });
      });
    },
    _FaqCategories: function(val) {
         val.forEach(el => {
        this.sortOptions.push( new Object({
            column: el.id,
            label: el.locales.[this.language].title
          }));
      });
    },
    _deleteFaqSuccessfuly: function(val) {
        this.deleteBtn = false;
        this.$refs['deleteFaq'].hide();
        this.$notify(
        "success",
        "Operation completed successfully",
        "FAQ have been deleted successfully",
        { duration: 3000, permanent: false }
      );
    }
  }
};
</script>
