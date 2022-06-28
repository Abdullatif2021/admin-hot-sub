<template>
  <b-row>
    <template v-if="isLoad">
      <b-colxx xs="12" md="6" class="mb-3">
        <b-card>
          <vuetable
            ref="vuetable"
            :api-mode="false"
            :reactive-api-url="true"
            :fields="youtube_fields"
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
                  v-for="(item, index) in youtube_Options"
                  :key="index"
                  @click="youtube_Action(item.value, props.rowData)"
                  >{{ $t(item.name) }}</b-dropdown-item
                >
              </b-dropdown>
            </template>
          </vuetable>
        </b-card>
      </b-colxx>
      <b-colxx xs="12" md="6" class="mb-3">
        <b-card
          class="mb-4"
          :title="edit ? $t('forms.edit') : $t('forms.create')"
        >
          <b-form
            @submit.prevent="onValitadeYoutubeFormSubmit()"
            class="av-tooltip tooltip-label-right"
          >
            <div
              v-for="(lang, index) in $v.youtube_form.$each.$iter"
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
              <b-form-group
                :label="$t(`pages.${lang.name.$model}_desc`)"
                class="has-float-label mb-4"
              >
                <b-form-input
                  type="text"
                  v-model="lang.description.$model"
                  :state="!lang.description.$error"
                />
                <b-form-invalid-feedback v-if="!lang.description.required">
                  {{ $t("forms.desc_filed") }}</b-form-invalid-feedback
                >
              </b-form-group>
            </div>
            <b-form-group
              :label="$t('block.path')"
              class="has-float-label mb-4"
            >
              <b-form-input
                type="text"
                v-model="$v.path_form.path.$model"
                :state="!$v.path_form.path.$error"
              />
              <b-form-invalid-feedback v-if="!$v.path_form.path.required">{{
                $t("forms.youtube_filed")
              }}</b-form-invalid-feedback>
            </b-form-group>

            <b-button
              :disabled="enable_tube"
              type="submit"
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
import VueDropzone from "vue2-dropzone";
import { getCurrentLanguage } from "../../utils";
import Vuetable from "vuetable-2/src/components/Vuetable";
const { required, requiredIf } = require("vuelidate/lib/validators");

export default {
  props: ["isLoad", "list", "wrongYoutubeurl", "successAddYoutubeVideo"],
  components: {
    "vue-dropzone": VueDropzone,
    vuetable: Vuetable
  },
  data() {
    return {
      edit: false,
      attachment_id: null,
      youtube_form: [],
      path_form: {
        path: ""
      },
      langs: null,
            language: null,
      enable_tube: false,

      youtube_fields: [
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
            return value.[this.language].title;
          },
          title: "Title",
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
      ],

      youtube_Options: [
        { name: "OPEN", value: 1 },
        { name: "UPDATE", value: 2 },
        { name: "DELETE", value: 3 }
      ]
    };
  },
  mixins: [validationMixin],
  validations: {
    path_form: {
      path: {
        required
      }
    },

    youtube_form: {
      $each: {
        title: {
          required
        },
        description: {},
        name: {}
      }
    }
  },
  created() {
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.youtube_form);
    this.language = getCurrentLanguage();

  },
  methods: {
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          title: "",
          description: "",
          name: el.name
        });
      });
    },
    youtube_Action(value, item) {
      switch (value) {
        case 1:
          {
            window.open(item.path);
          }
          break;
        case 2:
          {
            this.attachment_id = item.id;
            this.edit = true;
            this.youtube_form.forEach(el => {
              el.title = item.locales.[el.name].title;
                  el.description = item.locales.[el.name].description;
            });

            this.path_form.path = item.path;
          }
          break;
        case 3:
          {
            this.$emit("delete-youtube", item.id);
          }
          break;
      }
    },
    onValitadeYoutubeFormSubmit() {
      this.$v.$touch();
      this.$v.youtube_form.$touch();
      this.$v.path_form.$touch();
      if (!this.$v.youtube_form.$invalid && !this.$v.path_form.$invalid) {
        this.enable_tube = true;
        if (!this.edit) {
          this.$emit(
            "create-youtube",
            this.$v.youtube_form.$model,
            this.path_form.path
          );
        } else {
          this.$emit(
            "update-youtube",
            this.$v.youtube_form.$model,
            this.path_form.path,
            this.attachment_id
          );
        }
      }
    }
  },
  watch: {
    list: function(val) {
      this.youtube_form.forEach(el => {
        el.title = null;
        el.description = null;
      });
      this.enable = false;
      this.path_form.path = null;
      this.$refs.vuetable.setData(val);
      this.$v.$reset();
    },
    wrongYoutubeurl: function(val) {
      this.enable_tube = false;
      this.path_form.path = null;
      this.$notify(
        "error",
        "Error via Create",
        "This Youtube Url isn't valid",
        { duration: 4000, permanent: false }
      );
    },
    successAddYoutubeVideo: function(val) {
      this.enable_tube = false;
      this.youtube_form.forEach(el => {
        el.title = null;
        el.description = null;
      });
      this.path_form.path = null;
      this.$v.$reset();
    }
  }
};
</script>
