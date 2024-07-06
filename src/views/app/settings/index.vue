<template>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.settings-list')" />
      <div class="separator mb-5"></div>
    </b-colxx>
    <template v-if="isLoadSettings">
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Location">
          <b-form>
            <b-row>
              <b-colxx xxs="12">
                <b-form-input v-model="location" type="text"></b-form-input>
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
        <b-card class="mb-4" title="Instagram">
          <b-form>
            <b-row>
              <b-colxx xxs="12">
                <b-form-input v-model="instagram" type="text"></b-form-input>
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
        <b-card class="mb-4" title="Phone Num">
          <b-form>
            <b-row>
              <b-colxx xxs="12">
                <b-form-input v-model="phone" type="text"></b-form-input>
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
      </b-colxx>
      <b-colxx xxs="12">
        <b-card v-if="isLoadSettings" class="mb-4">
          <b-form>
            <b-row>
              <b-colxx
                xxs="12"
                style="display: flex;align-items: center;justify-content: center;"
              >
                <!-- <h3>{{ items.length }}</h3> -->
                <b-button
                  @click="save()"
                  class="mb-2"
                  size="lg"
                  variant="primary"
                  >{{ $t("button.save") }} {{ $t("button.changes") }}</b-button
                >
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
      </b-colxx>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      items: [],
      isLoadSettings: false,
      instagram: null,
      phone: null,
      location: null
    };
  },
  created() {
    this.getSettings();
  },
  methods: {
    getSettings() {
      axios
        .get("http://back-end.hot-sub.ca/api/settings")
        .then(response => {
          console.log({ response });
          this.isLoadSettings = true;
          this.instagram = response.data.data[0].instagram_url;
          this.phone = response.data.data[0].phone_number;
          this.location = response.data.data[0].location_url;
        })
        .catch(error => {
          console.error("There was an error fetching the offers:", error);
        });
    },
    save() {
      const formData = {
        instagram_url: this.instagram,
        phone_number: this.phone,
        location_url: this.location
      };

      axios
        .put(`http://back-end.hot-sub.ca/api/settings/1`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          this.$notify(
            "success",
            "Operation completed successfully",
            "Settings have been updated successfully",
            { duration: 3000, permanent: false }
          );
        })
        .catch(error => {
          console.error("There was an error!", error);
          this.$notify("error", "Error via update", "Please try again", {
            duration: 4000,
            permanent: false
          });
        });
    }
  },

  destroyed() {}
};
</script>
