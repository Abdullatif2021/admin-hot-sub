<template>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.settings-list')" />
      <div class="separator mb-5"></div>
    </b-colxx>

    <b-colxx xxs="12" v-for="item in settings" :key="item.id">
      <b-card class="mb-4" :title="item.key">
        <b-form>
          <b-row>
            <b-colxx xxs="12">
              <b-form-input
                @change="process(item.id, item.key, item.value)"
                v-model="item.value"
                type="text"
              ></b-form-input>
            </b-colxx>
          </b-row>
        </b-form>
      </b-card>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card v-if="!isLoadSettings" class="mb-4">
        <b-form>
          <b-row>
            <b-colxx
              xxs="12"
              style="display: flex;align-items: center;justify-content: center;"
            >
              <!-- <h3>{{ items.length }}</h3> -->
              <b-button
                :disabled="!items"
                @click="save()"
                class="mb-2"
                size="lg"
                variant="primary"
                >{{ $t("button.save") }} {{ items.length }}
                {{ $t("button.changes") }}</b-button
              >
            </b-colxx>
          </b-row>
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
      items: []
    };
  },
  methods: {
    ...mapActions(["getSettings", "updateSettings"]),
    process(id, key, value) {
      console.log("sdfsdfsdfsdfsdf");
      console.log(id, key, value);
      this.items.push({
        id: id,
        key: key,
        value: value
      });
      console.log(this.items);
    },
    save() {
      this.items.forEach(item => {
        console.log(item);
        this.updateSettings(item);
      });
      //     successButtonClick() {
      //   // eslint-disable-next-line promise/param-names
      //   return new Promise((success, fail) => {
      //     setTimeout(() => {
      //       success("Everything went right!");
      //     }, 2000);
      //   });
      // },
    }
  },
  created() {
    this.getSettings();
  },
  computed: {
    ...mapGetters(["settings", "isLoadSettings", "updatedSuccessfuly"])
  },
  watch: {
    updatedSuccessfuly() {
      console.log("updatedSuccessfuly");
      this.$notify(
        "success",
        "Operation completed successfully",
        "Settings have been updated successfully",
        { duration: 3000, permanent: false }
      );
    }
  },
  destroyed() {
    console.log("destroyed");
  }
};
</script>
