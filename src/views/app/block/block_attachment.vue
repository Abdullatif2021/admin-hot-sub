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
              >{{ $t("block.add-new") }}</b-button
            >
            <b-colxx lg="12" xl="12" class="mb-4">
              <recent-orders
                @deleteImage="deleteImage"
                :_ImageList="_blockImageList"
              />
            </b-colxx>
          </div>
          <add-new-modal @AddNewImage="createImage"></add-new-modal>
        </b-tab>
        <b-tab @click="openFile()" title="Files">
          <b-row>
            <template v-if="_isBLoadAttach">
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
                    <div
                      v-for="(lang, index) in $v.file_form.$each.$iter"
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
                        <b-form-invalid-feedback v-if="!lang.title.required"
                          >Please enter title</b-form-invalid-feedback
                        >
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
                        <b-form-invalid-feedback
                          v-if="!lang.description.required"
                          >Please enter description</b-form-invalid-feedback
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
                      <span>File</span>
                    </label>

                    <b-button type="submit" variant="primary" class="mt-4">{{
                      $t("forms.submit")
                    }}</b-button>
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
            <template v-if="_isBLoadAttach">
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
                          >{{ item.name }}</b-dropdown-item
                        >
                      </b-dropdown>
                    </template>
                  </vuetable>
                </b-card>
              </b-colxx>
              <add-new-video-model @AddNewVideo="createVideo" />
            </template>
            <template v-else>
              <div class="loading"></div>
            </template>
          </b-row>
        </b-tab>
        <b-tab @click="openYoutubeVideo()" title="Youtube Videos">
          <b-row>
            <template v-if="_isBLoadAttach">
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
                          >{{ item.name }}</b-dropdown-item
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
                        <b-form-invalid-feedback v-if="!lang.title.required"
                          >Please enter title</b-form-invalid-feedback
                        >
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
                        <b-form-invalid-feedback
                          v-if="!lang.description.required"
                          >Please enter description</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </div>
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
                      :disabled="enable_tube"
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
import VideoPlayer from "../../../components/Common/VideoPlayer.vue";
import Vuetable from "vuetable-2/src/components/Vuetable";
import RecentOrders from "../../../containers/appliaction/RecentOrders.vue";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import AddNewVideoModel from "../../../containers/appliaction/AddNewVideoModel.vue";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");

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
  props: ["blockId"],
  data() {
    return {
      blockData: null,
      _data: null,
      itemId: null,
      meta_type_id: null,
      textarea: null,
      thumbs: null,
      images: null,
      enable_tube: false,
      file: null,
      itemForEdit: null,
      selectOptions: [],
      // vue table-2
      Options: [
        { name: "DOWNLOAD", value: 1 },
        { name: "DELETE", value: 0 }
      ],

      sort: "",
      dataCount: 0,
      perPage: 12,
      search: "",
      attachment_id: null,
      from: 0,
      to: 0,

      total: 0,
      edit: false,
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
            return value.en.title;
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
      ],
      youtube_form: {
        en_title: "",
        en_description: "",
        ar_title: "",
        ar_description: "",
        path: ""
      },

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
    file_form: {
      $each: {
        title: {
          required
        },
        description: {},
        name: {}
      }
    },
    file_form: {
      $each: {
        title: {
          required
        },
        description: {},
        name: {}
      }
    },
    youtube_form: {
      $each: {
        title: {
          required
        },
        description: {},
        name: {},
        path: {
          required
        }
      }
    }
    //   files
  },
  created() {
    console.log(this.blockId);
    this.getBlockImageList({ id: this.blockId });
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs);
  },
  methods: {
    ...mapActions([
      "getBlockImageList",
      "deleteBlockFile",
      "deleteBlockVideo",
      "createBlockFile",
      "getBlockFileList",
      "getBlockVideosList",
      "createBlockImage",
      "deleteBlockImage",
      "createBlockVideo",
      "deleteBlockVideo",
      "getBlockYoutubeVideoList",
      "createBlockYoutubeVideo",
      "updateBlockYoutubeVideo",
      "deleteBlockYoutubeVideo"
    ]),
    make_collaction(langs) {
      JSON.parse(langs).forEach(el => {
        this.file_form.push({
          title: "",
          description: "",
          name: el.name
        });
        console.log(this.file_form);
      });
    },
    // .....................upload new image ......................

    createImage(value) {
      console.log(value);
      this.createBlockImage({
        info: value.info,
        image: value.image ? value.image : null,
        id: this.pageId
      });
    },
    // .....................upload new video ......................
    createVideo(value) {
      console.log(value);
      this.createBlockVideo({
        info: value.info,
        video: value.video ? value.video : null,
        id: this.blockId
      });
    },
    // -----------------------------gallery----------------------------

    // gallery
    // -------------------------------files---------------------------
    openFile() {
      this.getBlockFileList({ id: this.blockId });
    },
    file_Action(value, item) {
      console.log(item);
      if (value == 1) {
        window.open(item.path);
      } else {
        this.deleteBlockFile({
          type: "files",
          blockId: this.blockId,
          file_id: item.id
        });
      }
    },
    videos_Action(value, item) {
      console.log(item);
      if (value == 1) {
        window.open(item.path);
      } else {
        this.deleteBlockVideo({
          blockId: this.blockId,
          file_id: item.id
        });
      }
    },
    openYoutubeVideo() {
      this.getBlockYoutubeVideoList({ id: this.blockId });
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
            console.log("update");
            this.youtube_form.ar_title = item.locales.ar.title;
            this.youtube_form.ar_description = item.locales.ar.description;
            this.youtube_form.en_title = item.locales.en.title;
            this.youtube_form.en_description = item.locales.en.description;
            this.youtube_form.path = item.path;
          }
          break;
        case 3:
          {
            console.log("delete");
            this.deleteBlockYoutubeVideo({
              blockId: this.blockId,
              youtube_id: item.id
            });
          }
          break;
      }
      // if (value == 1) {
      //   window.open(item.path);
      // } else {
      //   this.deleteBlockYoutubeVideo({
      //     blockId: this.blockId,
      //     youtube_id: item.id
      //   });
      // }
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    onValitadeFormSubmit() {
      // window.top.close();
      this.$v.$touch();
      this.$v.file_form.$touch();
      if (!this.$v.file_form.$invalid) {
        this.createBlockFile({
          info: this.$v.file_form.$model,
          file: this.file ? this.file[0] : null,
          id: this.blockId
        });
      }
    },
    onValitadeYoutubeFormSubmit() {
      this.$v.$touch();
      this.$v.youtube_form.$touch();
      if (!this.$v.youtube_form.$invalid) {
        this.enable_tube = true;
        if (!this.edit) {
          this.createBlockYoutubeVideo({
            info: {
              "ar[title]": this.youtube_form.ar_title,
              "ar[description]": this.youtube_form.ar_description,
              "en[title]": this.youtube_form.en_title,
              "en[description]": this.youtube_form.en_description,
              path: this.youtube_form.path
            },
            id: this.blockId
          });
        } else {
          this.updateBlockYoutubeVideo({
            info: {
              "ar[title]": this.youtube_form.ar_title,
              "ar[description]": this.youtube_form.ar_description,
              "en[title]": this.youtube_form.en_title,
              "en[description]": this.youtube_form.en_description,
              path: this.youtube_form.path
            },
            attachment_id: this.attachment_id,
            id: this.blockId
          });
        }
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
      this.getBlockVideosList({ id: this.blockId });
    },
    // videos

    deleteImage(id) {
      this.deleteBlockImage({ id: this.blockId, attachment_id: id });
    }
  },
  computed: {
    ...mapGetters([
      "_blockImageList",
      "_blockFileList",
      "_sccussCreateBlockFile",
      "_blockVideosList",
      "_blockYoutubeVideosList",
      "_isBLoadAttach",
      "_BwrongYoutubeurl",
      "_successAddBlockYoutubeVideo"
    ])
  },
  watch: {
    _blockImageList: function(val) {},
    _blockFileList(newData, old) {
      this.$refs.vuetable.setData(newData);
    },

    _blockVideosList(newData, old) {
      console.log("i am here");
      this.$refs.video_vuetable.setData(newData);
    },
    _blockYoutubeVideosList(newData, old) {
      this.$refs.youtubeVideo_vuetable.setData(newData);

      this.edit = false;
    },
    _successAddBlockYoutubeVideo: function(val) {
      this.enable_tube = false;
      this.youtube_form.ar_title = null;
      this.youtube_form.ar_description = null;
      this.youtube_form.en_title = null;
      this.youtube_form.en_description = null;
      this.youtube_form.path = null;
    },
    _BwrongYoutubeurl: function(val) {
      this.enable_tube = false;
      this.youtube_form.path = null;

      this.$notify(
        "error",
        "Error via Create",
        "This Youtube Url isn't valid",
        { duration: 4000, permanent: false }
      );
    },
    _sccussCreateBlockFile: function(val) {
      this.form.en_title = null;
      this.form.ar_title = null;
      this.form.en_description = null;
      this.form.ar_description = null;
      this.file = null;
      this.$refs.myVueDropzone.removeFile();
    }
  }
};
</script>
