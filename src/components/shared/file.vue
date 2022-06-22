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
                  @click="file_Action(item.value, props.rowData)"
                  >{{ $t(item.name) }}</b-dropdown-item
                >
              </b-dropdown>
            </template>
          </vuetable>
        </b-card>
      </b-colxx>
      <b-colxx xs="12" md="6" class="mb-3">
        <b-card class="mb-4" :title="$t('forms.create')">
          <b-form
            @submit.prevent="onValitadeFormSubmit()"
            class="av-tooltip tooltip-label-right"
          >
            <div v-for="(lang, index) in $v.info_form.$each.$iter" :key="index">
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
            <label class="form-group has-float-label">
              <b-colxx xxs="12" style="padding: 0px;">
                <b-form-group>
                  <b-form-input
                    style="display: none;"
                    :state="!$v.file_form.file.$error"
                    v-model="$v.file_form.file.$model"
                  />

                  <vue-dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-files-added="fileAdded"
                    @vdropzone-removed-file="fileRemoved"
                  ></vue-dropzone>
                  <b-form-invalid-feedback v-if="!$v.file_form.file.required">{{
                    $t("forms.choose-file-message")
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <span>{{ $t("block.file") }}</span>
            </label>

            <b-button
              :disabled="enable"
              type="submit"
              variant="primary"
              class="mt-4"
              >{{ $t("forms.submit") }}</b-button
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
import Vuetable from "vuetable-2/src/components/Vuetable";
const { required, requiredIf } = require("vuelidate/lib/validators");

export default {
  props: ["isLoad", "list"],
  components: {
    "vue-dropzone": VueDropzone,
    vuetable: Vuetable
  },
  data() {
    return {
      enable: false,
      info_form: [],
      file: null,
      file_form: {
        file: null
      },
      Options: [
        { name: "DOWNLOAD", value: 1 },
        { name: "DELETE", value: 0 }
      ],
      fields: [
        {
          name: "id",
          title: "ID",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "40%"
        },
        {
          name: "original_filename",
          callback: value => {
            return value.substring(0, value.indexOf("."));
          },
          title: "File Name",
          titleClass: "",
          dataClass: "text-muted",
          width: "40%"
        },
        {
          name: "extension",
          title: "Extention",
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
      // vue dropezone
      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        acceptedFiles:
          "application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf",
        uploadMultiple: false,
        addRemoveLinks: true,
        removedfile: function(file) {
          var _ref;
          return (_ref = file.previewElement) != null
            ? _ref.parentNode.removeChild(file.previewElement)
            : void 0;
        },
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    info_form: {
      $each: {
        title: {
          required
        },
        description: {},
        name: {}
      }
    },
    file_form: {
      file: { required }
    }
  },
  created() {
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.info_form);
  },
  methods: {
    make_collaction(langs, form) {
      console.log(langs, form);
      JSON.parse(langs).forEach(el => {
        form.push({
          title: "",
          description: "",
          name: el.name
        });
      });
    },
    onValitadeFormSubmit() {
      this.$v.$touch();
      this.$v.file_form.$touch();
      this.$v.info_form.$touch();
      if (!this.$v.info_form.$invalid && !this.$v.file_form.$invalid) {
        this.enable = true;
        this.$emit("create-file", this.$v.info_form.$model, this.file[0]);
      }
    },
    fileAdded(file) {
      this.file_form.file = "file";
      this.file = file;
    },
    fileRemoved(file) {
      this.file_form.file = null;
      this.file = null;
    },
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `;
    },

    file_Action(value, item) {
      console.log(item);
      if (value == 1) {
        window.open(item.path);
      } else {
        this.$emit("delete-file", item.id);
      }
    }
  },
  watch: {
    list: function(val) {
      console.log("hi from listtttttttttt");
      this.info_form.forEach(el => {
        el.title = null;
        el.description = null;
      });
      this.file_form.file = null;
      this.file = null;
      this.enable = false;
      this.$refs.vuetable.setData(val);
    }
  }
};
</script>
