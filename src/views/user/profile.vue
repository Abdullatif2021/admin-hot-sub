<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="form-side">
          <h6 class="mb-4">Update profile</h6>
          <b-form @submit.prevent="onTopLabelsOverLineFormSubmit">
            <label class="form-group has-float-label">
              <b-form-group
                :label="$t('forms.first_name')"
                class="has-float-label mb-4"
              >
                <b-form-input
                  type="text"
                  v-model="$v.form.first_name.$model"
                  :state="!$v.form.first_name.$error"
                />
                <b-form-invalid-feedback v-if="!$v.form.first_name.required"
                  >Please enter your first name</b-form-invalid-feedback
                >
              </b-form-group>
            </label>
            <label class="form-group has-float-label">
              <b-form-group
                :label="$t('forms.last_name')"
                class="has-float-label mb-4"
              >
                <b-form-input
                  type="text"
                  v-model="$v.form.last_name.$model"
                  :state="!$v.form.last_name.$error"
                />
                <b-form-invalid-feedback v-if="!$v.form.last_name.required"
                  >Please enter your last name</b-form-invalid-feedback
                >
              </b-form-group>
            </label>
            <div class="form-group has-float-label">
              <b-form-group
                :label="$t('forms.phone_number')"
                class="has-float-label mb-4"
              >
                <b-form-input
                  type="number"
                  v-model="$v.form.phone_number.$model"
                  :state="!$v.form.phone_number.$error"
                />
                <b-form-invalid-feedback v-if="!$v.form.phone_number.required"
                  >Please enter your phone number</b-form-invalid-feedback
                >
              </b-form-group>
            </div>
            <div class="form-group has-float-label">
              <datepicker
                :bootstrap-styling="true"
                :placeholder="$t('form-components.date')"
                v-model="dob"
                @selected="selected_Date()"
              ></datepicker>
              <span>Date of Birth</span>
            </div>
          </b-form>
        </div>
        <div class="form-side" style="margin-top: 19px;">
          <h6 class="mb-4"></h6>

          <b-form @submit.prevent="onTopLabelsOverLineFormSubmit">
            <label class="form-group has-float-label">
              <b-form-group
                :label="$t('forms.email')"
                class="has-float-label mb-4"
              >
                <b-form-input
                  type="email"
                  v-model="$v.form.email.$model"
                  :state="!$v.form.email.$error"
                />
                <b-form-invalid-feedback v-if="!$v.form.email.required"
                  >Please enter your email
                </b-form-invalid-feedback>
              </b-form-group>
            </label>
            <label class="form-group has-float-label">
              <b-form-select
                v-model="$v.form.gender.$model"
                :options="genderOptions"
                plain
              />
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
                  @vdropzone-removed-file="fileRemoved"
                ></vue-dropzone>
              </b-colxx>
              <span>Image</span>
            </label>

            <b-button
              :disabled="enable"
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
import router from "../../router";
import vSelect from "vue-select";
import { adminRoot } from "../../constants/config";
import "vue-select/dist/vue-select.css";
import Datepicker from "vuejs-datepicker";
import InputTag from "../../components/Form/InputTag";
import { getDirection, getCurrentUser } from "../../utils";
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
const { required, email } = require("vuelidate/lib/validators");
export default {
  components: {
    "input-tag": InputTag,
    "v-select": vSelect,
    "vue-dropzone": VueDropzone,
    datepicker: Datepicker
  },
  data() {
    return {
      user: null,
      selectedDate: false,
      file: null,
      enable: false,
      dob: null,
      gender: null,
      sendSuccess: false,
      genderOptions: [
        { text: "Female", value: 1 },
        { text: "Male", value: 0 }
      ],
      form: {
        first_name: "",
        last_name: "",
        phone_number: "",
        dob: "",
        email: "",
        gender: "",
        image: ""
      },
      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
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
      direction: getDirection().direction,
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
  mixins: [validationMixin],
  validations: {
    form: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      phone_number: {
        required
      },
      email: {
        required,
        email
      },
      gender: {}
    }
  },
  created() {
    this.user = getCurrentUser();
    this.setData(this.user);
  },
  methods: {
    ...mapActions(["updateUserProfile"]),
    setData(user) {
      this.form.first_name = user.first_name;
      this.form.last_name = user.last_name;
      this.form.email = user.email;
      this.form.phone_number = user.phone_number;
      this.form.gender = user.gender;
      this.dob = user.dob;
      console.log(this.form.last_name);
    },
    submit() {
      this.$v.$touch();
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        console.log(this.form, this.gender, this.dob);
      }
    },
    onTopLabelsOverLineFormSubmit() {
      this.$v.$touch();
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        console.log(this.form, this.gender, this.dob);
        this.enable = true;
        this.updateUserProfile({
          first_name: this.form.first_name,
          last_name: this.form.last_name,
          email: this.form.email,
          phone_number: this.form.phone_number,
          _method: "PUT",
          image: this.file ? this.file[0] : null,
          gender: this.form.gender,
          dob: this.selectedDate
            ? this.dob.toISOString().split("T")[0]
            : this.dob
        });
      }
    },
    afterUploadComplete(response) {},
    selected_Date() {
      this.selectedDate = true;
    },

    fileAdded(file) {
      console.log(file);
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
  },
  computed: {
    ...mapGetters(["_updatedProfileSuccessfuly"])
  },
  watch: {
    user(newInfo, oldOne) {
      console.log("user", newInfo);
    },
    _updatedProfileSuccessfuly(newInfo, oldOne) {
      this.selectedDate = false;
      this.$notify(
        "success",
        "Operation completed successfully",
        "Your Profile updated successfully",
        { duration: 2000, permanent: false }
      );
      setTimeout(() => {
        router.push(adminRoot);
      }, 3000);
    }
  }
};
</script>
