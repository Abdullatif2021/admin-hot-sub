<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :reload="true"
        :transaction_filter="false"
        :add_new_button="false"
        :title="$t('forms.create_block')"
      ></datatable-heading>
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <b-card class="mb-4" no-body>
            <b-tabs card>
              <b-tab title-item-class="w-100 text-center">
                <div
                  v-for="(lang, index) in $v.block_form.$each.$iter"
                  :key="index"
                >
                  <b-form-group
                    :label="$t(`forms.${lang._name.$model}_name`)"
                    class="has-float-label mb-4"
                  >
                    <b-form-input
                      type="text"
                      v-model="lang.name.$model"
                      :state="!lang.name.$error"
                    />
                    <b-form-invalid-feedback v-if="!lang.name.required">{{
                      $t("forms.name_filed")
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                  <label class="form-group has-float-label">
                    <quill-editor
                      ref="myTextEditor"
                      v-model="lang.description.$model"
                      :options="editorOption"
                      @change="onEditorChange($event, lang)"
                    >
                    </quill-editor>
                    <span>{{ $t(`forms.${lang._name.$model}_desc`) }}</span>
                  </label>
                </div>
                <label class="form-group has-float-label">
                  <input type="text" v-model="url" class="form-control" />
                  <span>{{ $t("block.url") }}</span>
                </label>

                <label class="form-group has-float-label">
                  <b-colxx xxs="12" style="padding: 0px;margin-top: 20px;">
                    <vue-dropzone
                      ref="myVueDropzone"
                      id="dropzone"
                      :options="dropzoneImageOptions"
                      @vdropzone-files-added="imageAdded"
                      @vdropzone-sending-multiple="sendMessage"
                      @vdropzone-removed-file="imageRemoved"
                    ></vue-dropzone>
                  </b-colxx>
                  <span>{{ $t("block.image") }}</span>
                </label>
                <label class="form-group has-float-label">
                  <b-colxx xxs="12" style="padding: 0px;margin-top: 20px;">
                    <vue-dropzone
                      ref="myVueDropzone"
                      id="dropzone"
                      :options="dropzoneFileOptions"
                      @vdropzone-files-added="fileAdded"
                      @vdropzone-sending-multiple="sendMessage"
                      @vdropzone-removed-file="fileRemoved"
                    ></vue-dropzone>
                  </b-colxx>
                  <span>{{ $t("block.file") }}</span>
                </label>
                <b-colxx
                  xxs="12"
                  style="display: flex;align-items: center;justify-content: center;"
                >
                  <!-- <h3>{{ items.length }}</h3> -->
                  <b-button
                    :disabled="enable_basic"
                    @click="submit()"
                    class="mb-2"
                    size="lg"
                    variant="primary"
                    >{{ $t("forms.submit") }}</b-button
                  >
                </b-colxx>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-colxx>
      </b-row>
    </b-colxx>
  </b-row>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { mapGetters, mapActions } from "vuex";
import VueDropzone from "vue2-dropzone";
import { validationMixin } from "vuelidate";
import { adminRoot } from "../../../constants/config";
import router from "../../../router";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    "quill-editor": quillEditor,
    "datatable-heading": DatatableHeading,
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      categoryId: null,
      url: null,
      enable_basic: false,
      image: null,
      file: null,
      block_form: [],
      // vue dropezone
      dropzoneImageOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        maxFilesize: 10,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles: "image/jpeg,image/png,image/gif"
      },
      dropzoneFileOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        maxFilesize: 10,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles:
          "application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
      },
      // vue dropezone
      // quillEditor
      content: "",
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" }
            ],
            ["link", "image"],
            ["clean"]
          ]
        }
      },
      contentBubble: "",
      editorOptionBubble: {
        theme: "bubble",
        placeholder: "",
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "link",
              { header: 1 },
              { header: 2 },
              "blockquote"
            ]
          ]
        }
      }
      // quillEditor
    };
  },
  mixins: [validationMixin],
  validations: {
    block_form: {
      $each: {
        name: {
          required
        },
        description: {},
        _name: {}
      }
    }
  },

  created() {
    this.categoryId = this.$route.query.id;
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.block_form);
  },
  methods: {
    ...mapActions(["createBlock"]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          name: "",
          description: "",
          _name: el.name
        });
      });
    },
    submit() {
      this.$v.$touch();
      this.$v.block_form.$touch();
      if (!this.$v.block_form.$invalid) {
        this.enable_basic = true;
        const now = new Date();
        const date = now.toISOString().split(",");
        this.createBlock({
          data: {
            block_category_id: this.categoryId,
            url: this.url,
            post_date: date
          },
          info: this.$v.block_form.$model,
          image: this.image ? this.image[0] : null,
          file: this.file ? this.file[0] : null
        });
      }
    },
    onEditorBlur(editor) {},
    imageAdded(image) {
      this.image = image;
    },
    imageRemoved(file) {
      this.image = null;
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
    },
    onEditorFocus(editor) {},
    onEditorReady(editor) {},
    onEditorChange({ quill, html, text }, lang) {
      this.block_form.forEach(el => {
        if (lang._name.$model === el._name) {
          el.description = text;
        }
      });
    }
  },
  computed: {
    ...mapGetters(["_createBlockSuccess"]),
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  watch: {
    _createBlockSuccess(newInfo, oldOne) {
      this.enable_basic = false;
      this.$notify(
        "success",
        "Operation completed successfully",
        "Block have been created successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/blocks/blockList/${this.categoryId}`);
    }
  }
};
</script>
