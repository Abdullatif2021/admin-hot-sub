<template>
  <b-row>
    <b-colxx xxs="12">
      <h5 class="mb-4 card-title">{{ $t("cards.page-details") }}</h5>
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <b-card class="mb-4" no-body>
            <b-tabs card no-fade>
              <b-tab
                title="Basis details"
                active
                title-item-class="w-30 text-center"
              >
                <label
                  style="display: flex;justify-content: center;"
                  class="form-group has-float-label"
                >
                  <img
                    :src="pageData.image"
                    style="border-radius: 20%;"
                    alt="Image"
                    width="120"
                    height="120"
                  />
                </label>

                <label class="form-group has-float-label">
                  <input
                    type="text"
                    v-model="pageData.locales.en.name"
                    class="form-control"
                  />
                  <span>{{ $t("forms.name") }}</span>
                </label>
                <quill-editor
                  ref="myTextEditor"
                  v-model="pageData.locales.en.description"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                >
                </quill-editor>
                <label class="form-group has-float-label">
                  <b-colxx xxs="12" style="padding: 0px;margin-top: 20px;">
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
                  <span>Image</span>
                </label>
                <b-colxx
                  xxs="12"
                  style="display: flex;align-items: center;justify-content: center;"
                >
                  <!-- <h3>{{ items.length }}</h3> -->
                  <b-button
                    @click="save()"
                    class="mb-2"
                    size="lg"
                    variant="primary"
                    >{{ $t("button.save") }}
                    {{ $t("button.changes") }}</b-button
                  >
                </b-colxx>
              </b-tab>
              <b-tab
                @click="attach()"
                title="Attachment"
                title-item-class="w-30 text-center"
              >
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
                  <LightGallery
                    :images="images"
                    :index="photoIndex"
                    :disable-scroll="true"
                    @close="handleHide()"
                  />
                </div>
                <add-new-modal :pageId="pageId"></add-new-modal>
              </b-tab>
              <b-tab
                @click="meta()"
                title="Meta Data"
                title-item-class="w-30 text-center"
              >
                <b-row>
                  <b-colxx xs="12" md="6" class="mb-3">
                    <b-card>
                      <vuetable
                        ref="vuetable"
                        :api-mode="false"
                        :data-total="dataCount"
                        :per-page="perPage"
                        :data-manager="dataManager"
                        :reactive-api-url="true"
                        :fields="fields"
                        pagination-path
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
                              @click="
                                editAction(item.name, item.value, props.rowData)
                              "
                              >{{ item.name }}</b-dropdown-item
                            >
                          </b-dropdown>
                        </template>
                      </vuetable>
                    </b-card>
                    <!-- <vuetable-pagination-bootstrap
                      class="mt-4"
                      ref="pagination"
                      @vuetable-pagination:change-page="onChangePage"
                    /> -->
                  </b-colxx>
                  <b-colxx xs="12" md="6" class="mb-3">
                    <b-card
                      class="mb-4"
                      :title="edit ? $t('forms.edit') : $t('forms.create')"
                    >
                      <b-form
                        @submit.prevent="onValitadeFormSubmit()"
                        class="av-tooltip tooltip-label-right"
                      >
                        <b-form-group label="Option">
                          <b-form-select
                            @change="typeSelect()"
                            v-model.trim="select"
                            :options="selectOptions"
                            plain
                          />

                          <b-form-invalid-feedback
                            >Please select an option!</b-form-invalid-feedback
                          >
                        </b-form-group>
                        <b-form-group label="Details">
                          <b-textarea v-model.trim="detail"></b-textarea>
                          <b-form-invalid-feedback
                            >Please enter some details!</b-form-invalid-feedback
                          >
                        </b-form-group>

                        <b-button
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
                </b-row>
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
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");
import { LightGallery } from "vue-light-gallery";
const images = [
  "/assets/img/products/fruitcake.jpg",
  "/assets/img/products/napoleonshat.jpg",
  "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg",
  "/assets/img/products/marble-cake.jpg",
  "/assets/img/products/parkin.jpg"
];
const thumbs = [
  "/assets/img/products/fruitcake-thumb.jpg",
  "/assets/img/products/napoleonshat-thumb.jpg",
  "/assets/img/products/tea-loaf-thumb.jpg",
  "/assets/img/products/magdalena-thumb.jpg",
  "/assets/img/products/marble-cake-thumb.jpg",
  "/assets/img/products/parkin-thumb.jpg"
];
export default {
  components: {
    "add-new-modal": AddNewModal,
    "quill-editor": quillEditor,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "vue-dropzone": VueDropzone,
    LightGallery
  },
  data() {
    return {
      // LightGaller
      images,
      thumbs,
      isOpen: false,
      photoIndex: null,
      // LightGallery
      pageId: null,
      pageData: null,
      _data: null,
      edit: false,
      itemId: null,
      meta_type_id: null,
      textarea: null,
      file: null,
      itemForEdit: null,
      selectOptions: [],
      select: "",
      detail: "",
      // vue table-2
      Options: [
        { name: "EDIT", value: 1 },
        { name: "DELETE", value: 0 }
      ],
      sort: "",
      dataCount: 0,

      // page: 1,
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
          name: "locales",
          callback: value => {
            return value.en.meta_content;
          },
          title: "Content",
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
      // vue dropezone
      dropzoneOptions: {
        url:
          "https://lilacmarketingevents.com/tarrab-api/public/api/blocks/images/54?en[title]=dddddddddddddd&en[description]=dddddddddddddd",
        thumbnailHeight: 160,
        maxFilesize: 2,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
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
    select: {
      required
    },
    detail: {
      required
    }
  },

  created() {
    this.pageId = this.$route.query.id;
    this.getPage({ id: this.pageId });

    console.log("hi from here", this.pageId);
  },
  methods: {
    ...mapActions([
      "getPage",
      "getPageMeta",
      "updatePageData",
      "updatePageData",
      "getMetaList",
      "deleteMetaPage",
      "updateMetaPage",
      "createMetaPage",
      "getMetaTypeList",
      "getPageImageList",
      "deletePageImage"
    ]),
    // gallery
    onThumbClick(index) {
      this.photoIndex = index;
      this.isOpen = true;
    },
    handleHide() {
      this.photoIndex = null;
      this.isOpen = false;
    },
    deleteImage(thumb) {
      console.log(thumb);
      this.deletePageImage({ id: this.pageId, attachment_id: thumb.id });
    },
    // gallery
    save() {
      console.log(this.pageData);
      this.updatePageData({
        id: this.pageData.id,
        data: this.pageData,
        file: this.file ? this.file[0] : null
      });
    },
    attach() {
      this.getPageImageList({ id: this.pageId });
    },

    typeSelect() {},
    modify() {
      console.log("hereeee");
    },
    onValitadeFormSubmit() {
      this.$v.$touch();
      console.log(
        JSON.stringify({
          select: this.select,
          detail: this.detail
        })
      );
      if (!this.edit) {
        this.createMetaPage({
          meta_type_id: this.select,
          pageId: this.pageId,
          metadata_id: this.itemId,
          content: this.detail
        });
        setTimeout(() => {
          this.edit = false;
          this.select = null;
          this.detail = null;
        }, 1000);
      } else {
        this.updateMetaPage({
          meta_type_id: this.select,
          pageId: this.pageId,
          metadata_id: this.itemId,
          content: this.detail
        });
        // setTimeout(() => {
        //   this.edit = false;
        //   this.select = null;
        //   this.detail = null;
        // }, 1000);
      }
    },
    onEditorBlur(editor) {
      console.log("editor blur!", editor);
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
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.contentBubble = html;
    },

    // meta data
    meta() {
      this.getMetaList({ id: this.pageId });
      setTimeout(() => {
        this.getMetaTypeList();
      }, 2000);
      // this.getMetaTypeList();
    },
    editAction(f, value, item) {
      if (value == 1) {
        this.edit = true;
        this.itemId = item.id;
        this.select = item.meta_type_id;
        this.detail = item.locales.en.meta_content;
      } else {
        this.edit = false;
        this.select = null;
        this.detail = null;
        this.deleteMetaPage({ pageId: this.pageId, metadata_id: item.id });
      }
    },

    dataManager(sortOrder, pagination) {
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getUsersList({
            role: this.sort.column,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";
          this.getUsersList({
            role: this.sort.column,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    }
    // meta data
  },
  computed: {
    ...mapGetters([
      "_page",
      "metaList",
      "_updateMetaPage",
      "_metaTypeList",
      "_pageImageList"
    ]),
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  watch: {
    _page(newpage, oldone) {
      this.pageData = newpage;
    },
    metaList(newList, old) {
      this.$refs.vuetable.setData(newList);
    },
    _pageImageList(newData, old) {
      console.log("_pageImageList", newData);
    },
    _updateMetaPage(newActions, old) {
      this.edit = false;
      this.select = null;
      this.detail = null;
    },
    _metaTypeList(newContent, old) {
      newContent.forEach(option => {
        this.selectOptions.push(
          new Object({
            value: option.id,
            text: option.type
          })
        );
      });
    }
  }
};
</script>
