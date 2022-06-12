<template>
  <div>
    <datatable-heading
      :details="true"
      :show="false"
      :add_new="false"
      :add_new_button="add_Attachment"
      :pageSize="false"
      :attachment="add_Attachment"
      :reload="true"
      @add_new="add_New_attach"
      :title="userId ? $t('forms.grid') : $t('forms.createUser')"
    ></datatable-heading>

    <b-row v-if="!isUserForm">
      <b-colxx xxs="12">
        <template v-if="processing">
          <b-card class="mb-4">
            <b-form @submit.prevent="onGridFormSubmit">
              <b-row>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.firstname')">
                    <b-form-input
                      type="text"
                      :state="!$v.gridForm.first_name.$error"
                      v-model="$v.gridForm.first_name.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.first_name.required"
                      >{{
                        $t("forms.first_name_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.secondName')">
                    <b-form-input
                      type="text"
                      :state="!$v.gridForm.second_name.$error"
                      v-model="$v.gridForm.second_name.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.second_name.required"
                      >{{
                        $t("forms.second_name_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.middleName')">
                    <b-form-input
                      type="text"
                      :state="!$v.gridForm.middle_name.$error"
                      v-model="$v.gridForm.middle_name.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.middle_name.required"
                      >{{
                        $t("forms.middle_name_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.lastname')">
                    <b-form-input
                      type="text"
                      :state="!$v.gridForm.last_name.$error"
                      v-model="$v.gridForm.last_name.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.last_name.required"
                      >{{
                        $t("forms.last_name_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="12">
                  <b-form-group :label="$t('forms.email')">
                    <b-form-input
                      type="email"
                      :state="!$v.gridForm.email.$error"
                      v-model="$v.gridForm.email.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.email.required"
                      >{{ $t("forms.email_filed") }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx v-if="!userId" sm="12">
                  <b-form-group :label="$t('forms.password')">
                    <b-form-input
                      type="password"
                      v-model.trim="$v.gridForm.password.$model"
                      :state="!$v.gridForm.password.$error"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.password.required"
                      >{{ $t("forms.pass_filed") }}</b-form-invalid-feedback
                    >
                    <b-form-invalid-feedback
                      v-else-if="!$v.gridForm.password.minLength"
                      >{{ $t("forms.pass_min") }}</b-form-invalid-feedback
                    >
                    <b-form-invalid-feedback
                      v-else-if="!$v.gridForm.password.maxLength"
                      >{{ $t("forms.pass_max") }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>

                <b-colxx sm="12">
                  <b-form-group :label="$t('forms.phonenumber')">
                    <b-form-input
                      type="number"
                      :state="!$v.gridForm.phone_number.$error"
                      v-model="$v.gridForm.phone_number.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.phone_number.required"
                      >{{
                        $t("forms.phonenumber_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.identity_number')">
                    <b-form-input
                      type="text"
                      :state="!$v.gridForm.identity_number.$error"
                      v-model="$v.gridForm.identity_number.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.identity_number.required"
                      >{{
                        $t("forms.identity_number_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.license_number')">
                    <b-form-input
                      type="text"
                      :state="!$v.gridForm.license_number.$error"
                      v-model="$v.gridForm.license_number.$model"
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.license_number.required"
                      >{{
                        $t("forms.license_number_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.nationality')">
                    <b-form-select
                      :state="!$v.gridForm.nationality.$error"
                      v-model="$v.gridForm.nationality.$model"
                      :options="nationalityOptions"
                      plain
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.nationality.required"
                      >{{
                        $t("forms.nationality_filed")
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.country')">
                    <b-form-select
                      :state="!$v.gridForm.country.$error"
                      v-model="$v.gridForm.country.$model"
                      :options="countryOptions"
                      plain
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.country.required"
                      >{{ $t("forms.country_filed") }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx v-if="!userId" sm="6">
                  <b-form-group :label="$t('forms.role')">
                    <b-form-select
                      :state="!$v.gridForm.role.$error"
                      v-model="$v.gridForm.role.$model"
                      :options="roleOptions"
                      plain
                    />
                    <b-form-invalid-feedback
                      v-if="!$v.gridForm.role.required"
                      >{{ $t("forms.role_filed") }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.dob')">
                    <datepicker
                      :bootstrap-styling="true"
                      v-model="$v.gridForm.dob.$model"
                      @selected="selectedDate()"
                    ></datepicker>
                    <div
                      :class="{
                        'invalid-feedback': true,
                        'd-block':
                          $v.gridForm.dob.$error && !$v.gridForm.dob.required
                      }"
                    >
                      {{ $t("forms.date_filed") }}
                    </div>
                  </b-form-group>
                </b-colxx>
                <b-colxx v-if="userId" sm="6">
                  <b-form-group :label="$t('forms.role')">
                    <b-form-input
                      type="text"
                      readonly
                      v-model="gridForm.role"
                    ></b-form-input>
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group v-if="userId" :label="$t('forms.active')">
                    <b-form-select
                      selected
                      v-model="gridForm.active"
                      :options="activeOptions"
                      plain
                    />
                  </b-form-group>
                </b-colxx>
              </b-row>

              <b-button
                :disabled="enable"
                type="submit"
                variant="primary"
                class="mt-4"
                >{{ $t("forms.save") }}</b-button
              >
            </b-form>
          </b-card>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-colxx>
    </b-row>
    <b-row v-if="isUserForm">
      <b-colxx xxs="12">
        <template v-if="processing">
          <b-card class="mb-4">
            <b-tabs card no-fade>
              <b-tab
                @click="
                  (add_attach = false),
                    (add_Attachment = false),
                    selectedTab === 'basicDetails'
                "
                :title="$t(`forms.basic_details`)"
                :active="selectedTab === 'basicDetails'"
                title-item-class="w-30 text-center"
              >
                <b-form @submit.prevent="onGridFormSubmit">
                  <b-row>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.firstname')">
                        <b-form-input
                          type="text"
                          :state="!$v.gridForm.first_name.$error"
                          v-model="$v.gridForm.first_name.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.first_name.required"
                          >{{
                            $t("forms.first_name_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.secondName')">
                        <b-form-input
                          type="text"
                          :state="!$v.gridForm.second_name.$error"
                          v-model="$v.gridForm.second_name.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.second_name.required"
                          >{{
                            $t("forms.second_name_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.middleName')">
                        <b-form-input
                          type="text"
                          :state="!$v.gridForm.middle_name.$error"
                          v-model="$v.gridForm.middle_name.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.middle_name.required"
                          >{{
                            $t("forms.middle_name_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.lastname')">
                        <b-form-input
                          type="text"
                          :state="!$v.gridForm.last_name.$error"
                          v-model="$v.gridForm.last_name.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.last_name.required"
                          >{{
                            $t("forms.last_name_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="12">
                      <b-form-group :label="$t('forms.email')">
                        <b-form-input
                          type="email"
                          :state="!$v.gridForm.email.$error"
                          v-model="$v.gridForm.email.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.email.required"
                          >{{
                            $t("forms.email_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="!userId" sm="12">
                      <b-form-group :label="$t('forms.password')">
                        <b-form-input
                          type="password"
                          v-model.trim="$v.gridForm.password.$model"
                          :state="!$v.gridForm.password.$error"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.password.required"
                          >{{ $t("forms.pass_filed") }}</b-form-invalid-feedback
                        >
                        <b-form-invalid-feedback
                          v-else-if="!$v.gridForm.password.minLength"
                          >{{ $t("forms.pass_min") }}</b-form-invalid-feedback
                        >
                        <b-form-invalid-feedback
                          v-else-if="!$v.gridForm.password.maxLength"
                          >{{ $t("forms.pass_max") }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>

                    <b-colxx sm="12">
                      <label>{{ $t("forms.phone_number") }}</label>
                    </b-colxx>
                    <b-colxx sm="12">
                      <b-input-group class="mb-3">
                        <b-input-group-prepend is-text>
                          <input
                            type="checkbox"
                            @click="phone_comfirm()"
                            :checked="
                              gridForm.phone_number_confirmed 
                            "
                          />
                        </b-input-group-prepend>
                        <b-form-input
                          type="number"
                          :state="!$v.gridForm.phone_number.$error"
                          v-model="$v.gridForm.phone_number.$model"
                        />

                        <b-form-invalid-feedback
                          style="margin-top: 25px;"
                          v-if="!$v.gridForm.phone_number.required"
                          >{{
                            $t("forms.phonenumber_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-input-group>
                    </b-colxx>
                    <b-colxx sm="12">
                      <label>{{ $t("forms.identity_number") }}</label>
                    </b-colxx>
                    <b-colxx sm="12">
                      <b-input-group class="mb-3">
                        <b-input-group-prepend is-text>
                          <input
                            type="checkbox"
                            @click="identity_comfirm()"
                            :checked="
                              gridForm.identity_verfied
                    "
                          />
                        </b-input-group-prepend>
                        <b-form-input
                          type="number"
                          :state="!$v.gridForm.identity_number.$error"
                          v-model="$v.gridForm.identity_number.$model"
                        />
                        <b-form-invalid-feedback
                          style="margin-top: 25px;"
                          v-if="!$v.gridForm.identity_number.required"
                          >{{
                            $t("forms.identity_number_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-input-group>
                      <!-- <b-form-group :label="$t('forms.identity_number')">
                        <b-form-input
                          type="text"
                          :state="!$v.gridForm.identity_number.$error"
                          v-model="$v.gridForm.identity_number.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.identity_number.required"
                          >{{
                            $t("forms.identity_number_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group> -->
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.license_number')">
                        <b-form-input
                          type="number"
                          :state="!$v.gridForm.license_number.$error"
                          v-model="$v.gridForm.license_number.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.license_number.required"
                          >{{
                            $t("forms.license_number_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.nationality')">
                        <b-form-select
                          :state="!$v.gridForm.nationality.$error"
                          v-model="$v.gridForm.nationality.$model"
                          :options="nationalityOptions"
                          plain
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.nationality.required"
                          >{{
                            $t("forms.nationality_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.country')">
                        <b-form-select
                          :state="!$v.gridForm.country.$error"
                          v-model="$v.gridForm.country.$model"
                          :options="countryOptions"
                          plain
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.country.required"
                          >{{
                            $t("forms.country_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>

                    <b-colxx v-if="!userId" sm="6">
                      <b-form-group :label="$t('forms.role')">
                        <b-form-select
                          :state="!$v.gridForm.role.$error"
                          v-model="$v.gridForm.role.$model"
                          :options="roleOptions"
                          plain
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.role.required"
                          >{{ $t("forms.role_filed") }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group :label="$t('forms.dob')">
                        <datepicker
                          :bootstrap-styling="true"
                          v-model="$v.gridForm.dob.$model"
                          @selected="selectedDate()"
                        ></datepicker>
                        <div
                          :class="{
                            'invalid-feedback': true,
                            'd-block':
                              $v.gridForm.dob.$error &&
                              !$v.gridForm.dob.required
                          }"
                        >
                          {{ $t("forms.date_filed") }}
                        </div>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="userId" sm="6">
                      <b-form-group :label="$t('forms.role')">
                        <b-form-input
                          type="text"
                          readonly
                          v-model="gridForm.role"
                        ></b-form-input>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group v-if="userId" :label="$t('forms.active')">
                        <b-form-select
                          selected
                          v-model="gridForm.active"
                          :options="activeOptions"
                          plain
                        />
                      </b-form-group>
                    </b-colxx>
                  </b-row>

                  <b-button
                    :disabled="enable"
                    type="submit"
                    variant="primary"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </b-form>
              </b-tab>

              <b-tab
                title-item-class="w-30 text-center"
                @click="
                  (add_attach = true),
                    (add_Attachment = true),
                    selectedTab === 'attachment'
                "
                :active="selectedTab === 'attachment'"
              >
                <template #title>
                  <b-spinner
                    v-if="!_AttachProcessing"
                    type="border"
                    small
                  ></b-spinner>
                  {{ $t(`forms.attach`) }}
                </template>
                <b-colxx xxs="12">
                  <template v-if="_AttachProcessing">
                    <vuetable
                      ref="vuetable"
                      class="table-divided order-with-arrow"
                      :api-mode="false"
                      :reactive-api-url="true"
                      :fields="fields"
                      @vuetable:row-clicked="rowClicked"
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
                            v-for="(item, index) in attach_Options"
                            :key="index"
                            @click="attach_Action(item.value, props.rowData)"
                            >{{ $t(item.name) }}</b-dropdown-item
                          >
                        </b-dropdown>
                      </template>
                    </vuetable>
                  </template>
                  <template v-else>
                    <div class="loading"></div>
                  </template>
                </b-colxx>
              </b-tab>
              <b-tab
                title-item-class="w-30 text-center"
                @click="
                  (add_attach = false),
                    (add_Attachment = false),
                    selectedTab === 'wallet'
                "
                :active="selectedTab === 'wallet'"
              >
                <template #title>
                  <b-spinner
                    v-if="getTransactions"
                    type="border"
                    small
                  ></b-spinner>
                  {{ $t(`forms.wallet`) }}
                </template>
                <user_wallet />
              </b-tab>
            </b-tabs>
          </b-card>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-colxx>
    </b-row>
    <b-modal
      id="note"
      ref="note"
      :title="$t('SEND_NOTE')"
      :no-close-on-backdrop="true"
    >
      <b-form-group :label="$t('todo.note')">
        <b-textarea v-model="note" :rows="4" :max-rows="4" />
      </b-form-group>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          :disabled="!note || submit_note"
          @click="sendAttachNote('note')"
          class="mr-1"
          >{{ $t("forms.send") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('note')">{{
          $t("survey.cancel")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal
      id="attach"
      ref="attach"
      :title="
        update_attachment ? $t('todo.add-new-attach') : $t('todo.update-attach')
      "
      :no-close-on-backdrop="true"
    >
      <b-form-group v-if="update_attachment" :label="$t('forms.category')">
        <b-form-select
          :state="!$v.attach_form.category.$error"
          v-model="$v.attach_form.category.$model"
          :options="attach_category_options"
          plain
        />
        <b-form-invalid-feedback v-if="!$v.attach_form.category.required">{{
          $t("forms.category_filed")
        }}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('block.file')">
        <vue-dropzone
          ref="myVueDropzone"
          id="dropzone"
          :options="dropzoneOptions"
          @vdropzone-files-added="fileAdded"
          @vdropzone-removed-file="fileRemoved"
        ></vue-dropzone>
      </b-form-group>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          @click="addAttach('attach')"
          class="mr-1"
          :disabled="file_added || model_button"
          >{{ $t("forms.send") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('attach')">{{
          $t("survey.cancel")
        }}</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Vuetable from "vuetable-2/src/components/Vuetable";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { validationMixin } from "vuelidate";
import Datepicker from "vuejs-datepicker";
import user_wallet from "./user_wallet.vue";
import VueDropzone from "vue2-dropzone";
const {
  required,
  email,
  requiredIf,
  minLength,
  maxLength
} = require("vuelidate/lib/validators");

export default {
  components: {
    "datatable-heading": DatatableHeading,
    datepicker: Datepicker,
    vuetable: Vuetable,
    user_wallet,
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      userId: null,
      _role: null,
      DateSelected: false,
      attachmentId: null,
      is_num_verfiy: true,
      type: null,
      add_Attachment: false,
      when_attach_action: true,
      getTransactions: false,
      submit_note: false,
      update_attachment: true,
      add_attach: false,
      getAttachments: true,
      isUserForm: false,
      model_button: false,
      note: null,
      file_added: true,
      enable: false,
      file: null,
      selectedTab: "basicDetails",
      create_role: null,
      roleOptions: [],
      attach_form: {
        category: ""
      },
      countryOptions: [],
      nationalityOptions: [],
      attach_category_options: [],
      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        acceptedFiles: "application/pdf,jpeg,png",
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
      },
      attach_Options: [
        { name: "OPEN", value: 0 },
        { name: "VERIFY", value: 1 },
        { name: "UPDATE", value: 2 },
        { name: "SEND_NOTE", value: 3 }
      ],
      activeOptions: [
        { text: "YES", value: 1 },
        { text: "NO", value: 0 }
      ],
      gridForm: {
        first_name: "",
        last_name: "",
        second_name: "",
        middle_name: "",
        identity_number: "",
        country: "",
        phone_number_confirmed: "",
        identity_verfied: "",
        nationality: "",
        license_number: "",
        email: "",
        password: "",
        phone_number: "",
        role: "",
        active: "",
        dob: ""
      },

      fields: [
        {
          name: "original_filename",
          title: "File",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%"
        },
        {
          name: "category",
          title: "Category",
          titleClass: "",
          dataClass: "text-muted",
          width: "30%"
        },

        {
          name: "verfied",
          callback: value => {
            return value === 1
              ? `<span class="badge badge-pill badge-success handle mr-1">
                verfied
              </span>`
              : `<span class="badge badge-pill badge-danger handle mr-1">
                unconfirmed
              </span>`;
          },
          title: "Status",
          titleClass: "",
          dataClass: "text-muted",
          width: "30%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ]
    };
  },
  mixins: [validationMixin],
  validations: {
    gridForm: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      second_name: {
        required: requiredIf(function() {
          return this.isOptional;
        })
      },
      middle_name: {
        required: requiredIf(function() {
          return this.isOptional;
        })
      },
      identity_number: {
        required: requiredIf(function() {
          return this.isOptional;
        })
      },
      country: {
        required: requiredIf(function() {
          return this.isOptional;
        })
      },
      license_number: {
        required: requiredIf(function() {
          return this.isOptional;
        })
      },
      nationality: {
        required: requiredIf(function() {
          return this.isOptional;
        })
      },
      dob: {
        required
      },
      password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(6)
      },
      email: {
        required,
        email
      },
      phone_number: {
        required
      },
      role: {
        required
      },
      active: {}
    },
    attach_form: {
      category: {
        required
      }
    }
  },
  created() {
    this.type = this.$route.fullPath.split("/")[2];
    this.userId = this.$route.query.id;
    this.getCountries();
    this.getNationalities();
    console.log(this.type);
    if (this.type === "users" && !this.userId) {
      this.isUserForm = false;
      this.creation(this.type);
    } else if (this.type === "users" && this.userId) {
      this.isUserForm = true;
      this.getUserInfo({ id: this.userId });
      this.getUserAttach({ id: this.userId });
      this.getAttachCategory();
      this.creation(this.type);
    } else if (this.userId) {
      this.getUserInfo({ id: this.userId });
    } else {
      this.creation(this.type);
    }
  },
  methods: {
    ...mapActions([
      "getUserInfo",
      "identityConfirm",
      "getUserAttach",
      "getCountries",
      "phoneConfirm",
      "getNationalities",
      "verfiyAttach",
      "updateUserInfo",
      "createUser",
      "updateAttachment",
      "addAttachment",
      "getAttachCategory",
      "sendAttachmentNote"
    ]),
    rowClicked(dataItem, event) {
      const path = dataItem.path;
      console.log(dataItem.path);
    },
    onGridFormSubmit() {
      if (this.userId) {
        // because of the form validation i set password
        this.getRole();
        this.$v.$touch();
        this.$v.gridForm.$touch();
        this.gridForm.password = "wwerwe234234";
        if (!this.$v.gridForm.$invalid) {
          console.log("!this.$v.gridForm.$invalid");
          console.log(this.gridForm);

          this.enable = true;
          this.updateUserInfo({
            user: {
              first_name: this.gridForm.first_name,
              last_name: this.gridForm.last_name,
              phone_number: this.gridForm.phone_number,
              email: this.gridForm.email,
              identity_number: this.gridForm.identity_number,
              license_number: this.gridForm.license_number,
              second_name: this.gridForm.second_name,
              country_id: this.gridForm.country,
              nationality_id: this.gridForm.nationality,
              middle_name: this.gridForm.middle_name,
              role: this.getRole(),
              dob: this.gridForm.dob,
              password: this.gridForm.password,
              active: this.gridForm.active
            },
            type: this.type,
            id: this.UserInfo.id
          });
        }
      } else {
        this.$v.$touch();
        console.log("ewedaedaedaedsedsedsawdaaaaaaaaaaaaaaaaaaaa");
        this.$v.gridForm.$touch();
        if (!this.$v.gridForm.$invalid) {
          this.enable = true;
          this.createUser({
            user: {
              first_name: this.gridForm.first_name,
              last_name: this.gridForm.last_name,
              phone_number: this.gridForm.phone_number,
              email: this.gridForm.email,
              identity_number: this.gridForm.identity_number,
              second_name: this.gridForm.second_name,
              country_id: this.gridForm.country,
              nationality_id: this.gridForm.nationality,
              license_number: this.gridForm.license_number,
              middle_name: this.gridForm.middle_name,
              role: this.gridForm.role,
              dob: this.gridForm.dob,
              password: this.gridForm.password
            },
            // user: this.gridForm,
            type: this.type
          });
        }
      }
    },
    add_New_attach() {
      console.log("wefwerwerwerwerwerwerwer");
      this.$refs["attach"].show();
    },

    attach_Action(value, item) {
      this.selectedTab === "attachment";
      this.update_attachment = true;
      console.log(item, value);
      switch (value) {
        case 0:
          window.open(item.path);
          break;
        case 1:
          this.verfiyAttach({ id: item.id });
          break;
        case 2:
          this.update_attachment = false;
          this.attachmentId = item.id;
          this.$refs["attach"].show();
          break;
        case 3:
          this.$refs["note"].show();
          this.attachmentId = item.id;
          break;
        default:
          break;
      }
    },

    hideModal(refname) {
      this.$refs[refname].hide();
    },
    sendAttachNote() {
      this.submit_note = true;
      this.sendAttachmentNote({
        attachment_id: this.attachmentId,
        notes: this.note
      });
    },
    addAttach() {
      this.model_button = true;

      if (!this.update_attachment) {
        this.model_button = true;
        this.updateAttachment({
          _method: "PUT",
          path: this.file[0],
          attachment_id: this.attachmentId,
          userId: this.userId
        });
      } else {
        this.$v.$touch();
        this.$v.attach_form.$touch();
        console.log(this.attach_form);
        if (!this.$v.attach_form.$invalid) {
          this.model_button = true;
          this.addAttachment({
            path: this.file[0],
            userId: this.userId,
            category: this.attach_form.category
          });
        }
      }
    },
    phone_comfirm() {
      this.phoneConfirm({ userId: this.userId });
    },
    identity_comfirm() {
      this.identityConfirm({ userId: this.userId });
    },
    getRole() {
      switch (this.gridForm.role) {
        case "superadmin":
          return 1;
        case "admin":
          return 2;
        case "accountant":
          return 7;
      }
    },
    selectedDate() {
      this.DateSelected = true;
    },

    creation(type) {
      console.log(type);
      this.isUserForm = false;
      switch (type) {
        case "admins":
          this.isUserForm = false;
          return (this.roleOptions = [
            { text: "Super Admin", value: 1 },
            { text: "Admin", value: 2 }
          ]);
        case "accountant":
          this.isUserForm = false;
          return (this.roleOptions = [{ text: "Accountant", value: 7 }]);
        case "users":
          this.isUserForm = true;
          return (this.roleOptions = [{ text: "User", value: 3 }]);
      }
    },
    fileAdded(file) {
      console.log(file);
      this.file_added = false;
      this.file = file;
    },
    fileRemoved(file) {
      this.file = null;
      this.file_added = true;
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
      "UserInfo",
      "_emailErr",
      "processing",
      "_updateUserInfo",
      "_UserAttach",
      "_AttachProcessing",
      "_verfiedAtachmet",
      "_sendNoteSuccess",
      "_getCountries",
      "_AttachCategory",
      "_phoneVerification",
      "_identityVerification",
      "_addAttachSuccess",
      "_createAttachError",
      "_updateAttachSuccess"
    ]),
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isOptional() {
      return this.isUserForm; // some conditional logic here...
    },
    role: {
      get() {
        switch (this.gridForm.role) {
          case "superadmin":
            return 1;
          case "admin":
            return 2;
          case "accountant":
            return 7;
        }
      }
    }
  },
  watch: {
    UserInfo(newInfo, oldOne) {
      this.gridForm.first_name = newInfo.first_name;
      this.gridForm.last_name = newInfo.last_name;
      this.gridForm.email = newInfo.email;
      this.gridForm.dob = newInfo.dob;
      this.gridForm.phone_number = newInfo.phone_number;
      // this.gridForm.password = newInfo.password;
      this.gridForm.second_name = newInfo.second_name;
      this.gridForm.middle_name = newInfo.middle_name;
      this.gridForm.identity_number = newInfo.identity_number;
      this.gridForm.country = newInfo.country;
      this.gridForm.nationality = newInfo.nationality;
      this.gridForm.role = newInfo.role[0];
      this.gridForm.identity_verfied = newInfo.identity_verfied;
      this.gridForm.phone_number_confirmed = newInfo.phone_number_confirmed;
      this.gridForm.active = newInfo.active;
    },
    _addAttachSuccess(newInfo, oldest) {
      console.log(this.selectedTab, "taabbbbbbbbbbbbbbbbbbbbbbbb");
      this.$notify(
        "success",
        "Operation completed successfully",
        "User Attachment has been added successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["attach"].hide();
      this.model_button = false;

      this.getUserAttach({ id: this.userId });
    },
    _updateAttachSuccess: function(val) {
      this.update_attachment = true;
      this.model_button = false;
      console.log(this.selectedTab, "taabbbbbbbbbbbbbbbbbbbbbbbb");

      this.$notify(
        "success",
        "Operation completed successfully",
        "User Attachment has been updated successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["attach"].hide();
      this.getUserAttach({ id: this.userId });
    },
    _UserAttach(newInfo, oldOne) {
      this.getAttachments = false;
      this.$refs.vuetable.setData(newInfo);
    },
    _sendNoteSuccess(newVal, old) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "The note has been sent successfully",
        {
          duration: 3000,
          permanent: false
        }
      );
      this.submit_note = false;
      this.attach_form.category = null;
      this.$refs["note"].hide();
    },
    _verfiedAtachmet(newVal, odt) {
      this.getUserAttach({ id: this.userId });
    },
    _phoneVerification(newVal, odt) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Phone Number have been Comfirmed successfully",
        { duration: 4000, permanent: false }
      );
      this.getUserInfo({ id: this.userId });
    },
    _identityVerification(newVal, odt) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Identity have been Comfirmed successfully",
        { duration: 4000, permanent: false }
      );
      this.getUserInfo({ id: this.userId });
    },
    _updateUserInfo(newVal, odt) {
      console.log("hereeee", newVal);
      if (newVal.status === 200) {
        this.$notify(
          "success",
          "Operation completed successfully",
          "user info have been updated successfully",
          { duration: 3000, permanent: false }
        );
      } else {
        this.$notify(
          "success",
          "Operation completed successfully",
          "user has been created successfully",
          { duration: 3000, permanent: false }
        );
      }
    },
    _createAttachError(newVal, old) {
      this.$notify(
        "error",
        `You uploaded ${this.attach_form.category} already.`,
        null,
        { duration: 5000, permanent: false }
      );
      this.$refs["attach"].hide();
    },
    _AttachCategory(newCon, oldOne) {
      newCon.forEach(option => {
        this.attach_category_options.push(
          new Object({
            value: option,
            text: option
          })
        );
      });
    },
    _getCountries(newCon, oldOne) {
      newCon.forEach(option => {
        this.countryOptions.push(
          new Object({
            value: option.id,
            text: option.locales.en.name
          })
        );
        this.nationalityOptions.push(
          new Object({
            value: option.id,
            text: option.locales.en.name
          })
        );
      });
    },

    _emailErr(newd, odt) {
      this.enable = false;

      this.$notify(
        "error",
        "Operation uncompleted",
        "This Email Already Exists",
        { duration: 4000, permanent: false }
      );
    }
  }
};
</script>
