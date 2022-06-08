<template>
  <div>
    <datatable-heading
      :details="false"
      :show="false"
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
                :title="$t(`forms.basic_details`)"
                active
                title-item-class="w-50 text-center"
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
                    <!-- <b-colxx sm="6">
                      <b-form-group :label="$t('forms.nationality')">
                        <b-form-input
                          type="text"
                          :state="!$v.gridForm.nationality.$error"
                          v-model="$v.gridForm.nationality.$model"
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
                        <b-form-input
                          type="text"
                          :state="!$v.gridForm.country.$error"
                          v-model="$v.gridForm.country.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm.country.required"
                          >{{
                            $t("forms.country_filed")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx> -->
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
                title-item-class="w-50 text-center"
                :title="$t(`forms.attach`)"
              >
                <b-colxx xxs="12">
                  <template v-if="processing">
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
          @click="sendAttachNote('note')"
          class="mr-1"
          >{{ $t("forms.send") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('note')">{{
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
    vuetable: Vuetable
  },
  data() {
    return {
      userId: null,
      _role: null,
      DateSelected: false,
      attachmentId: null,
      type: null,
      isUserForm: false,
      note: null,
      enable: false,
      create_role: null,
      roleOptions: [],
      countryOptions: [],
      nationalityOptions: [],
      attach_Options: [
        { name: "OPEN", value: 0 },
        { name: "VERIFY", value: 1 },
        { name: "SEND_NOTE", value: 2 }
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
      "getUserAttach",
      "getCountries",
      "getNationalities",
      "verfiyAttach",
      "updateUserInfo",
      "createUser",
      "sendAttachmentNote"
    ]),
    rowClicked(dataItem, event) {
      const path = dataItem.path;
      console.log(dataItem.path);
      window.open(path);
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
              country: this.gridForm.country,
              nationality: this.gridForm.nationality,
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
            // user: {
            //   first_name: this.gridForm.first_name,
            //   last_name: this.gridForm.last_name,
            //   phone_number: this.gridForm.phone_number,
            //   email: this.gridForm.email,
            //   identity_number: this.gridForm.identity_number,
            //   second_name: this.gridForm.second_name,
            //   country: this.gridForm.country ? this.gridForm.country : null,
            //   nationality: this.gridForm.nationality ? this.gridForm.nationality : null,
            //   license_number: this.gridForm.license_number,
            //   middle_name: this.gridForm.middle_name,
            //   role: this.gridForm.role,
            //   dob: this.gridForm.dob,
            //   password: this.gridForm.password
            // },
            user: this.gridForm,
            type: this.type
          });
        }
      }
    },
    add_New_attach() {
      console.log("wefwerwerwerwerwerwerwer");
    },
    attach_Action(value, item) {
      console.log(item);
      switch (value) {
        case 0:
          window.open(item.path);
          break;
        case 1:
          this.verfiyAttach({ id: item.id });
          break;
        case 2:
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
      this.sendAttachmentNote({
        attachment_id: this.attachmentId,
        notes: this.note
      });
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
    }
  },
  computed: {
    ...mapGetters([
      "UserInfo",
      "_emailErr",
      "processing",
      "_updateUserInfo",
      "_UserAttach",
      "_verfiedAtachmet",
      "_sendNoteSuccess",
      "_getCountries"
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
      this.gridForm.active = newInfo.active;
    },

    _UserAttach(newInfo, oldOne) {
      this.$refs.vuetable.setData(newInfo);
    },
    _sendNoteSuccess(newVal, old) {
      this.$notify("success", null, "The note has been sent successfully", {
        duration: 3000,
        permanent: false
      });
      this.$refs["note"].hide();
    },
    _verfiedAtachmet(newVal, odt) {
      this.getUserAttach({ id: this.userId });
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
    _getCountries(newCon, oldOne) {
      newCon.forEach(option => {
        this.countryOptions.push(
          new Object({
            value: option.locales.en.name,
            text: option.locales.en.name
          })
        );
        this.nationalityOptions.push(
          new Object({
            value: option.locales.en.name,
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
