<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :reload="true"
        :title="$t('cards.page-details')"
      ></datatable-heading>
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <!-- <template> -->
          <b-card class="mb-4" no-body>
            <b-tabs card no-fade>
              <b-tab
                title="Basis details"
                active
                title-item-class="w-30 text-center"
              >
                <template v-if="_isLoadPage">
                  <label
                    style="display: flex;justify-content: center;"
                    class="form-group has-float-label"
                  >
                    <img
                      :src="pageData.image ? pageData.image : pageData.image"
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
                    <span>{{ $t("forms.en_name") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <quill-editor
                      ref="myTextEditor"
                      v-model="pageData.locales.en.description"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                    >
                    </quill-editor>
                    <span>{{ $t("forms.en_desc") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <input
                      type="text"
                      v-model="pageData.locales.ar.name"
                      class="form-control"
                    />
                    <span>{{ $t("forms.ar_name") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <quill-editor
                      ref="myTextEditor"
                      v-model="pageData.locales.ar.description"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                    >
                    </quill-editor>
                    <span>{{ $t("forms.ar_desc") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <input
                      type="text"
                      v-model="pageData.type"
                      class="form-control"
                    />
                    <span>{{ $t("forms.type") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <input
                      type="text"
                      v-model="pageData.link1"
                      class="form-control"
                    />
                    <span>{{ $t("forms.link1") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <input
                      type="text"
                      v-model="pageData.link2"
                      class="form-control"
                    />
                    <span>{{ $t("forms.link2") }}</span>
                  </label>
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
                      :disabled="enable"
                      size="lg"
                      variant="primary"
                      >{{ $t("button.save") }}
                      {{ $t("button.changes") }}</b-button
                    >
                  </b-colxx>
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </b-tab>
              <b-tab
                @click="attach()"
                title="Attachment"
                title-item-class="w-30 text-center"
              >
                <page_attachment :pageId="pageId" />
              </b-tab>
              <b-tab
                @click="meta()"
                title="Meta Data"
                title-item-class="w-30 text-center"
              >
                <b-row>
                  <template v-if="_isLoadMeta">
                    <b-colxx xs="12" md="6" class="mb-3">
                      <b-card>
                        <vuetable
                          ref="vuetable"
                          :api-mode="false"
                          :data-total="dataCount"
                          :per-page="perPage"
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
                                  editAction(
                                    item.name,
                                    item.value,
                                    props.rowData
                                  )
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
                              v-model.trim="select"
                              :options="selectOptions"
                              plain
                            />

                            <b-form-invalid-feedback
                              >Please select an option!</b-form-invalid-feedback
                            >
                          </b-form-group>
                          <b-form-group label="English Content">
                            <b-textarea v-model.trim="en_detail"></b-textarea>
                            <b-form-invalid-feedback
                              >Please enter some English
                              content!</b-form-invalid-feedback
                            >
                          </b-form-group>
                          <b-form-group label="Arabic Content">
                            <b-textarea v-model.trim="ar_detail"></b-textarea>
                            <b-form-invalid-feedback
                              >Please enter some Arabic
                              content!</b-form-invalid-feedback
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
                  </template>
                  <template v-else>
                    <div class="loading"></div>
                  </template>
                </b-row>
              </b-tab>
            </b-tabs>
          </b-card>
          <!-- </template>
          <template v-else>
            <div class="loading"></div>
          </template> -->
        </b-colxx>
      </b-row>
    </b-colxx>
  </b-row>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import page_attachment from "./page_attachment.vue";
import { quillEditor } from "vue-quill-editor";
import { mapGetters, mapActions } from "vuex";
import VueDropzone from "vue2-dropzone";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";

export default {
  components: {
    "add-new-modal": AddNewModal,
    "quill-editor": quillEditor,
    vuetable: Vuetable,
    "datatable-heading": DatatableHeading,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "vue-dropzone": VueDropzone,
    page_attachment
  },
  data() {
    return {
      pageId: null,
      pageData: null,
      _data: null,
      itemId: null,
      meta_type_id: null,
      textarea: null,
      file: null,
      itemForEdit: null,
      enable: false,
      selectOptions: [],
      select: "",
      en_detail: "",
      ar_detail: "",
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
      edit: false,
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
            return value.ar.meta_content;
          },
          title: "Arabic Content",
          titleClass: "",
          dataClass: "text-muted",
          width: "40%"
        },
        {
          name: "locales",
          callback: value => {
            return value.en.meta_content;
          },
          title: "English Content",
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
    ar_detail: {
      required
    },
    en_detail: {
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
      "getMetaList",
      "deleteMetaPage",
      "updateMetaPage",
      "createMetaPage",
      "getMetaTypeList",
      "getPageImageList",
      "deletePageImage"
    ]),

    save() {
      console.log(this.pageData);
      this.enable = true;
      this.updatePageData({
        id: this.pageData.id,
        data: {
          link1: this.pageData.link1,
          link2: this.pageData.link2,
          type: this.pageData.type,
          "ar[name]": this.pageData.locales.ar.name,
          "ar[description]": this.pageData.locales.ar.description,
          "en[name]": this.pageData.locales.en.name,
          "en[description]": this.pageData.locales.en.description
        },
        file: this.file ? this.file[0] : null
      });
    },
    attach() {
      // this.getPageImageList({ id: this.pageId });
    },

    onValitadeFormSubmit() {
      this.$v.$touch();
      console.log(
        JSON.stringify({
          select: this.select,
          en_detail: this.en_detail,
          ar_detail: this.ar_detail
        })
      );
      if (!this.edit) {
        this.createMetaPage({
          meta_type_id: this.select,
          pageId: this.pageId,
          metadata_id: this.itemId,
          ar_content: this.ar_detail,
          en_content: this.en_detail
        });
      } else {
        this.updateMetaPage({
          meta_type_id: this.select,
          pageId: this.pageId,
          metadata_id: this.itemId,
          ar_content: this.ar_detail,
          en_content: this.en_detail
        });
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
      this.contentBubble = html;
    },

    // meta data
    meta() {
      this.getMetaList({ id: this.pageId });
      this.getMetaTypeList();
    },
    editAction(f, value, item) {
      if (value == 1) {
        this.edit = true;
        this.itemId = item.id;
        this.select = item.meta_type_id;
        this.en_detail = item.locales.en.meta_content;
        this.ar_detail = item.locales.ar.meta_content;
      } else {
        this.edit = false;
        this.select = null;
        this.en_detail = null;
        this.ar_detail = null;

        this.deleteMetaPage({ pageId: this.pageId, metadata_id: item.id });
      }
    }

    // meta data
  },
  computed: {
    ...mapGetters([
      "_page",
      "_metaList",
      "_updateMetaPage",
      "_pageMetaTypeList",
      "_isLoadPage",
      "_isLoadMeta",
      "_updatePageDetailsSuccess"
    ]),
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  watch: {
    _page(newpage, oldone) {
      this.pageData = newpage;
      this.enable = false;
    },
    _metaList(newList, old) {
      this.$refs.vuetable.setData(newList);
    },
    _updatePageDetailsSuccess(newOne, old) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Page Details have been updated successfully",
        { duration: 3000, permanent: false }
      );
    },

    _updateMetaPage(newActions, old) {
      console.log("_updateMetaPage");
      this.edit = false;
      this.select = null;
      this.en_detail = null;
      this.ar_detail = null;
    },
    _isLoadMeta(v, o) {
      this.edit = false;
      this.select = null;
      this.en_detail = null;
      this.ar_detail = null;
    },
    _pageMetaTypeList(newContent, old) {
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
