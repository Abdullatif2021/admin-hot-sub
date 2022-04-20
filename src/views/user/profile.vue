<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="form-side">
          <h6 class="mb-4">Update profile</h6>
          <b-form @submit.prevent="onTopLabelsOverLineFormSubmit">
            <label class="form-group has-float-label">
              <input
                type="email"
                class="form-control"
                v-model="user.first_name"
              />
              <span>First Name</span>
            </label>
            <label class="form-group has-float-label">
              <input
                type="text"
                class="form-control"
                v-model="user.last_name"
              />
              <span>Last Name</span>
            </label>
            <div class="form-group has-float-label">
              <input
                type="text"
                class="form-control"
                v-model="user.phone_number"
              />
              <span>Phone Number</span>
            </div>
            <div class="form-group has-float-label">
              <vuejs-datepicker
                :value="4124 / 5 / 5"
                :bootstrap-styling="true"
                :placeholder="user.dob"
                v-model="user.dob"
              ></vuejs-datepicker>
              <span>Date of Birth</span>
            </div>
          </b-form>
        </div>
        <div class="form-side" style="margin-top: 19px;">
          <h6 class="mb-4"></h6>

          <b-form @submit.prevent="onTopLabelsOverLineFormSubmit">
            <label class="form-group has-float-label">
              <input type="email" class="form-control" v-model="user.email" />
              <span>Email</span>
            </label>
            <label class="form-group has-float-label">
              <input type="text" class="form-control" v-model="user.gender" />
              <span>Gender</span>
            </label>
            <label class="form-group has-float-label">
              <b-colxx xxs="12" style="padding: 0px;">
                <vue-dropzone
                  ref="myVueDropzone"
                  id="dropzone"
                  :options="dropzoneOptions"
                  @vdropzone-files-added="fileAdded"
                  @vdropzone-complete="afterUploadComplete"
                  @vdropzone-sending-multiple="sendMessage"
                ></vue-dropzone>
              </b-colxx>
              <span>Image</span>
            </label>

            <b-button
              @click="submit()"
              type="submit"
              variant="primary"
              class="mt-4"
              >{{ $t("forms.submit") }}</b-button
            >
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import VueDropzone from "vue2-dropzone";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Datepicker from "vuejs-datepicker";
import InputTag from "../../components/Form/InputTag";
import { getDirection, getCurrentUser } from "../../utils";
export default {
  components: {
    "input-tag": InputTag,
    "v-select": vSelect,
    "vuejs-datepicker": Datepicker,
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      test: "dfgdfg",
      user: null,
      default: "2018-10-04",

      sendSuccess: false,
      dropzoneOptions: {
        url:
          "https://lilacmarketingevents.com/tarrab-api/public/api/blocks/images/54?en[title]=dddddddddddddd&en[description]=dddddddddddddd",
        thumbnailHeight: 160,
        maxFilesize: 2,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: true,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
      },
      direction: getDirection().direction,
      selectData: [
        { label: "Chocolate", value: "chocolate" },
        { label: "Vanilla", value: "vanilla" },
        { label: "Strawberry", value: "strawberry" },
        { label: "Caramel", value: "caramel" },
        { label: "Cookies and Cream", value: "cookiescream" },
        { label: "Peppermint", value: "peppermint" }
      ],
      topLabelsOverLineForm: {
        email: "",
        password: "",
        tags: [],
        date: null,
        select: "",
        checked: false
      }
    };
  },
  created() {
    this.user = getCurrentUser();
    console.log(this.user);
  },
  methods: {
    submit() {
      console.log(this.user);
    },
    onTopLabelsOverLineFormSubmit() {
      console.log(JSON.stringify(this.topLabelsOverLineForm));
    },
    afterUploadComplete: async function(response) {
      if (response.status == "success") {
        console.log("upload successful");
        this.sendSuccess = true;
      } else {
        console.log("upload failed");
      }
    },
    fileAdded(file) {
      console.log(file);
    },
    shootMessage: async function() {
      this.$refs.myVueDropzone.processQueue();
    },
    sendMessage: async function(files, xhr, formData) {
      // xhr.setOption("url",
      //         "https://lilacmarketingevents.com/tarrab-api/public/api/blocks/images/54?en[title]=dddddddddddddd&en[description]=dddddddddddddd"

      // )
      console.log(files);
      formData.append("peeath", this.test);
      formData.append("peeath", this.test);

      formData.append("path", files[0]);
      console.log("this is file", files);
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
  }
};
</script>
