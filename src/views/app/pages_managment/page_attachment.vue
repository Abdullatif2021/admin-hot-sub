<template>
  <b-colxx xxs="12" xs="12" lg="12">
    <b-card class="mb-4" no-body>
      <b-tabs card no-fade>
        <b-tab :title="$t('forms.images')" active>
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
            :_sccussCreateImage="_sccussCreatePageImage"
            @AddNewImage="createImage"
          ></add-new-modal>
        </b-tab>
        <b-tab @click="openFile()" :title="$t('forms.files')">
          <file
            :list="_pageFileList"
            :isLoad="_isLoadAttach"
            @delete-file="delete_File"
            @create-file="create_File"
          />
        </b-tab>
        <b-tab @click="openVideo()" :title="$t('forms.videos')">
          <b-row>
            <template v-if="_isLoadAttach">
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
              <add-new-video-model @AddNewVideo="createVideo" />
            </template>
            <template v-else>
              <div class="loading"></div>
            </template>
          </b-row>
        </b-tab>
        <b-tab @click="openYoutubeVideo()" :title="$t('forms.youtube_videos')">
          <b-row>
            <template v-if="_isLoadAttach">
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
                        <b-form-invalid-feedback
                          v-if="!lang.description.required"
                        >
                          {{ $t("forms.desc_filed") }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </div>

                    <b-form-group
                      :label="$t('block.path')"
                      class="has-float-label mb-4"
                    >
                      <b-form-input
                        type="text"
                        v-model="$v.path_form.path.$model"
                        :state="!$v.path_form.path.$error"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.path_form.path.required"
                        >{{
                          $t("forms.youtube_filed")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>

                    <b-button
                      :disabled="enable"
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
import file from "../../../components/shared/file.vue";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    file: file,
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
      youtube_form: [],
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
      path_form: {
        path: ""
      },
      to: 0,
      total: 0,
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
      edit: false,
      youtube_Options: [
        { name: "OPEN", value: 1 },
        { name: "UPDATE", value: 2 },
        { name: "DELETE", value: 3 }
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
    
    };
  },
  mixins: [validationMixin],
  validations: {
    youtube_form: {
      $each: {
        title: {
          required
        },
        description: {},
        name: {}
      }
    },
    path_form: {
      path: { required }
    }
    //   files
  },
  created() {
    console.log(this.pageId);
    this.getPageImageList({ id: this.pageId });
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.youtube_form);
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
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          title: "",
          description: "",
          name: el.name
        });
      });
    },
    // .....................upload new image ......................

    createImage(value) {
      console.log(value);
      this.enable = true;
      this.createPageImage({
        info: value.info,
        image: value.image ? value.image : null,
        id: this.pageId
      });
    },
    // .....................upload new video ......................
    createVideo(value) {
      this.createPageVideo({
        info: value.info,
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
    create_File(info, path) {
      console.log("hi from createee", info, path);
      this.createPageFile({ info: info, file: path, id: this.pageId });
    },
    delete_File(id) {
      this.deletePageFile({ pageId: this.pageId, file_id: id });
    },
    videos_Action(value, item) {
      console.log(item);
      if (value == 1) {
        window.open(item.path);
      } else {
        this.deletePageVideo({
          pageId: this.pageId,
          file_id: item.id
        });
      }
    },
   
   
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
      this.$v.path_form.$touch();
      if (!this.$v.youtube_form.$invalid && !this.$v.path_form.$invalid) {
        this.enable = true;
        if (!this.edit) {
          this.createPageYoutubeVideo({
            info: this.$v.youtube_form.$model,
            path: this.path_form.path,
            id: this.pageId
          });
        } else {
          this.updatePageYoutubeVideo({
            info: this.$v.youtube_form.$model,
            path: this.path_form.path,
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
            this.youtube_form.forEach(el => {
              switch (el.name) {
                case "en":
                  el.title = item.locales.en.title;
                  el.description = item.locales.en.description;

                  break;
                case "ar":
                  el.title = item.locales.ar.title;
                  el.description = item.locales.ar.description;
                  break;
                default:
                  break;
              }
            });

            this.path_form.path = item.path;
          }
          break;
        case 3:
          {
            console.log("delete");
            this.deletePageYoutubeVideo({
              pageId: this.pageId,
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
      "_sccussCreatePageImage",
      "_pageVideosList",
      "_isLoadAttach",
      "_pageYoutubeVideosList",
      "_wrongYoutubeurl"
    ])
  },
  watch: {
    _pageImageList: function(val) {
      console.log("_pageImageList", val);
      this.enable = false;
    },
    _pageFileList(newData, old) {
      this.isLoadAttach = true;
      this.enable = false;
    },
    _pageVideosList(newData, old) {
      this.isLoadAttach = true;
      this.enable = false;

      console.log("i am here");
      this.$refs.video_vuetable.setData(newData);
    },
    _wrongYoutubeurl(newData, old) {
      this.enable = false;
      this.path_form.path = null;

      this.$notify(
        "error",
        "Error via Create",
        "This Youtube Url isn't valid",
        { duration: 4000, permanent: false }
      );
    },
    _pageYoutubeVideosList(newData, old) {
      this.isLoadAttach = true;
      this.enable = false;
      this.$refs.youtubeVideo_vuetable.setData(newData);

      this.youtube_form.forEach(el => {
        console.log(el, "aedfsedfsefsefsef");
        el.title = null;
        el.description = null;
      });
      this.path_form.path = null;
      this.edit = false;
    }
  }
};
</script>
