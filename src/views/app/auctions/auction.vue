<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card
        class="mb-4"
        :title="auctionId ? $t('forms.editCate') : $t('forms.createCate')"
      >
        <b-form @submit.prevent="onGridFormSubmit">
          <b-row>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.en_title')">
                <b-form-input type="text" v-model="gridForm.en_title" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.ar_title')">
                <b-form-input type="text" v-model="gridForm.ar_title" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.en_desc')">
                <b-form-input type="text" v-model="gridForm.en_description" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.ar_desc')">
                <b-form-input type="text" v-model="gridForm.ar_description" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.minimum_price')">
                <b-form-input type="text" v-model="gridForm.minimum_price" />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.opening_price')">
                <b-form-input type="text" v-model="gridForm.opening_price" />
              </b-form-group>
            </b-colxx>

            <b-colxx sm="6">
              <label class="form-group has-float-label">
                <b-form-select
                  v-model="gridForm.categoryId"
                  :options="categoryIdOptions"
                  plain
                />
                <span>{{ $t("forms.category") }}</span>
              </label>
            </b-colxx>
            <b-colxx sm="6">
              <div class="form-group has-float-label">
                <datepicker
                  :bootstrap-styling="true"
                  :placeholder="$t('form-components.date')"
                  v-model="gridForm.start_date"
                  @selected="selectedDate('start')"
                ></datepicker>

                <span>{{ $t("forms.start_date") }}</span>
              </div>
            </b-colxx>
            <b-colxx sm="6">
              <div class="form-group has-float-label">
                <datepicker
                  :bootstrap-styling="true"
                  :placeholder="$t('form-components.date')"
                  v-model="gridForm.end_date"
                  @selected="selectedDate('end')"
                ></datepicker>

                <span>{{ $t("forms.end_date") }}</span>
              </div>
            </b-colxx>
          </b-row>

          <b-button type="submit" variant="primary" class="mt-4">{{
            $t("forms.save")
          }}</b-button>
        </b-form>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import Datepicker from "vuejs-datepicker";
import VueDropzone from "vue2-dropzone";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    "vue-dropzone": VueDropzone,
    datepicker: Datepicker
  },
  data() {
    return {
      auctionId: null,
      _categoryId: null,
      password: null,
      endDateSelected: false,
      startDateSelected: false,
      categoryIdOptions: [],
      create_categoryId: null,
      gridForm: {
        ar_title: "",
        en_title: "",
        en_description: "",
        ar_description: "",
        categoryId: "",
        minimum_price: "",
        start_date: "",
        end_date: "",
        opening_price: "",
        latitude: "",
        longitude: ""
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      en_title: {
        required
      },
      ar_title: {
        required
      },
      categoryId: {
        required
      },
      minimum_price: {
        required
      },
      start_date: {
        required
      },
      opening_price: {
        required
      },
      end_date: {
        required
      }
    }
  },
  created() {
    this.auctionId = this.$route.query.id;
    if (this.auctionId) {
      this.getAuction({ id: this.auctionId });
    } else {
      console.log("i am here ", this.auctionId);
    }
    this.getCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions([
      "getAuction",
      "updateAuction",
      "getCategories",
      "createAuction"
    ]),
    onGridFormSubmit() {
      console.log("img", this.file);
      console.log("hi from submit cate", this.gridForm.categoryId);
      if (this.auctionId) {
        this.updateAuction({
          info: this.gridForm,
          start_date: this.startDateSelected
            ? this.gridForm.start_date.toISOString()
            : this.gridForm.start_date,
          end_date: this.endDateSelected
            ? this.gridForm.end_date.toISOString()
            : this.gridForm.end_date,

          id: this.auctionId
        });
      } else {
        this.createAuction({
          info: this.gridForm
        });
      }
    },
    selectedDate(data) {
      console.log(data);
      if (data === "start") {
        console.log("startttttttttttt");
        this.startDateSelected = true;
      } else {
        this.endDateSelected = true;
      }
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
    ...mapGetters(["auction", "categories", "_updatedAuctionSuccessfuly"])
  },
  watch: {
    auction(newInfo, oldOne) {
      this.gridForm.ar_title = newInfo.locales.ar.title;
      this.gridForm.en_title = newInfo.locales.en.title;
      this.gridForm.ar_description = newInfo.locales.ar.terms_conditions;
      this.gridForm.en_description = newInfo.locales.en.terms_conditions;
      this.gridForm.categoryId = newInfo.categoryId;
      this.gridForm.opening_price = newInfo.opening_price;
      this.gridForm.minimum_price = newInfo.minimum_price;
      this.gridForm.start_date = newInfo.start_date;
      this.gridForm.end_date = newInfo.end_date;
    },
    _updatedAuctionSuccessfuly(newInfo, oldOne) {
      console.log("hiiiiii");
      this.endDateSelected = false;
      this.startDateSelected = false;
      this.$destroy();
    },
    categories(newval, old) {
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
