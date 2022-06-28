<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :reload="true"
        :add_new_button="false"
        :transaction_filter="false"
        :title="$t('forms.edit_block')"
      ></datatable-heading>
      <b-row>
        <template v-if="isLoadBlock">
          <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
            <b-card class="mb-4" no-body>
              <b-tabs card no-fade>
                <b-tab
                  :title="$t(`forms.basic_details`)"
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
                      >
                      </quill-editor>
                      <span>{{ $t(`forms.${lang._name.$model}_desc`) }}</span>
                    </label>
                  </div>

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
                  :title="$t('forms.attach')"
                  title-item-class="w-30 text-center"
                >
                  <block_attachment :blockId="blockId" />
                </b-tab>
                <b-tab
                  @click="meta()"
                  :title="$t('forms.meta_data')"
                  title-item-class="w-30 text-center"
                >
                  <metaData
                    :list="_blockMetaList"
                    :meta_type_list="_blockMetaTypeList"
                    :isLoad="_isLoadBlockMeta"
                    :meta_success_create="_updateMetaBlock"
                    @create-meta="createMeta"
                    @update-meta="updateMeta"
                    @delete-meta="deleteMeta"
                  />
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
import metaData from "../../../components/shared/metaData.vue";

export default {
  components: {
    "add-new-modal": AddNewModal,
    "quill-editor": quillEditor,
    "datatable-heading": DatatableHeading,
    metaData: metaData,
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
      isLoadBlock: false,
      enable_basic: false,
      image: null,
      file: null,
      details_form: [],
      dateSelected: false,
      categoryIdOptions: [],
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
    this.blockId = this.$route.query.id;
    this.getBlock({ id: this.blockId });
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.details_form);
    this.getBlockCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
    this.getBlockMetaTypeList();
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
      "getBlockMetaTypeList",
      "getBlockImageList"
    ]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          name: "",
          description: "",
          _name: el.name
        });
      });
    },
    save() {
      this.$v.$touch();
      this.$v.details_form.$touch();
      if (!this.$v.details_form.$invalid) {
        this.enable_basic = true;
        this.updateBlockData({
          id: this.blockData.id,
          data: {
            visible: this.blockData.visible,
            block_category_id: this.blockData.block_category_id.id,
            url: this.blockData.url,
            post_date: this.dateSelected
              ? this.blockData.post_date.toISOString()
              : this.blockData.post_date
          },
          info: this.$v.details_form.$model,
          image: this.image ? this.image[0] : null,
          file: this.file ? this.file[0] : null
        });
      }
    },
    selectedDate() {
      this.dateSelected = true;
    },
    //  ....................... meta data ................

    meta() {
      this.getBlockMetaList({ id: this.blockId });
    },
    createMeta(select, content) {
      this.createBlockMeta({
        meta_type_id: select,
        blockId: this.blockId,
        info: content
      });
    },
    updateMeta(select, content, id) {
      this.updateBlockMeta({
        meta_type_id: select,
        metadata_id: id,

        blockId: this.blockId,
        info: content
      });
    },
    deleteMeta(id) {
      this.deleteBlockMeta({ blockId: this.blockId, metadata_id: id });
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
    ...mapGetters([
      "_block",
      "_blockMetaList",
      "_updateMetaBlock",
      "_blockMetaTypeList",
      "_blockCategories",
      "_updateBlockBasicData",
      "_isLoadBlockMeta"
    ])
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
      this.details_form.forEach(el => {
        el.name = newOne.locales.[el._name].name;
        el.description = newOne.locales.[el._name].description;

      });
      this.blockData = newOne;
      this.dateSelected = false;
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
    }
  }
};
</script>
