<template>
  <b-modal
    id="modalright"
    ref="modalright"
    :title="$t('pages.add-new-title')"
    modal-class="modal-right"
  >
    <form>
      <div v-for="(lang, index) in $v.image_form.$each.$iter" :key="index">
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
          <vue-dropzone
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            @vdropzone-files-added="fileAdded"
            @vdropzone-complete="afterUploadComplete"
            @vdropzone-sending-multiple="sendMessage"
            @vdropzone-removed-file="fileRemoved"
          ></vue-dropzone>
        </b-colxx>
        <span>{{ $t("pages.image") }}</span>
      </label>
    </form>
    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalright')">{{
        $t("survey.cancel")
      }}</b-button>
      <b-button
        :disabled="enable"
        variant="primary"
        @click="formSubmit()"
        class="mr-1"
        >{{ $t("survey.submit") }}</b-button
      >
    </template>
  </b-modal>
</template>
<script>
import VueDropzone from "vue2-dropzone";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
const { required, email } = require("vuelidate/lib/validators");
export default {
  components: {
    "v-select": vSelect,
    "vue-dropzone": VueDropzone
  },

  data() {
    return {
      file: null,
      langs: [],
      image_form: [],
      enable: false,
      dropzoneOptions: {
        url:
          "https://lilacmarketingevents.com/tarrab-api/public/api/blocks/images/54?en[title]=dddddddddddddd&en[description]=dddddddddddddd",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles: "image/jpeg,image/png,image/gif"
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    image_form: {
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
    this.make_collaction(this.langs);
  },
  methods: {
    ...mapActions(["createPageImage"]),
    make_collaction(langs) {
      JSON.parse(langs).forEach(el => {
        this.image_form.push({
          title: "",
          description: "",
          name: el.name
        });
      });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
      // this.form.en_title = null;
      // this.form.ar_title = null;
      // this.form.en_description = null;
      // this.form.ar_description = null;
    },
    formSubmit() {
      this.$v.$touch();
      this.$v.image_form.$touch();
      if (!this.$v.image_form.$invalid) {
        this.enable = true;
        this.$v.image_form.$model.forEach(el => {});
        this.$emit("AddNewImage", {
          info: this.$v.image_form.$model,
          image: this.file ? this.file[0] : null
        });
      }
    },
    afterUploadComplete(response) {
      if (response.status == "success") {
        this.sendSuccess = true;
      } else {
      }
    },
    fileAdded(file) {
      this.file = file;
    },
    fileRemoved(file) {
      this.file = null;
    },
    shootMessage: async function() {
      this.$refs.myVueDropzone.processQueue();
    },
    sendMessage: async function(files, xhr, formData) {},

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
    }
  },
  computed: {
    ...mapGetters(["_sccussCreateImage", "_successAddBlockImage"])
  },
  watch: {
    _sccussCreateImage: function(val) {
      this.enable = false;
      this.hideModal("modalright");
      this.image_form.forEach(el => {
        (el.title = null), (el.description = null);
      });
    },
    _successAddBlockImage: function(val) {
      this.enable = false;

      this.hideModal("modalright");
      this.image_form.forEach(el => {
        (el.title = null), (el.description = null);
      });
    }
  }
};
</script>
