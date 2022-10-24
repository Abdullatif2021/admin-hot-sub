<template>

    <b-card class="mb-4 basicDetailsContainer" no-body>
        <b-form @submit.prevent="onGridFormSubmit">
          <b-colxx sm="12">
            <label
              style="display: flex;justify-content: center;"
              class="form-group has-float-label"
            >
              <img
                :src="image"
                style="border-radius: 20%;"
                alt="Image"
                width="120"
                height="120"
              />
            </label>
          </b-colxx>
          <div
            v-for="(lang, index) in $v.category_form.$each.$iter"
            :key="index"
          >
            <b-colxx sm="12">
              <b-form-group
                class="has-float-label mb-4"
                :label="$t(`forms.${lang._name.$model}_name`)"
              >
                <b-form-input
                  type="text"
                  :state="!lang.name.$error"
                  v-model="lang.name.$model"
                />
                <b-form-invalid-feedback v-if="!lang.name.required">{{
                  $t("forms.title_filed")
                }}</b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
              <b-form-group
                class="has-float-label mb-4"
                :label="$t(`forms.${lang._name.$model}_desc`)"
              >
                <b-form-input
                  type="text"
                  :state="!lang.description.$error"
                  v-model="lang.description.$model"
                />
                <b-form-invalid-feedback v-if="!lang.description.required">
                  {{ $t("forms.desc_filed") }}</b-form-invalid-feedback
                >
              </b-form-group>
            </b-colxx>
          </div>
          <b-colxx xxs="12">
            <b-form-group
              class="has-float-label mb-4"
              :label="$t('forms.image')"
            >
              <vue-dropzone
                ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-files-added="fileAdded"
                @vdropzone-removed-file="fileRemoved"
              ></vue-dropzone>
            </b-form-group> 
          </b-colxx>
          <b-button
            :disabled="enableSubmitBtn"
            type="submit"
            variant="primary"
            class="mt-4"
            >{{ $t("forms.save") }}</b-button
          >
          <b-button
            v-if="isAuctionCategory"
            style="float: right;"
            variant="outline-theme-6"
            @click="$emit('deleteBtnClicked')"
            class="mt-4"
            >{{ $t("forms.delete") }}</b-button
          >
        </b-form>
      </b-card>

</template>
<script>
import { getCurrentLanguage } from "../../utils";
import { adminRoot } from "../../constants/config";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import VueDropzone from "vue2-dropzone";
const { required } = require("vuelidate/lib/validators");
export default {
    components: {"vue-dropzone": VueDropzone},
props: {
    basicData: {
      type: Object
    },
    isAuctionCategory: {
      type: Boolean,
      default: false
    },
    enableSubmitBtn: {
        defalut: false
    }
},
mixins: [validationMixin],
  validations: {
    category_form: {
      $each: {
        name: {
          required
        },
        description: {},
        _name: {}
      }
    },

  },
data() {
    return {
        file: null,
        image: null,
        enable: false,
        category_form: [],
        langs: null,
        dropzoneOptions: {
            url: "https://lilacmarketingevents.com",
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
    }
},
created() {
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.category_form);
    this.language = getCurrentLanguage();
},
methods: {
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          name: "",
          description: "",
          _name: el.name
        });
      });
    },
    onGridFormSubmit() {
      this.$v.$touch();
      this.$v.category_form.$touch();
      if (!this.$v.category_form.$invalid) {
        this.enable = true;
        this.$emit('formSubmited', this.$v.category_form.$model, this.file ? this.file[0] : null)
      }
    },
    fileAdded(file) {
      this.file = file;
    },
    fileRemoved(file) {
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
},
watch: {
    basicData: function(val) {
        this.image = val.image;
        this.category_form.forEach(el => {
         el.name = val.locales[el._name].name;
          el.description = val.locales[el._name].description;
        });
    },
   
}

}

</script>