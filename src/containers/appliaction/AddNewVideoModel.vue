<template>
  <b-modal
    id="modalbackdrop"
    ref="modalbackdrop"
    :title="$t('modal.modal-video')"
    :hide-backdrop="true"
    :no-close-on-backdrop="true"
  >
    <b-form>
      <b-form-group :label="$t('pages.en_title')" class="has-float-label mb-4">
        <b-form-input
          type="text"
          v-model="$v.form.en_title.$model"
          :state="!$v.form.en_title.$error"
        />
        <b-form-invalid-feedback v-if="!$v.form.en_title.required"
          >Please enter English title</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group :label="$t('pages.en_desc')" class="has-float-label mb-4">
        <b-form-input
          type="text"
          v-model="$v.form.en_description.$model"
          :state="!$v.form.en_description.$error"
        />
        <b-form-invalid-feedback v-if="!$v.form.en_description.required"
          >Please enter English description</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group :label="$t('pages.ar_title')" class="has-float-label mb-4">
        <b-form-input
          type="text"
          v-model="$v.form.ar_title.$model"
          :state="!$v.form.ar_title.$error"
        />
        <b-form-invalid-feedback v-if="!$v.form.ar_title.required"
          >Please enter Arabic title</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group :label="$t('pages.ar_desc')" class="has-float-label mb-4">
        <b-form-input
          type="text"
          v-model="$v.form.ar_description.$model"
          :state="!$v.form.ar_description.$error"
        />
        <b-form-invalid-feedback v-if="!$v.form.ar_description.required"
          >Please enter Arabic description</b-form-invalid-feedback
        >
      </b-form-group>
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
        <span>Video</span>
      </label>
    </b-form>
    <template slot="modal-footer">
      <b-button
        variant="primary"
        :disabled="enable"
        @click="formSubmit()"
        class="mr-1"
        >Add New</b-button
      >
      <b-button variant="secondary" @click="hideModal('modalbackdrop')"
        >Cancel</b-button
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
    form: {
      en_title: {
        required
      },
      en_description: {
        required
      },
      ar_title: {
        required
      },
      ar_description: {
        required
      }
    }
  },
  methods: {
    ...mapActions(["createPageVideo"]),
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
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        this.enable = true;
        this.$emit("AddNewVideo", {
          en_title: this.form.en_title,
          en_description: this.form.en_description,
          ar_title: this.form.ar_title,
          ar_description: this.form.ar_description,
          video: this.file ? this.file[0] : null
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
      console.log(file);
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
      this.form.en_description = null;
      this.form.ar_description = null;
    }
  }
};
</script>
