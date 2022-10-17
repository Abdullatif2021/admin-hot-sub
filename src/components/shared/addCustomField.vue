<template>
  <b-modal
    id="add_newCustomField"
    ref="add_newCustomField"
    :title="$t('todo.add-new-custom-filed')"
    :modal-class="modalClass"
    :hide-backdrop="true"
    :no-close-on-backdrop="true"
  >
    <form class="av-tooltip tooltip-label-right">
      <b-form-group :label="$t('forms.type')">
        <b-form-input
          type="text"
          style="display: none;"
          :state="!$v.select_form.type.$error"
          v-model="$v.select_form.type.$model"
        />
        <b-form-radio-group v-model="selected" @change="typeSelect">
          <b-form-radio value="1">{{ $t("TEXT") }}</b-form-radio>
          <b-form-radio value="2">{{ $t("NUMBER") }}</b-form-radio>
        </b-form-radio-group>

        <b-form-invalid-feedback
          style="margin-left: 30%;"
          v-if="!$v.select_form.type.required"
          >{{ $t("forms.category_filed") }}</b-form-invalid-feedback
        >
      </b-form-group>
      <div v-for="(lang, index) in $v.keys_form.$each.$iter" :key="index">
        <b-form-group
          :label="$t(`pages.${lang.name.$model}_title`)"
          class="has-float-label mb-4"
        >
          <b-form-input
            type="text"
            v-model="lang.key.$model"
            :state="!lang.key.$error"
          />
          <b-form-invalid-feedback v-if="!lang.key.required">{{
            $t(`forms.${lang.name.$model}_key_filed`)
          }}</b-form-invalid-feedback>
        </b-form-group>
      </div>
      <div v-if="showUpdateModal" class="deleteBtnContainer">
        <b-button
        variant="outline-theme-6"
        :disabled="enable"
        @click="deleteCustom()"
        class="mr-1"
        >{{ $t("forms.delete") }}</b-button
      >
      </div>
    </form>
    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="hideModal('add_newCustomField')"
        >{{ $t("survey.cancel") }}</b-button
      >
      <b-button
        variant="primary"
        :disabled="enable"
        @click="formSubmit()"
        class="mr-1"
        >{{ $t("survey.submit") }}</b-button
      >
    </template>
  </b-modal>
</template>

<script>
const { required } = require("vuelidate/lib/validators");
import { validationMixin } from "vuelidate";

export default {
    props: {
    showCreateModal: { type: Boolean },
    hideCustomModal: { type: Boolean },
    showUpdateModal: { type: Boolean },
    customFieldInfo: {  },
    modalClass: { type: String, default: "modal-right"},

  },
  // props: ["showCreateModal","hideCustomModal", "customFieldInfo", "showUpdateModal"],
  data() {
    return {
      keys_form: [],
      enable: false,
      editCustomField: false,
      selected: null,
      select_form: {
        type: null
      },
      Options: [
        { name: "TEXT", value: 1 },
        { name: "NUMBER", value: 0 }
      ]
    };
  },
  mixins: [validationMixin],
  validations: {
    keys_form: {
      $each: {
        key: {
          required
        },
        name: {}
      }
    },
    select_form: {
      type: { required }
    }
  },
  created() {
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.keys_form);
  },
  methods: {
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          key: "",
          name: el.name
        });
      });
    },
    typeSelect(val) {
      if (val == 1) {
        this.select_form.type = "STRING";
      } else {
        this.select_form.type = "INT";
      }
    },
    hideModal(refname) {
      this.$refs[refname].hide();
      this.$v.$reset();
      // this.$emit("hide-create-modal");
    },
    deleteCustom(){
      this.$emit(
          "delete-custom-field",
          this.customFieldInfo.id
        );
    },
    formSubmit() {
      this.$v.$touch();
      this.$v.select_form.$touch();
      this.$v.keys_form.$touch();
      if (!this.$v.keys_form.$invalid && !this.$v.select_form.$invalid) {
        this.enable = true;
        if (this.editCustomField) {
           this.$emit(
          "update-custom-field",
          this.$v.keys_form.$model,
          this.select_form.type,
          this.customFieldInfo.id

        );
        }else{
  this.$emit(
          "create-custom-field",
          this.$v.keys_form.$model,
          this.select_form.type
        );
        }


      }
    }
  },
  watch: {
    showCreateModal: function(val) {
        this.editCustomField = false;;
      this.select_form.type = null;
       this.keys_form.forEach(el => {
         el.key = null;
      });
      this.enable = false;
        this.$refs["add_newCustomField"].show();
       this.$v.$reset();
    },
    showUpdateModal: function(val) {
      this.enable = false;
      this.$refs["add_newCustomField"].show();
    },
    customFieldInfo: function(val) {
        this.editCustomField = true;
        this.select_form.type = val.type;
        this.keys_form.forEach(el => {
        el.key = val.locales[el.name].name;
            });
        val.type === "INT" ?  this.selected = 2 : this.selected = 1;
    },
    hideCustomModal: function(val) {
      this.$refs["add_newCustomField"].hide();
      this.select_form.type = null;
       this.keys_form.forEach(el => {
         el.key = null;
      });
      this.editCustomField = false;
      this.enable = false;
       this.$v.$reset();
    }
  }
};
</script>
