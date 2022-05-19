<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card
        class="mb-4"
        :title="categoryId ? $t('forms.editCate') : $t('forms.createCate')"
      >
        <b-form @submit.prevent="onGridFormSubmit">
          <b-row>
            <b-colxx v-if="categoryId" sm="12">
              <label
                style="display: flex;justify-content: center;"
                class="form-group has-float-label"
              >
                <img
                  :src="category.image"
                  style="border-radius: 20%;"
                  alt="Image"
                  width="120"
                  height="120"
                />
              </label>
            </b-colxx>

            <b-colxx sm="6">
              <b-form-group :label="$t('forms.en_title')">
                <b-form-input type="text" v-model="gridForm.en_title" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.ar_title')">
                <b-form-input type="text" v-model="gridForm.ar_title" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.en_desc')">
                <b-form-input type="text" v-model="gridForm.en_description" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.ar_desc')">
                <b-form-input type="text" v-model="gridForm.ar_description" />
              </b-form-group>
            </b-colxx>
            <b-colxx xxs="12">
              <b-form-group :label="$t('forms.image')">
                <vue-dropzone
                  ref="myVueDropzone"
                  id="dropzone"
                  :options="dropzoneOptions"
                  @vdropzone-files-added="fileAdded"
                  @vdropzone-sending-multiple="sendMessage"
                  @vdropzone-removed-file="fileRemoved"
                ></vue-dropzone>
              </b-form-group>
            </b-colxx>
          </b-row>

          <b-button type="submit" variant="primary" class="mt-4">{{
            $t("forms.save")
          }}</b-button>
        </b-form>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import VueDropzone from "vue2-dropzone";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      categoryId: null,
      _role: null,
      password: null,
      create_role: null,
      file: null,
      gridForm: {
        ar_title: "",
        en_title: "",
        en_description: "",
        ar_description: ""
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
        acceptedFiles: "image/jpeg,image/png,image/gif"
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      en_title: {
        required
      },
      ar_title: {
        required
      }
    }
  },
  created() {
    this.categoryId = this.$route.query.id;
    if (this.categoryId) {
      this.getCategory({ id: this.categoryId });
    } else {
      console.log("i am here ", this.categoryId);
    }
  },
  methods: {
    ...mapActions(["getCategory", "updateCategory", "createCategory"]),
    onGridFormSubmit() {
      console.log("img", this.file);
      console.log("hi from submit", this.gridForm);
      if (this.categoryId) {
        this.updateCategory({
          info: this.gridForm,
          img: this.file ? this.file[0] : null,
          id: this.categoryId
        });
      } else {
        this.createCategory({
          info: this.gridForm,
          img: this.file ? this.file[0] : null
        });
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
    ...mapGetters(["category", "_updatedCategorySuccessfuly"])
  },
  watch: {
    category(newInfo, oldOne) {
      this.gridForm.ar_title = newInfo.locales.ar.title;
      this.gridForm.en_title = newInfo.locales.en.title;
      this.gridForm.ar_description = newInfo.locales.ar.description;
      this.gridForm.en_description = newInfo.locales.en.description;
    },
    _updatedCategorySuccessfuly(newInfo, oldOne) {
      console.log("hiiiiii");
      this.$destroy();
    }
  }
};
</script>
