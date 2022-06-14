<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :transaction_filter="false"
        :reload="true"
        :add_new_button="false"
        :title="$t('cards.page-details')"
      ></datatable-heading>
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <!-- <template> -->
          <b-card class="mb-4" no-body>
            <b-tabs card no-fade>
              <b-tab
                :title="$t(`forms.basic_details`)"
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
                  <div
                    v-for="(lang, index) in $v.details_form.$each.$iter"
                    :key="index"
                  >
                    <label class="form-group has-float-label">
                      <b-input
                        type="text"
                        v-model="lang.name.$model"
                        :state="!lang.name.$error"
                        class="form-control"
                      />
                      <span>{{ $t(`forms.${lang._name.$model}_name`) }}</span>

                      <b-form-invalid-feedback v-if="!lang.name.required">{{
                        $t("forms.title_filed")
                      }}</b-form-invalid-feedback>
                    </label>
                    <label class="form-group has-float-label">
                      <quill-editor
                        ref="myTextEditor"
                        v-model="lang.description.$model"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)"
                      >
                      </quill-editor>
                      <span>{{ $t(`forms.${lang._name.$model}_desc`) }}</span>
                    </label>
                  </div>
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
                    <span>{{ $t("forms.image") }}</span>
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
                :title="$t('forms.attach')"
                title-item-class="w-30 text-center"
              >
                <page_attachment :pageId="pageId" />
              </b-tab>
              <b-tab
                @click="meta()"
                :title="$t('forms.meta_data')"
                title-item-class="w-30 text-center"
              >
                <b-row>
                  <template v-if="is_LoadMeta">
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
                                >{{ $t(item.name) }}</b-dropdown-item
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
                          <b-form-group :label="$t('forms.type')">
                            <b-form-select
                              v-model="$v.select_form.select.$model"
                              :state="!$v.select_form.select.$error"
                              :options="selectOptions"
                              plain
                            />
                            <b-form-invalid-feedback
                              v-if="!$v.select_form.select.required"
                              >{{
                                $t("forms.select_massege")
                              }}</b-form-invalid-feedback
                            >
                          </b-form-group>
                          <div
                            v-for="(lang, index) in $v.meta_form.$each.$iter"
                            :key="index"
                          >
                            <b-form-group
                              :label="$t(`forms.${lang._name.$model}_content`)"
                              class="has-float-label mb-4"
                            >
                              <b-form-input
                                type="text"
                                v-model="lang.content.$model"
                                :state="!lang.content.$error"
                              />
                              <b-form-invalid-feedback
                                v-if="!lang.content.required"
                                >{{
                                  $t("forms.content_massege")
                                }}</b-form-invalid-feedback
                              >
                            </b-form-group>
                          </div>

                          <b-button
                            type="submit"
                            variant="primary"
                            class="mt-4"
                            :disabled="enable"
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
      langs: null,
      meta_form: [],
      details_form: [],
      select_form: {
        select: ""
      },
      // select: "",
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
    meta_form: {
      $each: {
        content: {
          required
        },
        _name: {}
      }
    },
    select_form: {
      select: { required }
    },
    details_form: {
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
    this.pageId = this.$route.query.id;
    this.getPage({ id: this.pageId });
    this.langs = localStorage.getItem("Languages");
    console.log("Languages", this.langs);
    this.make_collaction(this.langs, this.meta_form);
    this.make_collaction2(this.langs, this.details_form);
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
    make_collaction(langs, form) {
      console.log(langs, form);
      JSON.parse(langs).forEach(el => {
        form.push({
          content: "",
          _name: el.name
        });
      });
    },
    make_collaction2(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          name: "",
          description: "",
          _name: el.name
        });
      });
    },
    save() {
      console.log(this.pageData);
      this.$v.$touch();
      this.$v.details_form.$touch();
      if (!this.$v.details_form.$invalid) {
        this.enable = true;
        this.updatePageData({
          id: this.pageData.id,
          data: {
            link1: this.pageData.link1,
            link2: this.pageData.link2,
            type: this.pageData.type
          },
          info: this.$v.details_form.$model,
          file: this.file ? this.file[0] : null
        });
      }
    },
    attach() {
      this.getPageImageList({ id: this.pageId });
    },

    onValitadeFormSubmit() {
      this.$v.$touch();
      this.$v.meta_form.$touch();
      this.$v.select_form.$touch();

      console.log(this.$v.meta_form.$model);

      if (!this.$v.meta_form.$invalid && !this.$v.select_form.$invalid) {
        this.enable = true;

        if (!this.edit) {
          this.createMetaPage({
            meta_type_id: this.select_form.select,
            pageId: this.pageId,
            info: this.$v.meta_form.$model
          });
        } else {
          this.updateMetaPage({
            meta_type_id: this.select_form.select,
            pageId: this.pageId,
            metadata_id: this.itemId,
            info: this.$v.meta_form.$model
          });
        }
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
        this.select_form.select = item.meta_type_id;
        this.meta_form.forEach(el => {
          switch (el.name) {
            case "en":
              el.content = item.locales.en.meta_content;
              break;
            case "ar":
              el.content = item.locales.ar.meta_content;
              break;
            default:
              break;
          }
        });
      } else {
        this.edit = false;
        this.select_form.select = null;
        this.meta_form.forEach(el => {
          el.content = null;
        });

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
      "is_LoadMeta",
      "_updatePageDetailsSuccess"
    ]),
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  watch: {
    _page(newpage, oldone) {
      this.details_form.forEach(el => {
        switch (el._name) {
          case "en":
            el.name = newpage.locales.en.name;
            el.description = newpage.locales.en.description;

            break;
          case "ar":
            el.name = newpage.locales.ar.name;
            el.description = newpage.locales.ar.description;
            break;
          default:
            break;
        }
      });
      this.pageData = newpage;
      this.enable = false;
    },
    _metaList(newList, old) {
      this.enable = false;

      this.meta_form.forEach(el => {
        el.content = null;
      });
      this.select_form.select = null;

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
      this.select_form.select = null;
      this.meta_form.forEach(el => {
        el.content = null;
      });
    },
    is_LoadMeta(v, o) {
      this.edit = false;
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
