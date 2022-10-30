<template>
    <b-colxx xxs="12">
      <h1>{{title}}</h1>
     
     <piaf-breadcrumb />
     <div class="separator mb-5" />
      <b-card  class="mb-4 addCategoryCard">
        <template>
          <b-form @submit.prevent="onGridFormSubmit">
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" :label="$t(`forms.name`)">
                    <b-form-input type="text" :state="gridForm.name.$error" v-model="gridForm.name.$model"/>
                    <b-form-invalid-feedback v-if="!gridForm.name.required">{{ $t("forms.name_filed") }}</b-form-invalid-feedback>
                </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" :label="$t(`forms.email`)">
                    <b-form-input type="text" :state="gridForm.email.$error" v-model="gridForm.email.$model"/>
                    <!-- <b-form-invalid-feedback v-if="!gridForm.name.required">{{ $t("forms.email_filed") }}</b-form-invalid-feedback> -->
                </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" :label="$t(`forms.phonenumber`)">
                    <b-form-input type="text" :state="gridForm.phone_number.$error" v-model="gridForm.phone_number.$model"/>
                    <!-- <b-form-invalid-feedback v-if="!gridForm.phone_number.required">{{ $t("forms.phonenumber_filed") }}</b-form-invalid-feedback> -->
                </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" label="twitter">
                    <b-form-input type="text" :state="gridForm.twitter.$error" v-model="gridForm.twitter.$model"/>
                    <!-- <b-form-invalid-feedback v-if="!gridForm.twitter.required">{{ $t("forms.name_filed") }}</b-form-invalid-feedback> -->
                </b-form-group>
            </b-colxx>
            <b-colxx xxs="12">
                    <b-form-group class="has-float-label mb-4" :label="$t('forms.icon')">
                        <b-form-input
                        style="display: none;"
                        :state="!$v.icon_form.icon.$error"
                        v-model="$v.icon_form.icon.$model"
                        />
                            <vue-dropzone
                            ref="myVueDropzone"
                            id="dropzone"
                            :options="iconDropzoneOptions"
                            @vdropzone-files-added="iconAdded"
                            @vdropzone-removed-file="iconRemoved"
                            ></vue-dropzone>
                        <b-form-invalid-feedback v-if="!$v.icon_form.icon.required">{{
                        $t("forms.choose-icon-message")
                        }}</b-form-invalid-feedback>
                    </b-form-group>
            </b-colxx>    
                

            <b-button
              :disabled="enable"
              type="submit"
              variant="primary"
              class="mt-4"
              >{{ $t("forms.save") }}</b-button
            >
          </b-form>
        </template>
     
      </b-card>
    </b-colxx>
  </template>

<script>
import { mapActions, mapGetters} from 'vuex';
import { getCurrentLanguage } from "../../../../utils";
import { adminRoot } from "../../../../constants/config";
import { validationMixin } from "vuelidate";
import VueDropzone from "vue2-dropzone";
const { required, email } = require("vuelidate/lib/validators");

export default {
    components: {
    "vue-dropzone": VueDropzone,
    },
    data(){
        return {
            id: null,
            title: null,
            enable: false,
            icon: null,
            gridForm: {
                name: "",
                twitter: "",
                phone_number: "",
                email: ""
            },
            icon_form: {
                icon: null
            },
            iconDropzoneOptions: {
                url: "https://lilacmarketingevents.com",
                thumbnailHeight: 160,
                thumbnailWidth: 150,
                parallelUploads: 3,
                maxFiles: 1,
                uploadMultiple: false,
                autoProcessQueue: false,
                previewTemplate: this.dropzoneTemplate(),
                headers: {},
                acceptedFiles: ".svg"
            },
        }   
    },
    mixins: [validationMixin],
    validations: {
        gridForm: {
            name: { required },
            twitter: {  },
            phone_number: {  },
            email: { email }
        },
        icon_form: {
            icon: { required }
        },
    },
    created(){
        this.id =this.$route.query.id; 
        console.log(this.$route.query.id);
        if(this.$route.query.id){
            this.title = this.$t(`forms.update_owner`)
            this.getOwner({id: this.$route.query.id})

        }else{
            this.title = this.$t(`forms.create_owner`)
        }
    },
    methods: {
        ...mapActions(["getOwner", "createOwner", "updateOwner", "deleteOwner"]),
        onGridFormSubmit: () =>{
            this.$v.$touch();
            this.$v.gridForm.$touch();
            this.$v.icon_form.$touch();
            if (!this.$v.gridForm.$invalid && !this.$v.icon_form.$invalid){
                if (this.id) {
                    this.updateOwner({
                        info: this.updateOwner({
                            info : this.gridForm,
                            icon: this.icon
                        })
                    })
                }else {
                    this.createOwner({
                        info : this.gridForm,
                        icon: this.icon
                    })
                }
            }
        },
        iconAdded(icon) {
            this.icon = icon;
            this.icon_form.icon = 'ok'
        },
        iconRemoved() {
            this.icon = null;
            this.icon_form.icon = null
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
        },
    },
    computed: {
        ...mapGetters(["_getOwner", "_createOwner", "_updateOwner", "_deleteOwner"])
    },
    watch: {
        _getOwner: function (val) {
            console.log(val);
        }
    }
}
</script>