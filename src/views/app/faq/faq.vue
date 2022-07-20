<template>
  <div>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.faq')" />

      <div class="separator mb-5"></div>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card class="mb-4">
        <template v-if="isLoadFaq">
          <b-form @submit.prevent="onGridFormSubmit">
            <div v-for="(lang, index) in $v.lang_form.$each.$iter" :key="index">
              <b-colxx sm="12">
                <b-form-group
                  class="has-float-label mb-4"
                  :label="$t(`forms.${lang._name.$model}_question`)"
                >
                  <b-form-input
                    type="text"
                    :state="!lang.question.$error"
                    v-model="lang.question.$model"
                  />
                  <b-form-invalid-feedback v-if="!lang.question.required">{{
                    $t("forms.question_filed")
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="12">
                <b-form-group
                  class="has-float-label mb-4"
                  :label="$t(`forms.${lang._name.$model}_answer`)"
                >
                  <b-form-input
                    type="text"
                    :state="!lang.answer.$error"
                    v-model="lang.answer.$model"
                  />
                  <b-form-invalid-feedback v-if="!lang.answer.required">
                    {{ $t("forms.answer_filed") }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
            </div>
            <b-colxx sm="12">
              <b-form-group
                class="has-float-label mb-4"
                :label="$t('forms.category')"
              >
                <b-form-select
                  :state="!$v.select_form.select.$error"
                  v-model="$v.select_form.select.$model"
                  :options="categoryOptions"
                  plain
                />
                <b-form-invalid-feedback
                  v-if="!$v.select_form.select.required"
                  >{{
                    $t("forms.category_type_select")
                  }}</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>
            <b-button
              :disabled="enable"
              type="submit"
              variant="primary"
              class="mt-4"
              >{{ $t("forms.save") }}</b-button
            >
          </b-form>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-card>
    </b-colxx>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { getCurrentLanguage } from "../../../utils";
const { required, requiredIf } = require("vuelidate/lib/validators");
import { adminRoot } from "../../../constants/config";

export default {

  data() {
    return {
        language: null,
        isLoadFaq: false,
        enable: false,
        lang_form: [],
        select_form: {
            select: null
        },
        faqId: null,
        categoryOptions: []
    };
  },
   mixins: [validationMixin],
  validations: {
    lang_form: {
      $each: {
        question: {
          required
        },
        answer: {
            required
            },
        _name: {}
      }
    },
    select_form: {
        select: {required}
    }
    },
  created() {
       this.language = getCurrentLanguage();
    this.faqId = this.$route.query.id;
    if (this.faqId) {
        this.getFaq({faqId: this.faqId})
    }
     this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.lang_form);
        this.getFaqCategory();

  },
  methods: {
     ...mapActions([
      "getFaq",
      "getFaqCategory",
      "createFaq",
      "updateFaq"

    ]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          question: "",
          answer: "",
          _name: el.name
        });
      });
    },
    onGridFormSubmit() {
      this.$v.$touch();
      this.$v.lang_form.$touch();
      this.$v.select_form.$touch();
      if (
        !this.$v.select_form.$invalid &&
        !this.$v.lang_form.$invalid
      ) {
        this.enable = true;
        if (this.faqId) {
            this.updateFaq({info : this.$v.lang_form.$model,
          category_id: this.select_form.select})
        }else{
              this.createFaq({info : this.$v.lang_form.$model,
          category_id: this.select_form.select})
        }
      }
    },
  },
  computed: {
    ...mapGetters(["_Faq", "_isLoadFaq", "_updateFaqSuccessfuly", "_createFaqSuccessfuly", "_FaqCategories"])
  },
  watch: {
    _Faq: function(val){
        console.log(val);

         this.lang_form.forEach(el => {
           el.question = val[0].locales.[el._name].question;
          el.answer = val[0].locales.[el._name].answer;

      })
      this.select_form.select = val[0].category_id;
          },
        _FaqCategories: function(val) {
         val.forEach(el => {
        this.categoryOptions.push(
          new Object({
            value: el.id,
            text: el.locales.[this.language].title
          })
        );
      });
      this.isLoadFaq = true;
    },
    _createFaqSuccessfuly: function(val){
        this.$notify(
        "success",
        "Operation completed successfully",
        "FAQ have been created successfully",
        { duration: 3000, permanent: false }
      );
      this.enable = false;
       this.$router.push({
        path: `${adminRoot}/faq`,
      });
    },
    _updateFaqSuccessfuly: function(val){
  this.$notify(
        "success",
        "Operation completed successfully",
        "FAQ have been updated successfully",
        { duration: 3000, permanent: false }
      );
      this.$router.push({
        path: `${adminRoot}/faq`,
      });
      this.enable = false;
    }
  }
};
</script>
