<template>
  <b-row>
    <template v-if="isLoad">
      <b-colxx xs="12" md="6" class="mb-3">
        <b-card>
          <vuetable
            ref="vuetable"
            :api-mode="false"
            :reactive-api-url="true"
            :fields="fields"
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
                  @click="editAction(item.name, item.value, props.rowData)"
                  >{{ $t(item.name) }}</b-dropdown-item
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
            <b-form-group :label="$t('forms.type')">
              <b-form-select
                :state="!$v.select_form.select.$error"
                v-model="$v.select_form.select.$model"
                :options="selectOptions"
                plain
              />
              <b-form-invalid-feedback v-if="!$v.select_form.select.required">{{
                $t("forms.select_massege")
              }}</b-form-invalid-feedback>
            </b-form-group>
            <div v-for="(lang, index) in $v.meta_form.$each.$iter" :key="index">
              <b-form-group
                :label="$t(`forms.${lang.name.$model}_content`)"
                class="has-float-label mb-4"
              >
                <b-form-input
                  type="text"
                  v-model="lang.content.$model"
                  :state="!lang.content.$error"
                />
                <b-form-invalid-feedback v-if="!lang.content.required">{{
                  $t("forms.content_massege")
                }}</b-form-invalid-feedback>
              </b-form-group>
            </div>

            <b-button
              type="submit"
              :disabled="enable"
              variant="primary"
              class="mt-4"
              >{{ edit ? $t("forms.save") : $t("forms.submit") }}</b-button
            >
          </b-form>
        </b-card>
      </b-colxx>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </b-row>
</template>

<script>
import { validationMixin } from "vuelidate";
import Vuetable from "vuetable-2/src/components/Vuetable";
const { required } = require("vuelidate/lib/validators");
import { getCurrentLanguage } from "../../utils";

export default {
  props: ["isLoad", "list", "meta_type_list"],
  components: {
    vuetable: Vuetable
  },
  data() {
    return {
      selectOptions: [],
      edit: false,
      enable: false,
      itemId: null,
      meta_form: [],
      Options: [
        { name: "EDIT", value: 1 },
        { name: "DELETE", value: 0 }
      ],
      select_form: {
        select: null
      },
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
            return value.[this.language].meta_content;
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
      }
    },
    select_form: {
      select: { required }
    }
  },
  created() {
    this.language = getCurrentLanguage();
    this.langs = localStorage.getItem("Languages");
    console.log("Languages", this.langs);
    this.make_collaction(this.langs, this.meta_form);
  },
  methods: {
    make_collaction(langs, form) {
      console.log(langs, form);
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
        if (!this.edit) {
          this.$emit(
            "create-meta",
            this.select_form.select,
            this.$v.meta_form.$model
          );
        } else {
          this.$emit(
            "update-meta",
            this.select_form.select,
            this.$v.meta_form.$model,
            this.itemId
          );
        }
      }
    },
    editAction(f, value, item) {
      if (value == 1) {
        this.edit = true;
        this.itemId = item.id;
        this.select_form.select = item.meta_type_id;
        this.meta_form.forEach(el => {
          console.log(item);
          el.content = item.locales.[el.name].meta_content;
        });
      } else {
        this.edit = false;
        this.select_form.select = null;
        this.meta_form.forEach(el => {
          el.content = null;
        });
        this.$emit("delete-meta", item.id);
      }
    }
  },
  watch: {
    list: function(val) {
      this.enable = false;
      this.select_form.select = null;
      this.meta_form.forEach(el => {
        el.content = null;
      });
      // this.$v.select_form.$reset()
      this.$refs.vuetable.setData(val);
      this.$v.$reset()
    },
    meta_type_list: function(val) {
      val.forEach(option => {
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
