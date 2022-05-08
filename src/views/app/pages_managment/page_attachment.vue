<template>
  <b-colxx xxs="12" xs="12" lg="12">
    <b-card class="mb-4" no-body>
      <b-tabs card no-fade>
        <b-tab title="Images" active>
          <div style="display: grid;">
            <b-button
              v-b-modal.modalright
              variant="primary"
              style="margin: auto;margin-bottom: 17px;"
              size="lg"
              >{{ $t("survey.add-new") }}</b-button
            >
            <div class="row social-image-row gallery">
              <b-colxx
                xxs="4"
                class="container"
                v-for="(thumb, thumbIndex) in _pageImageList"
                :key="`thumb_${thumbIndex}`"
              >
                <img
                  class="img-fluid border-radius image-hover"
                  :src="thumb.path"
                  width="400"
                  height="400"
                  alt="thumbnail"
                  @click="onThumbClick(thumbIndex)"
                />
                <div class="middle">
                  <div class="text">
                    <h3>{{ thumb.locales.en.title }}</h3>
                    <p>{{ thumb.locales.en.description }}</p>
                  </div>
                  <div @click="deleteImage(thumb)" class="button">
                    Delete
                  </div>
                </div>
              </b-colxx>
            </div>
          </div>
          <add-new-modal :pageId="pageId"></add-new-modal>
        </b-tab>
        <b-tab @click="openFile()" title="Files">
          <b-row>
            <b-colxx xs="12" md="6" class="mb-3">
              <b-card>
                <vuetable
                  ref="vuetable"
                  :api-mode="false"
                  :data-total="dataCount"
                  :per-page="perPage"
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
                        @click="editAction(item.value, props.rowData)"
                        >{{ item.name }}</b-dropdown-item
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
                  <b-form-group
                    :label="$t('todo.title')"
                    class="has-float-label mb-4"
                  >
                    <b-form-input
                      type="text"
                      v-model="$v.form.title.$model"
                      :state="!$v.form.title.$error"
                    />
                    <b-form-invalid-feedback v-if="!$v.form.title.required"
                      >Please enter title</b-form-invalid-feedback
                    >
                  </b-form-group>
                  <b-form-group
                    :label="$t('pages.description')"
                    class="has-float-label mb-4"
                  >
                    <b-form-input
                      type="text"
                      v-model="$v.form.description.$model"
                      :state="!$v.form.description.$error"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.form.description.required"
                      >Please enter description</b-form-invalid-feedback
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
                    <span>File</span>
                  </label>

                  <b-button type="submit" variant="primary" class="mt-4">{{
                    $t("forms.submit")
                  }}</b-button>
                </b-form>
              </b-card>
            </b-colxx>
          </b-row>
        </b-tab>
        <b-tab title="Videos"> </b-tab>
      </b-tabs>
    </b-card>
  </b-colxx>
</template>

<script>
import { LightGallery } from "vue-light-gallery";
import { mapGetters, mapActions } from "vuex";
import VueDropzone from "vue2-dropzone";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    "add-new-modal": AddNewModal,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "vue-dropzone": VueDropzone,
    LightGallery
  },
  props: ["pageId"],
  data() {
    return {
      pageData: null,
      _data: null,
      itemId: null,
      meta_type_id: null,
      textarea: null,
      thumbs: null,
      images: null,
      file: null,
      itemForEdit: null,
      selectOptions: [],
      select: "",
      detail: "",
      // vue table-2
      Options: [
        { name: "DOWNLOAD", value: 1 },
        { name: "DELETE", value: 0 }
      ],
      sort: "",
      dataCount: 0,
      perPage: 12,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      selectedItems: [],

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
      // vue table-2
      //   files
      file: null,
      form: {
        title: "",
        description: ""
      },
      // vue dropezone
      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        maxFilesize: 2,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
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
      // vue dropezone
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      title: {
        required
      },
      description: {
        required
      }
    }
    //   files
  },
  created() {
    console.log(this.pageId);
    this.getPageImageList({ id: this.pageId });
  },
  methods: {
    ...mapActions([
      "getPageImageList",
      "deletePageImage",
      "createPageFile",
      "getPageFileList",
      "deletePageFile"
    ]),
    // gallery
    deleteImage(thumb) {
      console.log(thumb);
      this.deletePageImage({ id: this.pageId, attachment_id: thumb.id });
    },
    // gallery
    // files
    openFile() {
      this.getPageFileList({ id: this.pageId });
    },
    editAction(value, item) {
      console.log(item);
      if (value == 1) {
        window.open(item.path);
      } else {
        this.deletePageFile({ pageId: this.pageId, file_id: item.id });
      }
    },

    hideModal(refname) {
      this.$refs[refname].hide();
    },
    onValitadeFormSubmit() {
      // window.top.close();
      this.$v.$touch();
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        console.log(
          this.form.title,
          this.form.description,
          this.file[0],
          this.pageId
        );
        this.createPageFile({
          title: this.form.tilte,
          description: this.form.description,
          file: this.file ? this.file[0] : null,
          id: this.pageId
        });
      }
    },
    // vue dropezone
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
    // vue dropezone
    // file
  },
  computed: {
    ...mapGetters(["_pageImageList", "_pageFileList", "sccussCreateFile"])
  },
  watch: {
    _pageImageList: function(val) {
      console.log("_pageImageList", val);
    },
    _pageFileList(newData, old) {
      this.$refs.vuetable.setData(newData);
    },
    sccussCreateFile: function(val) {
      this.form.title = null;
      this.form.description = null;
      this.file = null;
      this.$refs.myVueDropzone.removeFile();
    }
  }
};
</script>
