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
            <b-colxx lg="12" xl="12" class="mb-4">
              <recent-orders
                @deleteImage="deleteImage"
                :_ImageList="_pageImageList"
              />
            </b-colxx>
          </div>
          <add-new-modal
            :enable="enable"
            @AddNewImage="createImage"
          ></add-new-modal>
        </b-tab>
        <b-tab @click="openFile()" title="Files">
          <b-row>
            <template v-if="isLoadAttach">
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
                    <b-form-group
                      :label="$t('pages.en_title')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.form.en_title.$model"
                        :state="!$v.form.en_title.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.form.en_title.required"
                        >{{ $t("forms.en_massege") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                    <b-form-group
                      :label="$t('pages.en_desc')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.form.en_description.$model"
                        :state="!$v.form.en_description.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.form.en_description.required"
                        >Please enter English
                        description</b-form-invalid-feedback
                      >
                    </b-form-group>
                    <b-form-group
                      :label="$t('pages.ar_title')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.form.ar_title.$model"
                        :state="!$v.form.ar_title.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.form.ar_title.required"
                        >{{ $t("forms.ar_massege") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                    <b-form-group
                      :label="$t('pages.ar_desc')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.form.ar_description.$model"
                        :state="!$v.form.ar_description.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.form.ar_description.required"
                        >Please enter Arabic
                        description</b-form-invalid-feedback
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
        </b-tab>
        <b-tab @click="openVideo()" title="Videos">
          <b-row>
            <template v-if="isLoadAttach">
              <b-colxx style="display: grid;" xs="12" md="12" class="mb-3">
                <div class="top-right-button-container">
                  <b-button-group style="float: right;padding: 12px;">
                    <b-button v-b-modal.modalbackdrop variant="primary">{{
                      $t("modal.create-new-video")
                    }}</b-button>
                  </b-button-group>
                </div>
                <b-card>
                  <vuetable
                    ref="video_vuetable"
                    :api-mode="false"
                    :reactive-api-url="true"
                    :fields="videos_fields"
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
                          v-for="(item, index) in videos_Options"
                          :key="index"
                          @click="videos_Action(item.value, props.rowData)"
                          >{{ $t(item.name) }}</b-dropdown-item
                        >
                      </b-dropdown>
                    </template>
                  </vuetable>
                </b-card>
              </b-colxx>
              <add-new-video-model
                :enable="enable"
                @AddNewVideo="createVideo"
              />
            </template>
            <template v-else>
              <div class="loading"></div>
            </template>
          </b-row>
        </b-tab>
        <b-tab @click="openYoutubeVideo()" title="Youtube Videos">
          <b-row>
            <template v-if="isLoadAttach">
              <b-colxx xs="12" md="6" class="mb-3">
                <b-card>
                  <vuetable
                    ref="youtubeVideo_vuetable"
                    :api-mode="false"
                    :data-total="dataCount"
                    :per-page="perPage"
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
                    <b-form-group
                      :label="$t('forms.en_title')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.youtube_form.en_title.$model"
                        :state="!$v.youtube_form.en_title.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.youtube_form.en_title.required"
                        >{{ $t("forms.en_massege") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                    <b-form-group
                      :label="$t('forms.en_desc')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.youtube_form.en_description.$model"
                        :state="!$v.youtube_form.en_description.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.youtube_form.en_description.required"
                        >Please enter English
                        description</b-form-invalid-feedback
                      >
                    </b-form-group>
                    <b-form-group
                      :label="$t('forms.en_title')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.youtube_form.ar_title.$model"
                        :state="!$v.youtube_form.ar_title.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.youtube_form.ar_title.required"
                        >{{ $t("forms.ar_massege") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                    <b-form-group
                      :label="$t('forms.ar_desc')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.youtube_form.ar_description.$model"
                        :state="!$v.youtube_form.ar_description.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.youtube_form.ar_description.required"
                        >Please enter Arabic
                        description</b-form-invalid-feedback
                      >
                    </b-form-group>
                    <b-form-group
                      :label="$t('block.path')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.youtube_form.path.$model"
                        :state="!$v.youtube_form.path.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.youtube_form.path.required"
                        >Please enter Youtube Link</b-form-invalid-feedback
                      >
                    </b-form-group>

                    <b-button
                      :disabled="!enable"
                      type="submit"
                      variant="primary"
                      class="mt-4"
                      >{{
                        edit ? $t("forms.save") : $t("forms.submit")
                      }}</b-button
                    >
                  </b-form>
                </b-card>
              </b-colxx>
            </template>
            <template v-else>
              <div class="loading"></div>
            </template>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-colxx>
</template>

<script>
import { LightGallery } from "vue-light-gallery";
import { mapGetters, mapActions } from "vuex";
import VueDropzone from "vue2-dropzone";
import RecentOrders from "../../../containers/appliaction/RecentOrders.vue";

import VideoPlayer from "../../../components/Common/VideoPlayer.vue";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import AddNewVideoModel from "../../../containers/appliaction/AddNewVideoModel.vue";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");
import { getCurrentLanguage } from "../../utils";

export default {
  components: {
    "add-new-modal": AddNewModal,
    "video-player": VideoPlayer,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "vue-dropzone": VueDropzone,
    LightGallery,
    "add-new-video-model": AddNewVideoModel,
    "recent-orders": RecentOrders
  },
  props: ["pageId"],
  data() {
    return {
      pageData: null,
      _data: null,
      enable: false,
      itemId: null,
      meta_type_id: null,
      textarea: null,
      isLoadAttach: false,
      thumbs: null,
      images: null,
      file: null,
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
      language: null,
      lastPage: 0,
      items: [],
      selectedItems: [],
      // youtube
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
      edit: false,
      youtube_Options: [
        { name: "OPEN", value: 1 },
        { name: "UPDATE", value: 2 },
        { name: "DELETE", value: 3 }
      ],
      youtube_form: {
        en_title: "",
        en_description: "",
        ar_title: "",
        ar_description: "",
        path: ""
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
      //   videos
      videos_fields: [
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
      videos_Options: [
        { name: "DISPLAY", value: 1 },
        { name: "DELETE", value: 0 }
      ],
      //   videos
      // vue table-2
      //   files
      file: null,
      form: {
        ar_title: "",
        ar_description: "",
        en_title: "",
        en_description: ""
      },
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
      // vue dropezone
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
    },
    youtube_form: {
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
      },
      path: {
        required
      }
    }
    //   files
  },
  created() {
    this.getPageImageList({ id: this.pageId });
    this.language = getCurrentLanguage();
  },
  methods: {
    ...mapActions([
      "getPageImageList",
      "deletePageFile",
      "deletePageImage",
      "deletePageVideo",
      "createPageFile",
      "createPageImage",
      "getPageFileList",
      "getPageVideosList",
      "createPageVideo",
      "getPageYoutubeVideoList",
      "createPageYoutubeVideo",
      "updatePageYoutubeVideo",
      "deletePageYoutubeVideo"
    ]),
    // .....................upload new image ......................

    createImage(value) {
      this.createPageImage({
        info: value.info,
        image: value.image ? value.image : null,
        id: this.pageId
      });
    },
    // .....................upload new video ......................
    createVideo(value) {
      this.createPageVideo({
        en_title: value.en_title,
        en_description: value.en_description,
        ar_title: value.ar_title,
        ar_description: value.ar_description,
        video: value.video ? value.video : null,
        id: this.pageId
      });
    },
    // -----------------------------gallery----------------------------
    deleteImage(id) {
      this.deletePageImage({ id: this.pageId, attachment_id: id });
    },
    // gallery
    // -------------------------------files---------------------------
    openFile() {
      this.getPageFileList({ id: this.pageId });
      this.isLoadAttach = false;
    },
    file_Action(value, item) {
      if (value == 1) {
        window.open(item.path);
      } else {
        this.deletePageFile({
          type: "files",
          pageId: this.pageId,
          file_id: item.id
        });
      }
    },
    videos_Action(value, item) {
      if (value == 1) {
        window.open(item.path);
      } else {
        this.deletePageVideo({
          pageId: this.pageId,
          file_id: item.id
        });
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
        this.enable = false;

        this.createPageFile({
          en_title: this.form.en_title,
          en_description: this.form.en_description,
          ar_title: this.form.ar_title,
          ar_description: this.form.ar_description,
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
    },
    // vue dropezone
    // file
    // --------------------------------videos--------------------------
    openVideo() {
      this.getPageVideosList({ id: this.pageId });
      this.isLoadAttach = false;
    },
    // videos
    // youtube
    openYoutubeVideo() {
      this.getPageYoutubeVideoList({ id: this.pageId });
      this.isLoadAttach = false;
    },

    onValitadeYoutubeFormSubmit() {
      this.$v.$touch();
      this.$v.youtube_form.$touch();
      if (!this.$v.youtube_form.$invalid) {
        this.enable = false;

        if (!this.edit) {
          this.createPageYoutubeVideo({
            ar_title: this.youtube_form.ar_title,
            ar_description: this.youtube_form.ar_description,
            en_title: this.youtube_form.en_title,
            en_description: this.youtube_form.en_description,
            path: this.youtube_form.path,
            id: this.pageId
          });
        } else {
          this.updatePageYoutubeVideo({
            ar_title: this.youtube_form.ar_title,
            ar_description: this.youtube_form.ar_description,
            en_title: this.youtube_form.en_title,
            en_description: this.youtube_form.en_description,
            path: this.youtube_form.path,
            attachment_id: this.attachment_id,
            id: this.pageId
          });
        }
      }
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
            this.youtube_form.ar_title = item.locales.ar.title;
            this.youtube_form.ar_description = item.locales.ar.description;
            this.youtube_form.en_title = item.locales.en.title;
            this.youtube_form.en_description = item.locales.en.description;
            this.youtube_form.path = item.path;
          }
          break;
        case 3:
          {
            this.deletePageYoutubeVideo({
              blockId: this.blockId,
              youtube_id: item.id
            });
          }
          break;
      }
    }
  },
  computed: {
    ...mapGetters([
      "_pageImageList",
      "_pageFileList",
      "_sccussCreateFile",
      "_pageVideosList",
      "_pageYoutubeVideosList"
    ])
  },
  watch: {
    _pageImageList: function(val) {
      this.enable = true;
    },
    _pageFileList(newData, old) {
      this.isLoadAttach = true;
      this.enable = true;

      this.$refs.vuetable.setData(newData);
    },
    _pageVideosList(newData, old) {
      this.isLoadAttach = true;
      this.enable = true;

      this.$refs.video_vuetable.setData(newData);
    },
    _sccussCreateFile(newData, old) {
      this.enable = true;
      this.form.en_title = null;
      this.form.ar_title = null;
      this.form.en_description = null;
      this.form.ar_description = null;
      this.file = null;
    },
    _pageYoutubeVideosList(newData, old) {
      this.isLoadAttach = true;
      this.enable = true;
      this.$refs.youtubeVideo_vuetable.setData(newData);
      this.youtube_form.ar_title = null;
      this.youtube_form.ar_description = null;
      this.youtube_form.en_title = null;
      this.youtube_form.en_description = null;
      this.youtube_form.path = null;
      this.edit = false;
    }
  }
};
</script>
