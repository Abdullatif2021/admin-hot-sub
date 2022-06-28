<template>
  <b-row>
    <template v-if="isLoad">
      <b-colxx style="display: grid;" xs="12" md="12" class="mb-3">
        <div class="top-right-button-container">
          <b-button-group style="float: right;padding: 12px;">
            <b-button v-b-modal.modalbackdrop variant="primary">{{
              $t("modal.create-new-video")
            }}</b-button>
          </b-button-group>
        </div>
        <b-card>
          <vuetable
            ref="vuetable"
            :api-mode="false"
            :reactive-api-url="true"
            :fields="videos_fields"
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
                  v-for="(item, index) in videos_Options"
                  :key="index"
                  @click="videos_Action(item.value, props.rowData)"
                  >{{ $t(item.name) }}</b-dropdown-item
                >
              </b-dropdown>
            </template>
          </vuetable>
        </b-card>
      </b-colxx>
      <add-new-video-model @AddNewVideo="createVideo" />
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </b-row>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import AddNewVideoModel from "../../containers/appliaction/AddNewVideoModel.vue";

export default {
  props: ["isLoad", "video_list"],
  components: {
    vuetable: Vuetable,
    AddNewVideoModel: AddNewVideoModel
  },
  data() {
    return {
      videos_fields: [
        {
          name: "id",
          title: "ID",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "40%"
        },
        {
          name: "original_filename",
          callback: value => {
            return value.substring(0, value.indexOf("."));
          },
          title: "File Name",
          titleClass: "",
          dataClass: "text-muted",
          width: "40%"
        },
        {
          name: "extension",
          title: "Extention",
          titleClass: "",
          dataClass: "text-muted",
          width: "40%"
        },

        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ],
      videos_Options: [
        { name: "DISPLAY", value: 1 },
        { name: "DELETE", value: 0 }
      ]
    };
  },
  created() {},
  methods: {
    createVideo(val) {
      this.$emit("create-video", val);
    },
    videos_Action(value, item) {
      if (value == 1) {
        window.open(item.path);
      } else {
        this.$emit("delete-video", item.id);
      }
    }
  },
  watch: {
    video_list: function(val) {
      this.$refs.vuetable.setData(val);
    }
  }
};
</script>
