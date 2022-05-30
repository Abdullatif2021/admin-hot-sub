<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :reload="true"
        :title="$t('forms.edit_block')"
      ></datatable-heading>
      <b-row>
        <template v-if="isLoadBlock">
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
                      :src="blockData.image"
                      style="border-radius: 20%;"
                      alt="Image"
                      width="120"
                      height="120"
                    />
                  </label>

                  <label class="form-group has-float-label">
                    <input
                      type="text"
                      v-model="blockData.locales.en.name"
                      class="form-control"
                    />
                    <span>{{ $t("forms.en_name") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <quill-editor
                      ref="myTextEditor"
                      v-model="blockData.locales.en.description"
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
                      v-model="blockData.locales.ar.name"
                      class="form-control"
                    />
                    <span>{{ $t("forms.ar_name") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <quill-editor
                      ref="myTextEditor"
                      v-model="blockData.locales.ar.description"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                    >
                    </quill-editor>
                    <span>{{ $t("forms.ar_desc") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <b-form-select
                      v-model="blockData.visible"
                      :options="activeOptions"
                      plain
                    />
                    <span>{{ $t("block.visible") }}</span>
                  </label>
                  <div class="form-group has-float-label">
                    <datepicker
                      :bootstrap-styling="true"
                      :placeholder="$t('form-components.date')"
                      v-model="blockData.post_date"
                      @selected="selectedDate()"
                    ></datepicker>

                    <span>{{ $t("block.post-date") }}</span>
                  </div>

                  <label class="form-group has-float-label">
                    <input
                      type="text"
                      v-model="blockData.url"
                      class="form-control"
                    />
                    <span>{{ $t("block.url") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <b-form-select
                      v-model="blockData.block_category_id.id"
                      :options="categoryIdOptions"
                      plain
                    />
                    <span>{{ $t("block.category") }}</span>
                  </label>

                  <label class="form-group has-float-label">
                    <b-colxx xxs="12" style="padding: 0px;margin-top: 20px;">
                      <vue-dropzone
                        ref="myVueDropzone"
                        id="dropzone"
                        :options="dropzoneImageOptions"
                        @vdropzone-files-added="imageAdded"
                        @vdropzone-complete="afterUploadComplete"
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
                        @vdropzone-complete="afterUploadComplete"
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
                  <block_attachment :blockId="blockId" />
                </b-tab>
                <b-tab
                  @click="meta()"
                  title="Meta Data"
                  title-item-class="w-30 text-center"
                >
                  <b-row>
                    <template v-if="_isLoadBlockMeta">
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
                                :state="!$v.meta_form.select.$error"
                                v-model="$v.meta_form.select.$model"
                                :options="selectOptions"
                                plain
                              />
                              <b-form-invalid-feedback
                                v-if="!$v.meta_form.select.required"
                                >Please select an
                                option!</b-form-invalid-feedback
                              >
                            </b-form-group>
                            <b-form-group label="English Content">
                              <b-textarea
                                v-model="$v.meta_form.en_detail.$model"
                                :state="!$v.meta_form.en_detail.$error"
                              ></b-textarea>
                              <b-form-invalid-feedback
                                v-if="!$v.meta_form.en_detail.required"
                                >Please enter some English
                                content!</b-form-invalid-feedback
                              >
                            </b-form-group>
                            <b-form-group label="Arabic Content">
                              <b-textarea
                                v-model="$v.meta_form.ar_detail.$model"
                                :state="!$v.meta_form.ar_detail.$error"
                              ></b-textarea>
                              <b-form-invalid-feedback
                                v-if="!$v.meta_form.ar_detail.required"
                                >Please enter some Arabic
                                content!</b-form-invalid-feedback
                              >
                            </b-form-group>

                            <b-button
                              type="submit"
                              :disabled="enable"
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
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-row>
    </b-colxx>
  </b-row>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import block_attachment from "./block_attachment.vue";
import { quillEditor } from "vue-quill-editor";
import { mapGetters, mapActions } from "vuex";
import VueDropzone from "vue2-dropzone";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import { validationMixin } from "vuelidate";
import Datepicker from "vuejs-datepicker";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    "add-new-modal": AddNewModal,
    "quill-editor": quillEditor,
    "datatable-heading": DatatableHeading,

    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "vue-dropzone": VueDropzone,
    block_attachment,
    datepicker: Datepicker
  },
  data() {
    return {
      blockId: null,
      blockData: null,
      _data: null,
      isLoadBlock: false,
      enable_basic: false,
      itemId: null,
      meta_type_id: null,
      textarea: null,
      enable: false,
      image: null,
      file: null,
      itemForEdit: null,
      selectOptions: [],
      meta_form: {
        select: "",
        en_detail: "",
        ar_detail: ""
      },

      activeOptions: [
        "",
        { text: "Active", value: 1 },
        { text: "Inactive", value: 0 }
      ],

      // vue table-2
      Options: [
        { name: "EDIT", value: 1 },
        { name: "DELETE", value: 0 }
      ],
      sort: "",
      dataCount: 0,
      dateSelected: false,
      // page: 1,
      perPage: 12,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      categoryIdOptions: [],
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
    meta_form: {
      select: {
        required
      },
      ar_detail: {
        required
      },
      en_detail: {
        required
      }
    }
  },

  created() {
    this.blockId = this.$route.query.id;
    this.getBlock({ id: this.blockId });

    console.log("hi from here", this.blockId);
    this.getBlockCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions([
      "getBlock",
      "getBlockMetaList",
      "updateBlockData",
      "deleteBlockMeta",
      "getBlockCategories",
      "updateBlockMeta",
      "createBlockMeta",
      "getMetaTypeList",
      "getBlockImageList"
    ]),

    save() {
      console.log(this.blockData);
      this.enable_basic = true;
      this.updateBlockData({
        id: this.blockData.id,
        data: this.blockData,
        post_date: this.dateSelected
          ? this.blockData.post_date.toISOString()
          : this.blockData.post_date,
        image: this.image ? this.image[0] : null,

        file: this.file ? this.file[0] : null
      });
    },
    attach() {
      // this.getImageList({ id: this.blockId });
    },
    selectedDate() {
      this.dateSelected = true;
    },
    onValitadeFormSubmit() {
      this.$v.$touch();
      this.$v.meta_form.$touch();
      if (!this.$v.meta_form.$invalid) {
        this.enable = true;
        if (!this.edit) {
          this.createBlockMeta({
            meta_type_id: this.meta_form.select,
            blockId: this.blockId,
            metadata_id: this.itemId,
            ar_content: this.meta_form.ar_detail,
            en_content: this.meta_form.en_detail
          });
        } else {
          this.updateBlockMeta({
            meta_type_id: this.meta_form.select,
            metadata_id: this.itemId,

            blockId: this.blockId,
            ar_content: this.meta_form.ar_detail,
            en_content: this.meta_form.en_detail
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
      this.getBlockMetaList({ id: this.blockId });
      this.getMetaTypeList();
    },
    editAction(f, value, item) {
      if (value == 1) {
        this.edit = true;
        this.itemId = item.id;
        this.meta_form.select = item.meta_type_id;
        this.meta_form.en_detail = item.locales.en.meta_content;
        this.meta_form.ar_detail = item.locales.ar.meta_content;
      } else {
        this.edit = false;
        this.meta_form.select = null;
        this.meta_form.en_detail = null;
        this.meta_form.ar_detail = null;
        this.deleteBlockMeta({ blockId: this.blockId, metadata_id: item.id });
      }
    }

    // meta data
  },
  computed: {
    ...mapGetters([
      "_block",
      "_blockMetaList",
      "_updateMetaBlock",
      "_blockMetaTypeList",
      "_blockCategories",
      "_updateBlockBasicData",
      "_isLoadBlockMeta"
    ]),
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  watch: {
    _updateBlockBasicData(newInfo, oldOne) {
      this.enable_basic = false;
      this.$notify(
        "success",
        "Operation completed successfully",
        "Block Details have been updated successfully",
        { duration: 3000, permanent: false }
      );
    },
    _block(newOne, oldone) {
      this.isLoadBlock = true;
      this.blockData = newOne;
      this.dateSelected = false;
    },
    _blockMetaList(newList, old) {
      this.isLoadBlock = true;
      this.enable = false;
      this.$refs.vuetable.setData(newList);
    },

    _updateMetaBlock(newActions, old) {
      this.edit = false;
      this.enable = false;

      this.meta_form.select = null;
      this.meta_form.en_detail = null;
      this.meta_form.ar_detail = null;
    },
    _blockCategories(newval, old) {
      newval.forEach(option => {
        this.categoryIdOptions.push(
          new Object({
            value: option.id,
            text: option.slug
          })
        );
      });
    },
    _blockMetaTypeList(newContent, old) {
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
