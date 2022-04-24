<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('forms.grid')">
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

            <b-colxx sm="12">
              <b-form-group :label="$t('forms.phonenumber')">
                <b-form-input
                  type="text"
                  v-model="gridForm.phonenumber"
                ></b-form-input>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.role')">
                <b-form-select
                  v-model="gridForm.role"
                  :options="roleOptions"
                  plain
                />
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('forms.active')">
                <b-form-select
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
    this.getUserInfo({ id: this.userId });
    setTimeout(() => {
      (this.gridForm.firstname = this.UserInfo.first_name),
        (this.gridForm.lastname = this.UserInfo.last_name),
        (this.gridForm.email = this.UserInfo.email),
        (this.gridForm.phonenumber = this.UserInfo.phone_number);
      (this.gridForm.role = this.UserInfo.role[0]),
        (this.gridForm.active = this.UserInfo.active);
    }, 1000);
  },
  methods: {
    ...mapActions(["getUserInfo", "updateUserInfo"]),
    onGridFormSubmit() {
      console.log(this.gridForm);
      // console.log(this.UserInfo);
      this.updateUserInfo({
        info: this.gridForm,
        id: this.UserInfo.id
      });
    }
  },
  computed: {
    ...mapGetters(["UserInfo"]),
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    role: {
      get() {
        return this.gridForm.role;
      },
      set(newRole) {
        console.log("sdfsf", newRole);
        return newRole;
      }
    }
  }
};
</script>
