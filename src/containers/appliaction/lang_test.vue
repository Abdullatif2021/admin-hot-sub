<template>
  <form @submit.prevent="onSubmit" @reset="onReset">
    <div class="card m-3">
      <h5 class="card-header">Vue.js + Vuelidate - Dynamic Form Example</h5>
      <div class="card-body border-bottom">
        <div class="form-row">
          <div class="form-group">
            <label>Number of langs</label>
            <select
              v-model="numberOflangs"
              class="form-control"
              :class="{ 'is-invalid': $v.numberOflangs.$error }"
              @change="onChangelangs"
            >
              <option value=""></option>
              <option
                v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :key="i"
                :value="i"
                >{{ i }}</option
              >
            </select>
            <div class="invalid-feedback">Number of langs is required</div>
          </div>
        </div>
      </div>
      <div
        v-for="(lang, i) in langs"
        :key="i"
        :set="(v = $v.langs.$each[i])"
        class="list-group list-group-flush"
      >
        <div class="list-group-item">
          <h5 class="card-title">lang {{ i + 1 }}</h5>
          <div class="form-row">
            <div class="form-group col-6">
              <label>Name</label>
              <input type="text" v-model="lang.name" class="form-control" />
              <div class="invalid-feedback">
                <div>Name is required</div>
              </div>
            </div>
            <div class="form-group col-6">
              <label>Email</label>
              <input type="text" v-model="lang.email" class="form-control" />
              <div class="invalid-feedback">
                <div v-if="!v.email.required">Email is required</div>
                <div v-if="!v.email.email">Email is invalid</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-center border-top-0">
        <button class="btn btn-primary mr-1">
          Buy langs
        </button>
        <button class="btn btn-secondary mr-1" type="reset">Reset</button>
      </div>
    </div>
  </form>
</template>

<script>
const { required, email } = require("vuelidate/lib/validators");
export default {
  data() {
    return {
      numberOflangs: "",
      langs: []
    };
  },
  validations: {
    numberOflangs: { required },
    langs: {
      $each: {
        name: { required },
        email: { required, email }
      }
    }
  },
  methods: {
    onChangelangs(e) {
      const numberOflangs = Number(e.target.value || 0);
      this.langs = [...Array(numberOflangs).keys()].map(
        i => this.langs[i] || {}
      );
    },
    onSubmit(e) {
      // set all fields to touched
      this.$v.$touch();

      // stop here if form is invalid
      if (this.$v.$invalid) return;

      // display form values on success
      alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.$data, null, 4));
    },
    onReset() {
      // reset form validation errors
      this.$v.$reset();

      // reset form data
      const initialData = this.$options.data.call(this);
      Object.assign(this.$data, initialData);
    }
  }
};
</script>
