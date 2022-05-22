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
                    <b-form-input type="text" v-model="gridForm.firstname" />
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.lastname')">
                    <b-form-input type="text" v-model="gridForm.lastname" />
                  </b-form-group>
                </b-colxx>

                <b-colxx sm="12">
                  <b-form-group :label="$t('forms.email')">
                    <b-form-input
                      type="email"
                      v-model="gridForm.email"
                    ></b-form-input>
                  </b-form-group>
                </b-colxx>
                <b-colxx v-if="!userId" sm="12">
                  <b-form-group :label="$t('forms.password')">
                    <b-form-input
                      type="password"
                      v-model="password"
                    ></b-form-input>
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="12">
                  <b-form-group :label="$t('forms.phonenumber')">
                    <b-form-input
                      type="text"
                      v-model="gridForm.phonenumber"
                    ></b-form-input>
                  </b-form-group>
                </b-colxx>
                <b-colxx :sm="userId ? 6 : 12">
                  <b-form-group :label="$t('forms.role')">
                    <b-form-select
                      v-model="role"
                      :options="roleOptions"
                      plain
                    />
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

              <b-button type="submit" variant="primary" class="mt-4">{{
                $t("forms.save")
              }}</b-button>
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

export default {
  components: {
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      userId: null,
      _role: null,
      type: null,
      password: null,
      create_role: null,
      roleOptions: [
        // { text: "Super Admin", value: 1 },
        // { text: "Admin", value: 2 },
        // { text: "Accountant", value: 7 }
      ],
      activeOptions: ["", { text: "YES", value: 1 }, { text: "NO", value: 0 }],
      gridForm: {
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
        role: "",
        active: ""
      }
    };
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
      console.log("hi from submit", this.gridForm, this._role);
      if (this.userId) {
        console.log(this._role);
        this.updateUserInfo({
          type: this.type,
          role: this._role,
          info: this.gridForm,
          id: this.UserInfo.id
        });
      } else {
        this.createUser({
          type: this.type,
          info: this.gridForm,
          role: this._role,
          pass: this.password
        });
      }
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
    ...mapGetters(["UserInfo", "processing", "_updateUserInfo"]),
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
      },
      set(newRole) {
        switch (newRole) {
          case 1:
            return (this._role = 1);
          case 2:
            return (this._role = 2);
          case 7:
            return (this._role = 7);
        }
        console.log("new role", newRole);
        console.log(this._role);
      }
    }
  },
  watch: {
    UserInfo(newInfo, oldOne) {
      this.gridForm.firstname = newInfo.first_name;
      this.gridForm.lastname = newInfo.last_name;
      this.gridForm.email = newInfo.email;
      this.gridForm.phonenumber = newInfo.phone_number;
      this.gridForm.role = newInfo.role[0];
      this.gridForm.active = newInfo.active;
    },

    _updateUserInfo(newVal, odt) {
      console.log("hereeee", newVal);
      if (newVal === 200) {
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
    }
  }
};
</script>
