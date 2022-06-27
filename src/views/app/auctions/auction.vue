<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :add_new_button="false"
        :reload="true"
        :transaction_filter="false"
        :title="auctionId ? $t('forms.editAuction') : $t('forms.createAuction')"
      ></datatable-heading>
      <template v-if="isLoadAuction">
        <b-card v-if="!auctionId" class="mb-4">
          <b-form @submit.prevent="onGridFormSubmit">
            <b-row>
              <b-colxx sm="12">
                <div
                  v-for="(lang, index) in $v.lang_form.$each.$iter"
                  :key="index"
                >
                  <b-form-group :label="$t(`forms.${lang._name.$model}_title`)">
                    <b-form-input
                      type="text"
                      v-model="lang.title.$model"
                      :state="!lang.title.$error"
                    />
                    <b-form-invalid-feedback v-if="!lang.title.required">{{
                      $t(`forms.${lang._name.$model}_massege`)
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group :label="$t(`forms.${lang._name.$model}_desc`)">
                    <b-form-input
                      type="text"
                      v-model="lang.description.$model"
                    />
                  </b-form-group>
                </div>
              </b-colxx>
              <b-colxx sm="12">
                <b-form-group :label="$t('forms.deposit')">
                  <b-form-input
                    type="number"
                    :state="!$v.gridForm.deposit.$error"
                    v-model="$v.gridForm.deposit.$model"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.deposit.required"
                    >{{ $t("forms.deposit_message") }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.minimum_price')">
                  <b-form-input
                    type="number"
                    :state="!$v.gridForm.minimum_paid.$error"
                    v-model="$v.gridForm.minimum_paid.$model"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.minimum_paid.required"
                    >{{ $t("forms.min_price") }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>

              <b-colxx sm="6">
                <b-form-group :label="$t('forms.opening_price')">
                  <b-form-input
                    type="number"
                    :state="!$v.gridForm.opening_price.$error"
                    v-model="$v.gridForm.opening_price.$model"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.opening_price.required"
                    >{{ $t("forms.open_price") }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.category')">
                  <b-form-select
                    :state="!$v.gridForm.category_id.$error"
                    v-model="$v.gridForm.category_id.$model"
                    :options="categoryIdOptions"
                    plain
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.category_id.required"
                    >{{
                      $t("forms.category_type_select")
                    }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.auction_side')">
                  <b-form-select
                    :state="!$v.gridForm.auction_side.$error"
                    v-model="$v.gridForm.auction_side.$model"
                    :options="auctionSideOptions"
                    plain
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.auction_side.required"
                    >{{
                      $t("forms.auction_side_message")
                    }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.city')">
                  <b-form-select
                    :state="!$v.gridForm.city_id.$error"
                    v-model="$v.gridForm.city_id.$model"
                    :options="cityOptions"
                    @change="getArea()"
                    plain
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.city_id.required"
                    >{{ $t("forms.city-message") }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>

              <b-colxx sm="6">
                <b-form-group :label="$t('forms.start_date')">
                  <datepicker
                    style="width: 100%;"
                    type="datetime"
                    value-type="YYYY-MM-DD HH:mm:ss"
                    v-model="$v.gridForm.start_date.$model"
                    @change="selectedDate('start')"
                  ></datepicker>

                  <div
                    :class="{
                      'invalid-feedback': true,
                      'd-block':
                        $v.gridForm.start_date.$error &&
                        !$v.gridForm.start_date.required
                    }"
                  >
                    {{ $t("forms.start_date_req") }}
                  </div>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.area')">
                  <b-form-select
                    :state="!$v.gridForm.area_id.$error"
                    v-model="$v.gridForm.area_id.$model"
                    :options="areaOptions"
                    plain
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.area_id.required"
                    >{{ $t("forms.area-message") }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.end_date')">
                  <datepicker
                    style="width: 100%;"
                    type="datetime"
                    value-type="YYYY-MM-DD HH:mm:ss"
                    v-model="$v.gridForm.end_date.$model"
                    @change="selectedDate('end')"
                  >
                  </datepicker>
                  <div
                    :class="{
                      'invalid-feedback': true,
                      'd-block':
                        $v.gridForm.end_date.$error &&
                        !$v.gridForm.end_date.required
                    }"
                  >
                    {{ $t("forms.end_date_req") }}
                  </div>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.location')">
                  <b-button
                    v-b-modal.maps
                    class="mb-2"
                    block
                    variant="light default"
                    >{{ $t("button.choose-location") }}</b-button
                  >
                  <b-form-input
                    style="display: none;"
                    :state="!$v.gridForm.latitude.$error"
                    v-model="$v.gridForm.latitude.$model"
                  />

                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.latitude.required"
                    >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.image')">
                  <b-form-input
                    style="display: none;"
                    :state="!$v.files_form.image.$error"
                    v-model="$v.files_form.image.$model"
                  />
                  <b-form-file
                    accept="image/*"
                    :placeholder="$t('forms.choose-image')"
                    v-model="image"
                    @change="image_selected()"
                  ></b-form-file>
                  <b-form-invalid-feedback
                    v-if="!$v.files_form.image.required"
                    >{{
                      $t("forms.choose-image-message")
                    }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.brochure')">
                  <b-form-input
                    style="display: none;"
                    :state="!$v.files_form.brochure.$error"
                    v-model="$v.files_form.brochure.$model"
                  />
                  <b-form-file
                    accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                    :placeholder="$t('input-groups.choose-brochure')"
                    v-model="brochure"
                  ></b-form-file>
                  <b-form-invalid-feedback
                    v-if="!$v.files_form.brochure.required"
                    >{{
                      $t("forms.choose-brochure-message")
                    }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.terms_conditions')">
                  <b-form-input
                    style="display: none;"
                    :state="!$v.files_form.terms_conditions.$error"
                    v-model="$v.files_form.terms_conditions.$model"
                  />
                  <b-form-file
                    accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                    :placeholder="$t('input-groups.choose-terms_conditions')"
                    v-model="terms_conditions"
                  ></b-form-file>
                  <b-form-invalid-feedback
                    v-if="!$v.files_form.terms_conditions.required"
                    >{{
                      $t("forms.choose-terms_conditions-message")
                    }}</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
            </b-row>

            <b-button
              :disabled="!disabled"
              type="submit"
              variant="primary"
              class="mt-4"
              >{{ $t("forms.save") }}</b-button
            >
          </b-form>
        </b-card>
        <b-card v-if="auctionId" class="mb-4">
          <b-tabs card no-fade>
            <b-tab
              title-item-class="w-50 text-center"
              title="Basic Details"
              active
            >
              <b-form @submit.prevent="onGridFormSubmit">
                <b-row>
                  <b-colxx sm="12">
                    <div
                      v-for="(lang, index) in $v.lang_form.$each.$iter"
                      :key="index"
                    >
                      <b-form-group
                        :label="$t(`forms.${lang._name.$model}_title`)"
                      >
                        <b-form-input
                          type="text"
                          v-model="lang.title.$model"
                          :state="!lang.title.$error"
                        />
                        <b-form-invalid-feedback v-if="!lang.title.required">{{
                          $t(`forms.${lang._name.$model}_massege`)
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        :label="$t(`forms.${lang._name.$model}_desc`)"
                      >
                        <b-form-input
                          type="text"
                          v-model="lang.description.$model"
                        />
                      </b-form-group>
                    </div>
                  </b-colxx>
                  <b-colxx sm="12">
                    <b-form-group :label="$t('forms.deposit')">
                      <b-form-input
                        type="number"
                        :state="!$v.gridForm.deposit.$error"
                        v-model="$v.gridForm.deposit.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.deposit.required"
                        >{{
                          $t("forms.deposit_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.minimum_price')">
                      <b-form-input
                        type="number"
                        :state="!$v.gridForm.minimum_paid.$error"
                        v-model="$v.gridForm.minimum_paid.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.minimum_paid.required"
                        >{{ $t("forms.min_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>

                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.opening_price')">
                      <b-form-input
                        type="number"
                        :state="!$v.gridForm.opening_price.$error"
                        v-model="$v.gridForm.opening_price.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.opening_price.required"
                        >{{ $t("forms.open_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.category')">
                      <b-form-select
                        :state="!$v.gridForm.category_id.$error"
                        v-model="$v.gridForm.category_id.$model"
                        :options="categoryIdOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.category_id.required"
                        >{{
                          $t("forms.category_type_select")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.auction_side')">
                      <b-form-select
                        :state="!$v.gridForm.auction_side.$error"
                        v-model="$v.gridForm.auction_side.$model"
                        :options="auctionSideOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.auction_side.required"
                        >{{
                          $t("forms.auction_side_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.city')">
                      <b-form-select
                        :state="!$v.gridForm.city_id.$error"
                        v-model="$v.gridForm.city_id.$model"
                        :options="cityOptions"
                        @change="getArea()"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.city_id.required"
                        >{{ $t("forms.city-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>

                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.start_date')">
                      <datepicker
                        style="width: 100%;"
                        type="datetime"
                        value-type="YYYY-MM-DD HH:mm:ss"
                        v-model="$v.gridForm.start_date.$model"
                        @change="selectedDate('start')"
                      >
                      </datepicker>

                      <div
                        :class="{
                          'invalid-feedback': true,
                          'd-block':
                            $v.gridForm.start_date.$error &&
                            !$v.gridForm.start_date.required
                        }"
                      >
                        {{ $t("forms.start_date_req") }}
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.area')">
                      <b-form-select
                        :state="!$v.gridForm.area_id.$error"
                        v-model="$v.gridForm.area_id.$model"
                        :options="areaOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.area_id.required"
                        >{{ $t("forms.area-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.end_date')">
                      <datepicker
                        style="width: 100%;"
                        type="datetime"
                        value-type="YYYY-MM-DD HH:mm:ss"
                        v-model="$v.gridForm.end_date.$model"
                        @change="selectedDate('end')"
                      >
                      </datepicker>
                      <div
                        :class="{
                          'invalid-feedback': true,
                          'd-block':
                            $v.gridForm.end_date.$error &&
                            !$v.gridForm.end_date.required
                        }"
                      >
                        {{ $t("forms.end_date_req") }}
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.location')">
                      <b-button
                        v-b-modal.maps
                        class="mb-2"
                        block
                        @click="openMap()"
                        variant="light default"
                        >{{ $t("button.change-location") }}</b-button
                      >
                      <b-form-input
                        style="display: none;"
                        :state="!$v.gridForm.latitude.$error"
                        v-model="$v.gridForm.latitude.$model"
                      />

                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.latitude.required"
                        >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.image')">
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.image.$error"
                        v-model="$v.files_form.image.$model"
                      />
                      <b-input-group class="mb-3">
                        <b-form-file
                          accept="image/*"
                          :placeholder="image_basename"
                          v-model="image"
                        ></b-form-file>
                        <b-input-group-append>
                          <b-button
                            @click="open($v.files_form.image.$model)"
                            variant="light default"
                            >{{ $t("input-groups.show") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                      <b-form-invalid-feedback
                        v-if="!$v.files_form.image.required"
                        >{{
                          $t("forms.choose-image-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.brochure')">
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.brochure.$error"
                        v-model="$v.files_form.brochure.$model"
                      />
                      <b-input-group class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="$t('input-groups.change-brochure')"
                          v-model="brochure"
                        ></b-form-file>
                        <b-input-group-append>
                          <b-button
                            @click="open($v.files_form.brochure.$model)"
                            variant="light default"
                            :disabled="files_form.brochure == null"
                            >{{ $t("OPEN") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>

                      <b-form-invalid-feedback
                        v-if="!$v.files_form.brochure.required"
                        >{{
                          $t("forms.choose-brochure-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.terms_conditions')">
                      <input
                        style="display: none;"
                        :state="!$v.files_form.terms_conditions.$error"
                        v-model="$v.files_form.terms_conditions.$model"
                      />
                      <b-input-group class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="
                            $t('input-groups.change-terms_conditions')
                          "
                          v-model="terms_conditions"
                        ></b-form-file>
                        <b-input-group-append>
                          <b-button
                            @click="open($v.files_form.terms_conditions.$model)"
                            variant="light default"
                            :disabled="files_form.terms_conditions == null"
                            >{{ $t("OPEN") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                      <b-form-invalid-feedback
                        v-if="!$v.files_form.terms_conditions.required"
                        >{{
                          $t("forms.choose-terms_conditions-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                </b-row>

                <b-button
                  :disabled="!disabled"
                  type="submit"
                  variant="primary"
                  class="mt-4"
                  >{{ $t("forms.save") }}</b-button
                >
              </b-form>
            </b-tab>
            <b-tab
              @click="getAuctionImages({ id: auctionId })"
              title-item-class="w-50 text-center"
              title="Attachments"
            >
              <b-card class="mb-4" no-body>
                <b-tabs card no-fade>
                  <b-tab :title="$t('forms.images')" active>
                    <template v-if="isLoadAuctionImages">
                      <div style="display: grid;">
                        <b-button
                          v-b-modal.modalright
                          variant="primary"
                          style="margin: auto;margin-bottom: 17px;"
                          size="lg"
                          >{{ $t("survey.add-new") }}</b-button
                        >
                        <b-colxx lg="12" xl="12" class="mb-4">
                          <recent-orders
                            @deleteImage="deleteImage"
                            :_ImageList="_Image_List"
                          />
                        </b-colxx>
                      </div>
                      <add-new-modal
                        :enable="enable"
                        :_sccussCreateImage="_createAuctionImage"
                        @AddNewImage="createImage"
                      ></add-new-modal>
                    </template>
                    <template v-else>
                      <div class="loading"></div>
                    </template>
                  </b-tab>
                  <b-tab
                    @click="getAuctionFiles({ id: auctionId })"
                    :title="$t('forms.files')"
                  >
                    <file
                      :list="auctionFileList"
                      :isLoad="_isLoadAuctions"
                      @delete-file="delete_File"
                      @create-file="create_File"
                    />
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-tab>
          </b-tabs>
        </b-card>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-colxx>
    <b-modal id="maps" size="lg" title="Select Location" hide-footer>
      <yandexMap
        :isEdit="isEdit"
        :location="location"
        @select_location="set_location"
      />
    </b-modal>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import router from "../../../router";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
// import Datepicker from "vuejs-datepicker";
import VueDropzone from "vue2-dropzone";
const { required, requiredIf } = require("vuelidate/lib/validators");
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { adminRoot } from "../../../constants/config";
import file from "../../../components/shared/file.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import RecentOrders from "../../../containers/appliaction/RecentOrders.vue";
import yandexMap from "../../../components/shared/yandexMap.vue";

export default {
  components: {
    yandexMap: yandexMap,
    "vue-dropzone": VueDropzone,
    "datatable-heading": DatatableHeading,
    file: file,
    "add-new-modal": AddNewModal,
    datepicker: DatePicker,
    "recent-orders": RecentOrders
  },
  data() {
    return {
      auctionId: null,
      _categoryId: null,
      password: null,
      isEdit: false,
      image: null,
      terms_conditions: null,
      brochure: null,
      isLoadAuctionImages: false,
      disabled: true,
      endDateSelected: false,
      startDateSelected: false,
      isLoadAuction: false,
      enable: false,
      langs: null,
      coords: [],
      location: [],
      country_id: 248,
      categoryIdOptions: [],
      auctionSideOptions: [],
      areaOptions: [],
      auctionFileList: null,
      image_basename: null,
      cityOptions: [],
      files_form: {
        image: null,
        terms_conditions: null,
        brochure: null
      },
      is_city_selected: false,
      create_categoryId: null,
      lang_form: [],
      gridForm: {
        auction_side: null,
        city_id: null,
        area_id: null,
        deposit: null,
        category_id: null,
        minimum_paid: null,
        start_date: null,
        end_date: null,
        opening_price: null,
        latitude: null,
        longitude: null
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    lang_form: {
      $each: {
        title: {
          required
        },
        description: {},
        _name: {}
      }
    },
    gridForm: {
      deposit: {
        required
      },

      auction_side: {
        required
      },

      category_id: {
        required
      },
      city_id: {},
      area_id: {
        required: requiredIf(function() {
          return this.area_req;
        })
      },
      minimum_paid: {
        required
      },
      latitude: {
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
    },
    files_form: {
      image: {
        required
      },
      terms_conditions: {},
      brochure: {}
    }
  },
  created() {
    this.auctionId = this.$route.query.id;
    if (this.auctionId) {
      this.getAuction({ id: this.auctionId });
      this.isEdit = true;
    } else {
      console.log("i am here ", this.auctionId);
      this.isLoadAuction = true;
      this.isEdit = false;
      this.location= null;
    }
    this.getCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
    this.getCities({ country_id: this.country_id });
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.lang_form);
    this.getAuctionSide();
  },
  methods: {
    ...mapActions([
      "getAuction",
      "updateAuction",
      "getCategories",
      "createAuctionImage",
      "deleteAuctionFile",
      "createAuctionFile",
      "getAuctionFiles",
      "getAuctionImages",
      "createAuction",
      "getCities",
      "getAreas",
      "deleteAuctionImage",
      "getAuctionSide"
    ]),
    make_collaction(langs, form) {
      console.log(langs, form);
      JSON.parse(langs).forEach(el => {
        form.push({
          title: "",
          description: "",
          _name: el.name
        });
      });
    },
    onGridFormSubmit() {
      this.$v.$touch();
      this.$v.gridForm.$touch();
      this.$v.lang_form.$touch();
      this.$v.files_form.$touch();
      console.log(
        "this.gridForm this.gridForm",
        this.gridForm,
        this.lang_form,
        this.files_form
      );
      if (
        !this.$v.gridForm.$invalid &&
        !this.$v.lang_form.$invalid &&
        !this.$v.files_form.$invalid
      ) {
        this.disabled = false;
        if (this.auctionId) {
          this.updateAuction({
            info: this.gridForm,
            image: this.image,
            terms_conditions: this.terms_conditions,
            brochure: this.brochure,
            langs: this.lang_form,
            id: this.auctionId
          });
        } else {
          this.createAuction({
            info: this.gridForm,
            image: this.image,
            terms_conditions: this.terms_conditions,
            brochure: this.brochure,
            langs: this.lang_form
          });
        }
      }
    },
    create_File(info, path) {
      console.log("hi from createee", info, path);
      this.createAuctionFile({ info: info, path: path, id: this.auctionId });
    },
    delete_File(id) {
      this.deleteAuctionFile({ id: this.auctionId, fileId: id });
    },
    set_location(data) {
      this.gridForm.latitude = data[0];
      this.gridForm.longitude = data[1];
    },
    getArea() {
      console.log(this.gridForm.city);
      this.is_city_selected = true;
      this.getAreas({ city_id: this.gridForm.city_id });
    },
    selectedDate(data) {
      switch (data) {
        case "start":
          this.startDateSelected = true;
          break;
        case "end":
          this.endDateSelected = true;
          break;
        default:
          break;
      }
    },
    createImage(value) {
      console.log(value);
      this.enable = true;
      this.createAuctionImage({
        info: value.info,
        path: value.image ? value.image : null,
        id: this.auctionId
      });
    },
    openMap(){
      this.coords = [30.434447148758963, 37.061051995669274];

    },
    deleteImage(id) {
      this.isLoadAuctionImages = false;
      this.deleteAuctionImage({ id: this.auctionId, imgId: id });
    },
    fileAdded(file) {
      console.log(file);
      this.file = file;
    },
    open(item) {
      window.open(item);
    },
    image_selected() {
      this.files_form.image = "image";
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
    ...mapGetters([
      "auction",
      "categories",
      "_Image_List",
      "_createAuctionImage",
      "_cities",
      "_File_List",
      "_createAuctionFile",
      "_isLoadAuctions",
      "_deleteAuctionFile",
      "_areas",
      "_auctionSide",
      "_dateError",
      "_updatedAuctionSuccessfuly",
      "_createAuctionSuccessfuly"
    ]),
    area_req() {
      return this.is_city_selected; // some conditional logic here...
    }
  },
  watch: {
    _File_List(newInfo, oldOne) {
      console.log("_auctionFileList", newInfo, oldOne);
      this.auctionFileList = newInfo;
    },
    auction(newInfo, oldOne) {
      console.log("wrfwrfwefwerfwef", newInfo);
      this.isLoadAuction = true;
      this.lang_form.forEach(el => {
        el.title = newInfo.locales.[el._name].title;
        el.description = newInfo.locales.[el._name].description;
      });
      this.image_basename = newInfo.image_basename;
      this.gridForm.category_id = newInfo.category_id;
      this.gridForm.opening_price = newInfo.opening_price;
      this.gridForm.minimum_paid = newInfo.minimum_paid;
      this.gridForm.deposit = newInfo.deposit;
      this.gridForm.auction_side = newInfo.auction_side;
      this.files_form.image = newInfo.image;
      this.gridForm.latitude = newInfo.latitude;
      this.gridForm.longitude = newInfo.longitude;
      newInfo.terms_conditions == ""
        ? (this.files_form.terms_conditions = null)
        : (this.files_form.terms_conditions = newInfo.terms_conditions);
      newInfo.brochure == ""
        ? (this.files_form.brochure = null)
        : (this.files_form.brochure = newInfo.brochure);
      this.gridForm.start_date = newInfo.start_date;
      this.gridForm.end_date = newInfo.end_date;
      this.gridForm.city_id = newInfo.city.id;
      this.gridForm.area_id = newInfo.area.id;
      this.image_basename = newInfo.image_basename;

      this.location.push(newInfo.latitude, newInfo.longitude);
      this.getArea();
    },
    _Image_List: function(val) {
      this.enable = false;
      this.isLoadAuctionImages = true;
    },
    _dateError: function(val) {
      this.$notify(
        "error",
        "Something went wrong",
        "the end date must be a date after start date.",
        { duration: 4000, permanent: false }
      );
      this.gridForm.start_date = null;
      this.gridForm.end_date = null;
      this.disabled = true;
    },

    _cities: function(val) {
      val.forEach(option => {
        this.cityOptions.push(
          new Object({
            value: option.id,
            text: option.locales.en.name
          })
        );
      });
    },
    _areas: function(val) {
      console.log("_areassssssssssssssssssssssss", val);
      this.gridForm.area = null;
      this.areaOptions = [];
      val.forEach(option => {
        this.areaOptions.push(
          new Object({
            value: option.id,
            text: option.locales.en.name
          })
        );
      });
    },
    _updatedAuctionSuccessfuly(newInfo, oldOne) {
      console.log("hiiiiii");
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction have been updated successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/auctions`);
      this.$destroy();
    },
    _createAuctionSuccessfuly(newInfo, oldOne) {
      console.log("hiiiiii");
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction have been created successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/auctions`);
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
    },
    _auctionSide(newval, old) {
      newval.forEach(option => {
        this.auctionSideOptions.push(
          new Object({
            value: option,
            text: option
          })
        );
      });
    }
    // image: function(val) {
    //   this.files_form.image = "image";
    // },
    // terms_conditions: function(val) {
    //   this.files_form.terms_conditions = "terms_conditions";
    // },
    // brochure: function(val) {
    //   this.files_form.brochure = "brochure";
    // }
  }
};
</script>
