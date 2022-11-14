<template>
    <b-colxx xxs="12">
      <h1>{{title}}</h1>
     
     <piaf-breadcrumb />
     <div class="separator mb-5" />
      <b-card  class="mb-4">
        <template v-if="_isLoadOwners">
          <b-form @submit.prevent="onGridFormSubmit">
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" :label="$t(`forms.name`)">
                    <b-form-input type="text" :state="!$v.gridForm.name.$error" v-model="$v.gridForm.name.$model"/>
                    <b-form-invalid-feedback v-if="!$v.gridForm.name.required">{{ $t("forms.name_filed") }}</b-form-invalid-feedback>
                </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" :label="$t(`forms.email`)">
                    <b-form-input type="text" :state="!$v.gridForm.email.$error" v-model="$v.gridForm.email.$model"/>
                     <b-form-invalid-feedback v-if="!$v.gridForm.email.required">{{ $t("forms.email_filed") }}</b-form-invalid-feedback> 
                </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" :label="$t(`forms.phonenumber`)">
                    <b-form-input type="number" :state="!$v.gridForm.phone_number.$error" v-model="$v.gridForm.phone_number.$model"/>
                    <!-- <b-form-invalid-feedback v-if="!gridForm.phone_number.required">{{ $t("forms.phonenumber_filed") }}</b-form-invalid-feedback> -->
                </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
                <b-form-group class="has-float-label mb-4" label="twitter">
                    <b-form-input type="text" :state="!$v.gridForm.twitter.$error" v-model="$v.gridForm.twitter.$model"/>
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
            <div class="btnContainer">
                <b-button :disabled="enable" type="submit" variant="primary" class="mt-4" >{{ $t("forms.save") }}</b-button>
                <b-button v-if="id" @click="delete_owner"  variant="outline-theme-6" class="mt-4 deleteBtn" >{{ $t("forms.delete") }}</b-button>
            </div>
          </b-form>
        </template>
        <template v-else>
            <div class="loading"></div>
        </template>
      </b-card>
      <b-modal
        id="deleteModal"
        ref="deleteModal"
        :title="$t('modal.modal-delete-owner-title')"
        >
    {{ $t(`forms.delete_owner_message`) }}
    <template slot="modal-footer">
      <b-button
        variant="primary"
        :disabled="disableBtn"
        @click="submitModal"
        class="mr-1"
      >
        {{ $t("button.yes") }}</b-button
      >
      <b-button variant="secondary" @click="hideModal('deleteModal')">{{
        $t("button.no")
      }}</b-button>
    </template>
  </b-modal>
    </b-colxx>
  </template>

<script>
import { mapActions, mapGetters} from 'vuex';
import { getCurrentLanguage } from "../../../../utils";
import { adminRoot } from "../../../../constants/config";
import { validationMixin } from "vuelidate";
import VueDropzone from "vue2-dropzone";
const { required, email } = require("vuelidate/lib/validators");
import router from "../../../../router";


export default {
    components: {
    "vue-dropzone": VueDropzone,
    },
    mixins: [validationMixin],
    validations: {
        gridForm: {
            name: { required },
            twitter: {  },
            phone_number: {  },
            email: {  required }
        },
        icon_form: {
            icon: { required }
        },
    },
    data(){
        return {
            id: null,
            title: null,
            disableBtn: false,
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
    created(){
        this.id =this.$route.query.id; 
        if(this.$route.query.id){
            this.title = this.$t(`forms.update_owner`)
            this.getOwner({id: this.$route.query.id})

        }else{
            this.title = this.$t(`forms.create_owner`)
        }
    },
    methods: {
        ...mapActions(["getOwner", "createOwner", "updateOwner", "deleteOwner"]),
        onGridFormSubmit(){
            
            this.$v.$touch();
            this.$v.gridForm.$touch();
            this.$v.icon_form.$touch();
            if (!this.$v.gridForm.$invalid && !this.$v.icon_form.$invalid){
                this.enable = true;
                if (this.id) {
                    this.updateOwner({
                        info : this.gridForm,
                        icon: this.icon ? this.icon[0] : null,
                        id : this.id
                    }) 
                }else {
                    this.createOwner({
                        info : this.gridForm,
                        icon: this.icon ? this.icon[0] : null
                        
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
        delete_owner(){
            this.$refs["deleteModal"].show();
        },
        hideModal(){
            this.$refs["deleteModal"].hide();
        },
        submitModal(){
            this.disableBtn = true;
            this.deleteOwner({id: this.id});
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
        ...mapGetters(["_getOwner", 
        "_createOwner", 
        "_isLoadOwners",
        "_createOwnerSuccess",
        "_createOwnerError", 
        "_updateOwnerSuccess",
        "_updateOwnerError",
        "_updateOwner", 
        "_deleteOwner",
        "_deleteOwnerSuccess",
        "_deleteOwnerError"])
    },
    watch: {
        _getOwner: function (val) {
            for (const [key, value] of Object.entries(val)) {
                if (this.gridForm.hasOwnProperty(key)) {
                    this.gridForm[key] = value
                }
            }
            if (val.logo) {
                this.icon_form.icon = 'ok'
            }
        },
        _createOwnerSuccess: function(val) {
            this.enable = false;
            this.$notify(
                "success",
                "Operation completed",
                "The Owner Added successfully",
                { duration: 4000, permanent: false }
            );
            router.push(`${adminRoot}/owners`);
            
        },
        _deleteOwnerSuccess: function(val) {
            this.$notify(
                "success",
                "Operation completed",
                "The Owner Deleted successfully",
                { duration: 4000, permanent: false }
            );
            router.push(`${adminRoot}/owners`);
            this.disableBtn = false;
        },
        _deleteOwnerError: function(val) {
            this.$notify(
                "error",
                "Something went wrong",
                "Please try again",
                { duration: 4000, permanent: false }
            );
            this.$refs['deleteModal'].hide();
            this.disableBtn = false;
        },
        _createOwnerError: function(val){
            this.enable = false;
            this.$notify(
                "error",
                "Something went wrong",
                "Please try again",
                { duration: 4000, permanent: false }
            );
        },
        _updateOwnerSuccess: function(val) {
            this.enable = false;
            this.$notify(
                "success",
                "Operation completed",
                "The Owner Updated successfully",
                { duration: 4000, permanent: false }
            );
            router.push(`${adminRoot}/owners`);

        },
        _updateOwnerError: function(val){
            this.enable = false;
            this.$notify(
                "error",
                "Something went wrong",
                "Please try again",
                { duration: 4000, permanent: false }
            );
        }
      }
      
    
}
</script>
<style scoped>
.btnContainer{
    width: 100%;
}
.deleteBtn{
    float: right;
}
</style>