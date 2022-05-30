<template>
  <div>
    <datatable-heading
      :details="true"
      :reload="true"
      :title="userId ? $t('forms.grid') : $t('forms.createUser')"
    ></datatable-heading>
    <b-row>
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
                      >Please enter first name</b-form-invalid-feedback
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
                      >Please enter last name</b-form-invalid-feedback
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
                    <b-form-invalid-feedback v-if="!$v.gridForm.email.required"
                      >Please enter email</b-form-invalid-feedback
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
                      >Password is required!</b-form-invalid-feedback
                    >
                    <b-form-invalid-feedback
                      v-else-if="!$v.gridForm.password.minLength"
                      >Minimum 6</b-form-invalid-feedback
                    >
                    <b-form-invalid-feedback
                      v-else-if="!$v.gridForm.password.maxLength"
                      >Maximum 16</b-form-invalid-feedback
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
                      >Please enter phone number</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx v-if="!userId" sm="12">
                  <b-form-group :label="$t('forms.role')">
                    <b-form-select
                      :state="!$v.gridForm.role.$error"
                      v-model="$v.gridForm.role.$model"
                      :options="roleOptions"
                      plain
                    />
                    <b-form-invalid-feedback v-if="!$v.gridForm.role.required"
                      >Please select user role</b-form-invalid-feedback
                    >
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="12">
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
                      Date of birth required
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
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { validationMixin } from "vuelidate";
import Datepicker from "vuejs-datepicker";
const {
  required,
  email,
  minLength,
  maxLength
} = require("vuelidate/lib/validators");

export default {
  components: {
    "datatable-heading": DatatableHeading,
    datepicker: Datepicker
  },
  data() {
    return {
      userId: null,
      _role: null,
      DateSelected: false,
      type: null,
      enable: false,
      create_role: null,
      roleOptions: [
        // { text: "Super Admin", value: 1 },
        // { text: "Admin", value: 2 },
        // { text: "Accountant", value: 7 }
      ],
      activeOptions: ["", { text: "YES", value: 1 }, { text: "NO", value: 0 }],
      gridForm: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        role: "",
        active: "",
        dob: ""
      }
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
    if (this.userId) {
      this.getUserInfo({ id: this.userId });
    } else {
      this.creation(this.type);
    }
  },
  methods: {
    ...mapActions(["getUserInfo", "updateUserInfo", "createUser"]),
    onGridFormSubmit() {
      if (this.userId) {
        // because of the form validation i set password
        this.getRole();
        this.gridForm.password = "fr234f23f324";
        this.$v.$touch();
        this.$v.gridForm.$touch();
        if (!this.$v.gridForm.$invalid) {
          this.enable = true;
          this.updateUserInfo({
            user: {
              first_name: this.gridForm.first_name,
              last_name: this.gridForm.last_name,
              phone_number: this.gridForm.phone_number,
              email: this.gridForm.email,
              role: this.getRole(),
              dob: this.gridForm.dob,
              active: this.gridForm.active
            },
            type: this.type,
            id: this.UserInfo.id
          });
        }
      } else {
        this.$v.$touch();
        this.$v.gridForm.$touch();
        if (!this.$v.gridForm.$invalid) {
          this.enable = true;

          this.createUser({
            user: {
              first_name: this.gridForm.first_name,
              last_name: this.gridForm.last_name,
              phone_number: this.gridForm.phone_number,
              email: this.gridForm.email,
              role: this.gridForm.role,
              dob: this.gridForm.dob,
              password: this.gridForm.password
            },
            type: this.type
          });
        }
      }
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
      switch (type) {
        case "admins":
          return (this.roleOptions = [
            { text: "Super Admin", value: 1 },
            { text: "Admin", value: 2 }
          ]);
        case "accountant":
          return (this.roleOptions = [{ text: "Accountant", value: 7 }]);
      }
    }
  },
  computed: {
    ...mapGetters(["UserInfo", "_emailErr", "processing", "_updateUserInfo"]),
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
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
      this.gridForm.role = newInfo.role[0];
      this.gridForm.active = newInfo.active;
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
