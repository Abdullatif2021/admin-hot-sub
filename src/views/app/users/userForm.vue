<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card
        class="mb-4"
        :title="userId ? $t('forms.grid') : $t('forms.createUser')"
      >
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
                <b-form-input type="password" v-model="password"></b-form-input>
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

            <!-- <b-colxx v-if="!userId" sm="12">
              <b-form-group :label="$t('forms.role')">
                <b-form-select
                  v-model="create_role"
                  :options="roleOptions"
                  plain
                />
              </b-form-group>
            </b-colxx> -->
            <b-colxx :sm="userId ? 6 : 12">
              <b-form-group :label="$t('forms.role')">
                <b-form-select v-model="role" :options="roleOptions" plain />
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
    </b-colxx>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      userId: null,
      _role: null,
      password: null,
      create_role: null,
      sdfsdf: "sfsdfs",
      roleOptions: [
        "Select Role",
        { text: "Super Admin", value: 1 },
        { text: "Admin", value: 2 },
        { text: "Branch Admin", value: 4 },
        { text: "User", value: 3 },
        { text: "Casher", value: 5 },
        { text: "Guest", value: 6 }
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
    this.userId = this.$route.query.id;
    if (this.userId) {
      this.getUserInfo({ id: this.userId });
    } else {
      console.log("i am here ", this.userId);
    }
  },
  methods: {
    ...mapActions(["getUserInfo", "updateUserInfo", "createUser"]),
    onGridFormSubmit() {
      console.log("hi from submit", this.gridForm, this._role);
      if (this.userId) {
        console.log(this._role);
        this.updateUserInfo({
          role: this._role,
          info: this.gridForm,
          id: this.UserInfo.id
        });
      } else {
        this.createUser({
          info: this.gridForm,
          role: this._role,
          pass: this.password
        });
      }
    }
  },
  computed: {
    ...mapGetters(["UserInfo"]),
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
          case "user":
            return 3;
          case "branchadmin":
            return 4;
          case "casher":
            return 5;
          case "guest":
            return 6;
        }
      },
      set(newRole) {
        switch (newRole) {
          case 1:
            return (this._role = 1);
          case 2:
            return (this._role = 2);
          case 3:
            return (this._role = 3);
          case 4:
            return (this._role = 4);
          case 5:
            return (this._role = 5);
          case 6:
            return (this._role = 6);
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
    }
  }
};
</script>
