<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :add_new_button="isLoadCustomField"
        :add_new_title="$t('todo.add-new-custom-filed')"
        @add_new="add_newCustomField"
        :reload="true"
        :transaction_filter="false"
        :title="auctionId ? $t('forms.editAuction') : $t('forms.createAuction')"
      ></datatable-heading>
      <template v-if="isLoadAuction">
        <b-card v-if="!auctionId" class="mb-4">
          <b-card-body class="wizard wizard-default">
            <form-wizard
              :with-validate="true"
              :saveBtn="saveBtn"
              :top-nav-disabled="true"
              :disableNextBtn="disableNextBtn"
              :last-step-end="true"
              nav-class="justify-content-between"
            >
              <tab
                :name="$t('wizard.step-name-1')"
                :selected="true"
                :validate="validateStep1"
                :submit="submitStep1"
              >
                <div class="wizard-basic-step">
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
                            <b-form-invalid-feedback
                              v-if="!lang.title.required"
                              >{{
                                $t(`forms.${lang._name.$model}_massege`)
                              }}</b-form-invalid-feedback
                            >
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
                      <b-colxx sm="6">
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
                            >{{
                              $t("forms.min_price")
                            }}</b-form-invalid-feedback
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
                            >{{
                              $t("forms.open_price")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="6">
                        <b-form-group :label="$t('forms.category')">
                          <b-form-select
                            @change="getSubCateory"
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
                        <b-form-group :label="$t('forms.sub-category')">
                          <b-form-select
                            :state="!$v.gridForm.sub_category_id.$error"
                            v-model="$v.gridForm.sub_category_id.$model"
                            :options="subCategoryOptions"
                            plain
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.gridForm.sub_category_id.required"
                            >{{
                              $t("forms.category_type_select")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="3">
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
                      <b-colxx sm="3">
                        <b-form-group :label="$t('forms.auction_owner')">
                          <b-form-select
                            :state="!$v.gridForm.auction_owner.$error"
                            v-model="$v.gridForm.auction_owner.$model"
                            :options="auctionOwnerOptions"
                            plain
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.gridForm.auction_owner.required"
                            >{{
                              $t("forms.auction_owner_message")
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
                            >{{
                              $t("forms.city-message")
                            }}</b-form-invalid-feedback
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
                            >{{
                              $t("forms.area-message")
                            }}</b-form-invalid-feedback
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
                          <googleMaps
                            :location="location"
                            @select_location="set_location"
                          />
                          <b-form-input
                            style="display: none;"
                            :state="!$v.gridForm.latitude.$error"
                            v-model="$v.gridForm.latitude.$model"
                          />

                          <b-form-invalid-feedback
                            v-if="!$v.gridForm.latitude.required"
                            >{{
                              $t("forms.location_req")
                            }}</b-form-invalid-feedback
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
                          <div class="image-review-show">
                            <img
                              v-if="image"
                              style="
                                  max-width: 100%;
                                  max-height: 100%;
                              "
                              :src="imgUrl"
                              alt="Fluid image"
                            />
                            <span v-if="image" class="delete-span">
                              <i
                                @click="delete_img"
                                class="simple-icon-trash"
                              ></i>
                            </span>
                          </div>

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
                            :placeholder="
                              $t('input-groups.choose-terms_conditions')
                            "
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

                    <!-- <b-button
                      :disabled="!disabled"
                      type="submit"
                      variant="primary"
                      class="mt-4"
                      >{{ $t("forms.save") }}</b-button
                    > -->
                  </b-form>
                </div>
              </tab>
              <tab
                :name="$t('wizard.step-name-2')"
                :validate="validateStep2"
                :submit="submitStep2"
              >
                <div class="wizard-basic-step">
                  <template v-if="_isLoadCustomField || _isLoadAuctions">
                    <div
                      style="
    display: flex;
"
                      v-for="(field, index) in customFields"
                      :key="index"
                    >
                      <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                        <b-form-group :label="field.locales.en.name">
                          <b-form-input
                            @change="addCustomValue"
                            :type="field.type === 'INT' ? 'number' : 'text'"
                            v-model="field.value"
                          />
                        </b-form-group>
                      </b-colxx>
                      <b-colxx v-if="field.type === 'INT'" sm="6">
                        <b-form-group :label="$t('forms.unit')">
                          <b-form-input type="text" v-model="field.unit" />
                        </b-form-group>
                      </b-colxx>
                    </div>
                  </template>
                  <template v-else>
                    <div class="loading"></div>
                  </template>
                  <add-new-custom-field
                    @create-custom-field="create_custom_field"
                    :showCreateModal="showCreateModal"
                  />
                </div>
              </tab>

              <tab type="done">
                <div class="wizard-basic-step text-center pt-3">
                  <div v-if="isProcessing">
                    <b-spinner
                      variant="primary"
                      label="Spinning"
                      class="mb-1"
                    ></b-spinner>
                  </div>
                  <div v-else>
                    <h2 class="mb-2">{{ $t("wizard.content-thanks") }}</h2>
                    <p>{{ $t("wizard.registered") }}</p>
                  </div>
                </div>
              </tab>
            </form-wizard>
          </b-card-body>
        </b-card>
        <b-card v-if="auctionId" class="mb-4">
          <b-tabs card no-fade>
            <b-tab
              title-item-class="w-30 text-center"
              :title="$t('basic_details')"
              active
              @click="isLoadCustomField = false"
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
                  <b-colxx sm="6">
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
                        @change="getSubCateory"
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
                    <b-form-group :label="$t('forms.sub-category')">
                      <b-form-select
                        :state="!$v.gridForm.sub_category_id.$error"
                        v-model="$v.gridForm.sub_category_id.$model"
                        :options="subCategoryOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.sub_category_id.required"
                        >{{
                          $t("forms.category_type_select")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="3">
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
                  <b-colxx sm="3">
                    <b-form-group :label="$t('forms.auction_owner')">
                      <b-form-select
                        :state="!$v.gridForm.auction_owner.$error"
                        v-model="$v.gridForm.auction_owner.$model"
                        :options="auctionOwnerOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.auction_owner.required"
                        >{{
                          $t("forms.auction_owner_message")
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
                      <googleMaps
                        :location="location"
                        @select_location="set_location"
                      />
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
                            :disabled="!$v.files_form.image.$model"
                            @click="open($v.files_form.image.$model)"
                            variant="light default"
                            >{{ $t("input-groups.show") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                      <div class="image-review-show">
                        <img
                          v-if="$v.files_form.image.$model"
                          style="
                                  max-width: 100%;
                                  max-height: 100%;
                              "
                          :src="image ? imgUrl : $v.files_form.image.$model"
                          alt="Auction image"
                        />
                        <span
                          v-if="$v.files_form.image.$model"
                          class="delete-span"
                        >
                          <i @click="delete_img" class="simple-icon-trash"></i>
                        </span>
                      </div>
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
              title-item-class="w-30 text-center"
              :title="$t('forms.custom_field')"
              @click="isLoadCustomField = true"
            >
              <div class="wizard-basic-step">
                <template v-if="_isLoadCustomField || _isLoadAuctions">
                  <div
                    style="display: flex;"
                    v-for="(field, index) in custom_fields"
                    :key="index"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group :label="field.locales.en.name">
                        <b-form-input
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.en.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group :label="$t('forms.unit')">
                        <b-form-input
                          type="text"
                          v-model="field.values[0].locales.en.unit"
                        />
                      </b-form-group>
                    </b-colxx>
                  </div>
                  <b-button
                    :disabled="!disabled"
                    type="submit"
                    @click="editCustomValue('edit')"
                    variant="primary"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
                <add-new-custom-field
                  @create-custom-field="create_custom_field"
                  :showCreateModal="showCreateModal"
                />
              </div>
            </b-tab>
            <b-tab
              @click="
                getAuctionImages({ id: auctionId }), (isLoadCustomField = false)
              "
              title-item-class="w-30 text-center"
              :title="$t('forms.attach')"
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
    <b-modal
      id="modalbackdrop"
      ref="modalbackdrop"
      :title="$t('modal.modal-custom')"
      :hide-backdrop="true"
      :no-close-on-backdrop="true"
    >
      <b-form>
        <div class="wizard-basic-step">
          <template v-if="_isLoadCustomField || _isLoadAuctions"
            >\

            <div
              style="
    display: flex;
"
              v-for="(field, index) in customFields"
              :key="index"
            >
              <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                <b-form-group :label="field.locales.en.name">
                  <b-form-input
                    @change="addCustomValue"
                    :type="field.type === 'INT' ? 'number' : 'text'"
                    v-model="field.value"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx v-if="field.type === 'INT'" sm="6">
                <b-form-group :label="$t('forms.unit')">
                  <b-form-input type="text" v-model="field.unit" />
                </b-form-group>
              </b-colxx>
            </div>
          </template>
          <template v-else>
            <div class="loading"></div>
          </template>
          <add-new-custom-field
            @create-custom-field="create_custom_field"
            :showCreateModal="showCreateModal"
          />
        </div>
      </b-form>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          :disabled="enable"
          @click="addCustomVal()"
          class="mr-1"
          >{{ $t("pages.add-new") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('modalbackdrop')">{{
          $t("pages.cancel")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal
      ref="modallg"
      id="modallg"
      size="lg"
      :title="$t('forms.customCategoryTitle')"
      :hide-backdrop="true"
      :no-close-on-backdrop="true"
    >
      <div>
        <template v-if="_isLoadCustomField">
          <div class="addCustomBtn">
            <b-button variant="primary" @click="showCreateModal = true"
              >Add New Custom Field to the Category</b-button
            >
          </div>
          <div
            style="display: flex;"
            v-for="(field, index) in customFields"
            :key="index"
          >
            <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
              <b-form-group :label="field.locales.en.name">
                <b-form-input
                  @change="addCustomValue"
                  :type="field.type === 'INT' ? 'number' : 'text'"
                  v-model="field.value"
                />
              </b-form-group>
            </b-colxx>
            <b-colxx v-if="field.type === 'INT'" sm="6">
              <b-form-group :label="$t('forms.unit')">
                <b-form-input type="text" v-model="field.unit" />
              </b-form-group>
            </b-colxx>
          </div>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
        <add-new-custom-field
          @create-custom-field="create_custom_field"
          :showCreateModal="showCreateModal"
        />
      </div>
      <template slot="modal-footer">
        <b-button variant="primary" @click="addNewCustomValue()" class="mr-1">{{
          $t("forms.save")
        }}</b-button>
        <b-button variant="secondary" @click="hideModal('modallg')">{{
          $t("survey.cancel")
        }}</b-button>
      </template>
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
import googleMaps from "../../../components/shared/googleMaps.vue";
import addCustomField from "../../../components/shared/addCustomField.vue";
import { getCurrentLanguage } from "../../../utils";
import FormWizard from "../../../components/Form/Wizard/FormWizard";
import Tab from "../../../components/Form/Wizard/Tab";

export default {
  components: {
    googleMaps : googleMaps,
    "vue-dropzone": VueDropzone,
     "form-wizard": FormWizard,
        "tab": Tab,
        "add-new-custom-field": addCustomField,
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
       isProcessing: true,

            formStep1: {
                name: ""
            },
            formStep2: {
                email: ""
            },
            formStep3: {
                password: ""
            },
      isEdit: false,
      image: null,
      isAbleToMove: false,
      saveBtn: `next`,
      showCreateModal: false,
      imgUrl: null,
      terms_conditions: null,
      auction_id: null,
      brochure: null,
      isLoadAuctionImages: false,
      disabled: true,
      disableNextBtn: false,
      custom_fields: null,
      endDateSelected: false,
      startDateSelected: false,
      isLoadAuction: false,
      language: null,
      enable: false,
      langs: null,
      customFields: [],
      coords: [],
      isLoadCustomField: false,
      location: [],
      country_id: 248,
      categoryIdOptions: [],
      auctionSideOptions: [],
      auctionOwnerOptions: [],
      subCategoryOptions: [],
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
        auction_owner: null,
        city_id: null,
        area_id: null,
        deposit: null,
        category_id: null,
        sub_category_id: null,
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
     formStep1: {
            name: {
                required
            },
        },
        formStep2: {
            email: {
                required,

            },
        },
        formStep3: {
            password: {

            },
        },
    gridForm: {
      deposit: {
        required
      },

      auction_side: {
        required
      },
      auction_owner: {
        required
      },
      category_id: {
        required
      },
      sub_category_id: {

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
    this.language = getCurrentLanguage();
    this.auctionId = this.$route.query.id;
    if (this.auctionId) {
      this.getAuction({ id: this.auctionId });
      this.isEdit = true;
    } else {
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
    this.getAuctionOwner();
  },
  methods: {
    ...mapActions([
      "getAuction",
      "updateAuction",
      "getCategories",
      "createCustomValue",
      "getCustomFieldList",
      "createAuctionImage",
      "deleteAuctionFile",
      "createAuctionFile",
      "getAuctionFiles",
      "getAuctionImages",
      "getAuctionOwner",
      "getSubCategories",
      "createCustomValue",
      "createAuction",
      "createCustomField",
      "getCities",
      "getAreas",
      "deleteAuctionImage",
      "getAuctionSide"
    ]),
    make_collaction(langs, form) {
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
      this.createAuctionFile({ info: info, path: path, id: this.auctionId });
    },
    getSubCateory(){
       this.getSubCategories({id : this.gridForm.category_id
       })
    },
    delete_File(id) {
      this.deleteAuctionFile({ id: this.auctionId, fileId: id });
    },
    set_location(data) {
      this.gridForm.latitude = data.lat;
      this.gridForm.longitude = data.lng;
    },
    getArea() {
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
      this.enable = true;
      this.createAuctionImage({
        info: value.info,
        path: value.image ? value.image : null,
        id: this.auctionId
      });
    },
    delete_img(){
        this.image = null;
        this.files_form.image = null;
    },
      hideModal(refname) {
      this.$refs[refname].hide();

    },
    openMap(){
      this.coords = [30.434447148758963, 37.061051995669274];

    },
    deleteImage(id) {
      this.isLoadAuctionImages = false;
      this.deleteAuctionImage({ id: this.auctionId, imgId: id });
    },
    fileAdded(file) {
      this.file = file;
    },
    addCustomValue(){
      console.log('input testing');
      this.saveBtn = 'save';
    },
    open(item) {
      window.open(item);
    },
    image_selected() {
      this.files_form.image = "image";

    },
    addCustomVal(){

    },
    add_newCustomField(){
       if (this.auctionId) {
 this.$refs['modallg'].show();
 this.getCustomFieldList({id: this.gridForm.category_id})
       }else{
 this.showCreateModal = true;
       }


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
     validateStep1() {
      //       this.isLoadCustomField = true;

      //  return true;
             this.$v.$touch();
      this.$v.gridForm.$touch();
      this.$v.lang_form.$touch();
      this.$v.files_form.$touch();
        if (
        !this.$v.gridForm.$invalid &&
        !this.$v.lang_form.$invalid &&
        !this.$v.files_form.$invalid
      ){
        this.disableNextBtn = true;
        // this.onGridFormSubmit();
 return true;
      }

        },
        create_custom_field(val,type){
          this.createCustomField({info: val, type: type, categoryId: this.gridForm.category_id })
        },
        submitStep1() {
            this.onGridFormSubmit();
        },
        validateStep2() {
            this.$v.formStep2.$touch();
            console.log(!this.$v.formStep2.$anyError);
            return true;
        },
        submitStep2() {

            this.customFields.forEach(el => {
              console.log(el);
              if (el.value) {
                 this.createCustomValue({auction_id: this.auction_id,info: el, id: el.id })
              }

            });

        },
        editCustomValue(){
          this.custom_fields.forEach(el => {
                 this.createCustomValue({auction_id: this.auctionId,info: el, id: el.id })
            });
        },
        addNewCustomValue(type){
            this.customFields.forEach(el => {
              console.log(el);
              if (el.value) {
                 this.createCustomValue({auction_id: this.auctionId,info: el, id: el.id })
              }
            });
        },
        submitForm() {
            const form = {
                name: this.formStep1.name,
                email: this.formStep2.email,
                password: this.formStep3.password
            };
            this.onGridFormSubmit();
            console.log("form submitting : ", form)
            setTimeout(() => {
                this.isProcessing = false;
            }, 3000)
        }
  },
  computed: {
    ...mapGetters([
      "auction",
      "categories",
      "_Image_List",
      "_createCustomField",
      "_createAuctionImage",
      "_cities",
      "_File_List",
      "_isLoadCustomField",
      "_auctionOwner",
      "_createAuctionFile",
      "_isLoadAuctions",
      "_deleteAuctionFile",
      "_areas",
      "_auctionSide",
      "_isCustomValueCreated",
      "_subCategories",
      "_customFields",
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
      this.auctionFileList = newInfo;
    },
    auction(newInfo, oldOne) {
      this.isLoadAuction = true;
         this.location.push(newInfo.latitude, newInfo.longitude);
      this.lang_form.forEach(el => {
        el.title = newInfo.locales.[el._name].title;
        el.description = newInfo.locales.[el._name].description;
      });
      this.image_basename = newInfo.image_basename;
      this.gridForm.category_id = newInfo.category_id;
      this.gridForm.opening_price = newInfo.opening_price;
      this.custom_fields = newInfo.custom_fields;
      this.gridForm.minimum_paid = newInfo.minimum_paid;
      this.gridForm.deposit = newInfo.deposit;
      this.gridForm.auction_side = newInfo.auction_side.id;
      this.gridForm.auction_owner = newInfo.auction_owner.id;
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
      newInfo.city.id ? this.gridForm.city_id = newInfo.city.id : this.gridForm.city_id ='';
      newInfo.area.id ? this.gridForm.area_id = newInfo.area.id : this.gridForm.area_id ='';
      this.image_basename = newInfo.image_basename;


      this.getArea();
    },
    _Image_List: function(val) {
      this.enable = false;
      this.isLoadAuctionImages = true;
    },
    _customFields: function(val) {
       this.customFields = val;
    },
    _dateError: function(val) {
      this.disableNextBtn = false;
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
    _createCustomField: function(val){
      this.showCreateModal = false;
      // this.getCustomFieldList({id: this.gridForm.category_id})
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
    _subCategories: function(val) {
      val.forEach(option => {
        this.subCategoryOptions.push(
          new Object({
            value: option.id,
            text: option.locales.en.name
          })
        );
      });
    },
    _areas: function(val) {
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
      this.disableNextBtn = false;
      this.auctn
      this.saveBtn = 'skip';
      this.auction_id = newInfo.data.data.id;
      this.isLoadCustomField = true;
      this.isAbleToMove = true;
      // this.validateStep1();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction have been created successfully",
        { duration: 3000, permanent: false }
      );
      // router.push(`${adminRoot}/auctions`);
      // this.$destroy();
    },
    categories(newval, old) {
      newval.forEach(option => {
        this.categoryIdOptions.push(
          new Object({
            value: option.id,
            text: option.locales.[this.language].name
          })
        );
      });
    },
    _auctionSide(newval, old) {
      newval.forEach(option => {
        this.auctionSideOptions.push(
          new Object({
            value: option.id,
            text: option.name
          })
        );
      });
    },
    _auctionOwner(newval, old) {
      newval.forEach(option => {
        this.auctionOwnerOptions.push(
          new Object({
            value: option.id,
            text: option.name
          })
        );
      });
    },
    _isCustomValueCreated: function(val){
      this.$refs['modallg'].hide();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Value of custom field have been created successfully",
        { duration: 2000, permanent: false }
      );
       router.push(`${adminRoot}/auctions`);
    },
    image: function(val) {
      if (val) {
          this.imgUrl = URL.createObjectURL(val)
          this.files_form.image = URL.createObjectURL(val)
      }
    },
    customFields: function(val) {
      console.log('customFields');
    }


  }
};
</script>
