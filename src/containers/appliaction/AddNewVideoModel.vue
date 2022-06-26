<template>
  <b-modal
    id="modalbackdrop"
    ref="modalbackdrop"
    :title="$t('modal.modal-video')"
    :hide-backdrop="true"
    :no-close-on-backdrop="true"
  >
    <b-form>
      <div v-for="(lang, index) in $v.video_form.$each.$iter" :key="index">
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
              $t("forms.choose-video-message")
            }}</b-form-invalid-feedback>
          </b-form-group>
        </b-colxx>
        <span>{{ $t("forms.video") }}</span>
      </label>
    </b-form>
    <template slot="modal-footer">
      <b-button
        variant="primary"
        :disabled="enable"
        @click="formSubmit()"
        class="mr-1"
        >{{ $t("pages.add-new") }}</b-button
      >
      <b-button variant="secondary" @click="hideModal('modalbackdrop')">{{
        $t("pages.cancel")
      }}</b-button>
    </template>
  </b-modal>
</template>

<script>
import VueDropzone from "vue2-dropzone";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");
export default {
  components: {
    "v-select": vSelect,
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      file: null,
      enable: false,
      video_form: [],
      file_form: {
        file: null
      },
      form: {
        ar_title: "",
        ar_description: "",
        en_title: "",
        en_description: ""
      },
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
        acceptedFiles:
          "video/mp4, video/avi, video/mpeg, video/quicktime, video/ogg, video/3gpp2, video/3gpp, video/webm, video/mp2t"
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    video_form: {
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
    this.make_video_form(this.langs);
  },
  methods: {
    make_video_form(langs) {
      JSON.parse(langs).forEach(el => {
        this.video_form.push({
          title: "",
          description: "",
          name: el.name
        });
        console.log(this.video_form);
      });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
      this.form.en_title = null;
      this.form.ar_title = null;

      this.form.en_description = null;
      this.form.ar_description = null;
    },

    formSubmit() {
      // window.top.close();
      this.$v.$touch();
      this.$v.video_form.$touch();
      this.$v.file_form.$touch();
      if (!this.$v.video_form.$invalid && !this.$v.file_form.$invalid) {
        this.enable = true;
        this.$emit("AddNewVideo", {
          info: this.$v.video_form.$model,
          video: this.file[0]
        });
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
    }
  },
  computed: {
    ...mapGetters([
      "_successAddPageVideo",
      "_successAddBlockVideo",
      "_errorAddBlockVideo"
    ])
  },
  watch: {
    _successAddPageVideo: function(val) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Video have been added successfully",
        { duration: 3000, permanent: false }
      );
      this.hideModal("modalbackdrop");
      this.form.en_title = null;
      this.form.ar_title = null;

      this.form.en_description = null;
      this.form.ar_description = null;
      this.enable = false;
    },
    _errorAddBlockVideo: function(val) {
      console.log(val);
      this.$notify(
        "error",
        "Operation uncompleted",
        "Video type is not valid",
        { duration: 3000, permanent: false }
      );
      this.enable = false;
    },
    _successAddBlockVideo: function(val) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Video have been added successfully",
        { duration: 3000, permanent: false }
      );
      this.hideModal("modalbackdrop");
      this.form.en_title = null;
      this.form.ar_title = null;
      this.enable = false;
      this.file_form.file = null;

      this.form.en_description = null;
      this.form.ar_description = null;
    }
  }
};
</script>
