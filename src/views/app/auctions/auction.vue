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
                    :state="!$v.gridForm.city.$error"
                    v-model="$v.gridForm.city.$model"
                    :options="cityOptions"
                    @change="getArea()"
                    plain
                  />
                  <b-form-invalid-feedback v-if="!$v.gridForm.city.required">{{
                    $t("forms.city-message")
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="6">
                <b-form-group :label="$t('forms.start_date')">
                  <datepicker
                    style="width: 100%;"
                    type="datetime"
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
                    :state="!$v.gridForm.area.$error"
                    v-model="$v.gridForm.area.$model"
                    :options="areaOptions"
                    plain
                  />
                  <b-form-invalid-feedback v-if="!$v.gridForm.area.required">{{
                    $t("forms.area-message")
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.end_date')">
                  <datepicker
                    style="width: 100%;"
                    type="datetime"
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
                  <b-button class="mb-2" block variant="light default">{{
                    $t("button.choose-location")
                  }}</b-button>
                  <!-- <b-form-input
                    style="display: none;"
                    :state="!$v.gridForm.location.$error"
                    v-model="$v.gridForm.location.$model"
                  />

                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.location.required"
                    >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                  > -->
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.image')">
                  <b-form-input
                    style="display: none;"
                    :state="!$v.gridForm.image.$error"
                    v-model="$v.gridForm.image.$model"
                  />
                  <b-form-file
                    accept="image/*"
                    :placeholder="$t('forms.choose-image')"
                    v-model="$v.gridForm.image.$model"
                  ></b-form-file>
                  <b-form-invalid-feedback v-if="!$v.gridForm.image.required">{{
                    $t("forms.choose-image-message")
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.brochure')">
                  <b-form-input
                    style="display: none;"
                    :state="!$v.gridForm.brochure.$error"
                    v-model="$v.gridForm.brochure.$model"
                  />
                  <b-form-file
                    :placeholder="$t('input-groups.choose-brochure')"
                    v-model="$v.gridForm.brochure.$model"
                  ></b-form-file>
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.brochure.required"
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
                    :state="!$v.gridForm.terms_conditions.$error"
                    v-model="$v.gridForm.terms_conditions.$model"
                  />
                  <b-form-file
                    :placeholder="$t('input-groups.choose-terms_conditions')"
                    v-model="$v.gridForm.terms_conditions.$model"
                  ></b-form-file>
                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.terms_conditions.required"
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
                        :state="!$v.gridForm.city.$error"
                        v-model="$v.gridForm.city.$model"
                        :options="cityOptions"
                        @change="getArea()"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.city.required"
                        >{{ $t("forms.city-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>

                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.start_date')">
                      <datepicker
                        style="width: 100%;"
                        type="datetime"
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
                        :state="!$v.gridForm.area.$error"
                        v-model="$v.gridForm.area.$model"
                        :options="areaOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.area.required"
                        >{{ $t("forms.area-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.end_date')">
                      <datepicker
                        style="width: 100%;"
                        type="datetime"
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
                      <b-button class="mb-2" block variant="light default">{{
                        $t("button.choose-location")
                      }}</b-button>
                      <!-- <b-form-input
                    style="display: none;"
                    :state="!$v.gridForm.location.$error"
                    v-model="$v.gridForm.location.$model"
                  />

                  <b-form-invalid-feedback
                    v-if="!$v.gridForm.location.required"
                    >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                  > -->
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group :label="$t('forms.image')">
                      <b-form-input
                        style="display: none;"
                        :state="!$v.gridForm.image.$error"
                        v-model="$v.gridForm.image.$model"
                      />
                      <b-form-file
                        accept="image/*"
                        :placeholder="$t('forms.choose-image')"
                        v-model="$v.gridForm.image.$model"
                      ></b-form-file>
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.image.required"
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
                        :state="!$v.gridForm.brochure.$error"
                        v-model="$v.gridForm.brochure.$model"
                      />
                      <b-form-file
                        :placeholder="$t('input-groups.choose-brochure')"
                        v-model="$v.gridForm.brochure.$model"
                      ></b-form-file>
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.brochure.required"
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
                        :state="!$v.gridForm.terms_conditions.$error"
                        v-model="$v.gridForm.terms_conditions.$model"
                      />
                      <b-form-file
                        :placeholder="
                          $t('input-groups.choose-terms_conditions')
                        "
                        v-model="$v.gridForm.terms_conditions.$model"
                      ></b-form-file>
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.terms_conditions.required"
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
            <b-tab title-item-class="w-50 text-center" title="Attachments">
              <b-card class="mb-4" no-body>
                <b-tabs card no-fade>
                  <b-tab :title="$t('forms.images')" active>
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
                          :_ImageList="_auctionImageList"
                        />
                      </b-colxx>
                    </div>
                    <add-new-modal
                      :enable="enable"
                      @AddNewImage="createImage"
                    ></add-new-modal>
                  </b-tab>
                  <b-tab @click="openFile()" :title="$t('forms.files')">
                    <b-row>
                      <template v-if="_isLoadAttach">
                        <b-colxx xs="12" md="6" class="mb-3">
                          <b-card>
                            <vuetable
                              ref="vuetable"
                              :api-mode="false"
                              :data-total="dataCount"
                              :per-page="perPage"
                              :reactive-api-url="true"
                              :fields="fields"
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
                                      file_Action(item.value, props.rowData)
                                    "
                                    >{{ $t(item.name) }}</b-dropdown-item
                                  >
                                </b-dropdown>
                              </template>
                            </vuetable>
                          </b-card>
                        </b-colxx>
                        <b-colxx xs="12" md="6" class="mb-3">
                          <b-card class="mb-4" :title="$t('forms.create')">
                            <b-form
                              @submit.prevent="onValitadeFormSubmit()"
                              class="av-tooltip tooltip-label-right"
                            >
                              <div
                                v-for="(lang, index) in $v.file_form.$each
                                  .$iter"
                                :key="index"
                              >
                                <b-form-group
                                  :label="$t(`pages.${lang.name.$model}_title`)"
                                  class="has-float-label mb-4"
                                >
                                  <b-form-input
                                    type="text"
                                    v-model="lang.title.$model"
                                    :state="!lang.title.$error"
                                  />
                                  <b-form-invalid-feedback
                                    v-if="!lang.title.required"
                                    >{{
                                      $t("forms.title_filed")
                                    }}</b-form-invalid-feedback
                                  >
                                </b-form-group>
                                <b-form-group
                                  :label="$t(`pages.${lang.name.$model}_desc`)"
                                  class="has-float-label mb-4"
                                >
                                  <b-form-input
                                    type="text"
                                    v-model="lang.description.$model"
                                    :state="!lang.description.$error"
                                  />
                                  <b-form-invalid-feedback
                                    v-if="!lang.description.required"
                                  >
                                    {{
                                      $t("forms.desc_filed")
                                    }}</b-form-invalid-feedback
                                  >
                                </b-form-group>
                              </div>
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
                                <span>{{ $t("block.file") }}</span>
                              </label>

                              <b-button
                                :disabled="enable"
                                type="submit"
                                variant="primary"
                                class="mt-4"
                                >{{ $t("forms.submit") }}</b-button
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
            </b-tab>
          </b-tabs>
        </b-card>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-colxx>
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

export default {
  components: {
    "vue-dropzone": VueDropzone,
    "datatable-heading": DatatableHeading,

    datepicker: DatePicker
  },
  data() {
    return {
      auctionId: null,
      _categoryId: null,
      password: null,
      disabled: true,
      endDateSelected: false,
      startDateSelected: false,
      isLoadAuction: false,
      langs: null,
      country_id: 248,
      categoryIdOptions: [],
      auctionSideOptions: [],
      areaOptions: [],
      cityOptions: [],
      is_city_selected: false,
      create_categoryId: null,
      lang_form: [],
      gridForm: {
        image: null,
        auction_side: null,
        city: null,
        area: null,
        deposit: null,
        category_id: null,
        minimum_paid: null,
        start_date: null,
        brochure: null,
        terms_conditions: null,
        end_date: null,
        opening_price: null,
        latitude: "1313232132",
        longitude: "1231231231231"
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
      image: {
        required
      },
      deposit: {
        required
      },
      brochure: {},
      auction_side: {
        required
      },
      terms_conditions: {},
      category_id: {
        required
      },
      city: {},
      area: {
        required: requiredIf(function() {
          return this.area_req;
        })
      },
      minimum_paid: {
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
      this.isLoadAuction = true;
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
      console.log("this.gridForm this.gridForm", this.gridForm, this.lang_form);
      if (!this.$v.gridForm.$invalid && !this.$v.lang_form.$invalid) {
        this.disabled = false;
        this.startDateSelected
          ? (this.gridForm.start_date = this.gridForm.start_date
              .toLocaleString()
              .replace(",", ""))
          : this.gridForm.start_date;
        this.endDateSelected
          ? (this.gridForm.end_date = this.gridForm.end_date
              .toLocaleString()
              .replace(",", ""))
          : this.gridForm.end_date;
        console.log(this.endDateSelected, this.gridForm.end_date);

        if (this.auctionId) {
          this.updateAuction({
            info: this.gridForm,
            langs: this.lang_form,
            id: this.auctionId
          });
        } else {
          this.createAuction({
            info: this.gridForm,
            langs: this.lang_form
          });
        }
      }
    },
    getArea() {
      console.log(this.gridForm.city);
      this.is_city_selected = true;
      this.getAreas({ city_id: this.gridForm.city });
    },
    selectedDate(data) {
      console.log("srfsrpfsrfsrfsefsef", data);
      console.log("startttttttttttt1111111111111111111");
      switch (data) {
        case "start":
          console.log("startttttttttttt");
          this.startDateSelected = true;
          break;
        case "end":
          console.log("enddddddddddddddd");
          this.endDateSelected = true;
          break;

        default:
          break;
      }
      // if (data === "start") {
      //   console.log("startttttttttttt");
      //   this.startDateSelected = true;
      // } else {
      //   this.endDateSelected = true;
      // }
    },
    createImage(value) {
      console.log(value);
      this.enable = true;
      this.createAuctionImage({
        info: value.info,
        image: value.image ? value.image : null,
        id: this.pageId
      });
    },
    deleteImage(id) {
      this.deleteAuctionImage({ id: this.auctionId, attachment_id: id });
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
    ...mapGetters([
      "auction",
      "categories",
      "_auctionImageList",
      "_cities",
      "_areas",
      "_auctionSide",
      "_updatedAuctionSuccessfuly",
      "_createAuctionSuccessfuly"
    ]),
    area_req() {
      return this.is_city_selected; // some conditional logic here...
    }
  },
  watch: {
    auction(newInfo, oldOne) {
      console.log("wrfwrfwefwerfwef", newInfo);
      this.isLoadAuction = true;
      this.gridForm.ar_title = newInfo.locales.ar.title;
      this.gridForm.en_title = newInfo.locales.en.title;
      this.gridForm.ar_description = newInfo.locales.ar.terms_conditions;
      this.gridForm.en_description = newInfo.locales.en.terms_conditions;
      this.gridForm.category_id = newInfo.category_id;
      this.gridForm.opening_price = newInfo.opening_price;
      this.gridForm.minimum_paid = newInfo.minimum_paid;
      this.gridForm.start_date = newInfo.start_date;
      this.gridForm.end_date = newInfo.end_date;
    },
    _auctionImageList: function(val) {
      this.enable = false;
    },
    _cities: function(val) {
      console.log("cititesssssssssssssssssssssss", val);
      // this.gridForm.area = null;
      // this.areaOptions = null;
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
  }
};
</script>
