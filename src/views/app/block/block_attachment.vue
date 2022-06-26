<template>
  <b-colxx xxs="12" xs="12" lg="12">
    <b-card class="mb-4" no-body>
      <b-tabs card no-fade>
        <b-tab :title="$t('forms.images')" active>
          <div style="display: grid;">
            <b-button
              v-b-modal.modalright
              variant="primary"
              style="margin: auto;margin-bottom: 17px;"
              size="lg"
              >{{ $t("block.add-new") }}</b-button
            >
            <b-colxx lg="12" xl="12" class="mb-4">
              <recent-orders
                @deleteImage="deleteImage"
                :_ImageList="_blockImageList"
              />
            </b-colxx>
          </div>
          <add-new-modal
            :enable="enable"
            @AddNewImage="createImage"
            :_sccussCreateImage="_successAddBlockImage"
          ></add-new-modal>
        </b-tab>
        <b-tab @click="openFile()" :title="$t('forms.files')">
          <file
            :list="_blockFileList"
            :isLoad="_isBLoadAttach"
            @delete-file="delete_File"
            @create-file="create_File"
          />
        </b-tab>
        <b-tab @click="openVideo()" :title="$t('forms.videos')">
          <videoAttachment
            :video_list="_blockVideosList"
            :isLoad="_isBLoadAttach"
            @delete-video="delete_Video"
            @create-video="create_Video"
          />
        </b-tab>
        <b-tab @click="openYoutubeVideo()" :title="$t('forms.youtube_videos')">
          <youtube_video
            :list="_blockYoutubeVideosList"
            :isLoad="_isBLoadAttach"
            :successAddYoutubeVideo="_successAddBlockYoutubeVideo"
            :wrongYoutubeurl="_BwrongYoutubeurl"
            @delete-youtube="delete_Youtube"
            @create-youtube="create_Youtube"
            @update-youtube="update_Youtube"
          />
        </b-tab>
      </b-tabs>
    </b-card>
  </b-colxx>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import RecentOrders from "../../../containers/appliaction/RecentOrders.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import video from "../../../components/shared/video.vue";
import file from "../../../components/shared/file.vue";
import youtube_video from "../../../components/shared/youtube_video.vue";

export default {
  components: {
    "add-new-modal": AddNewModal,
    file: file,
    youtube_video: youtube_video,
    videoAttachment: video,
    "recent-orders": RecentOrders
  },
  props: ["blockId"],
  data() {
    return {
      enable: false
    };
  },

  created() {
    this.getBlockImageList({ id: this.blockId });
  },
  methods: {
    ...mapActions([
      "getBlockImageList",
      "deleteBlockFile",
      "deleteBlockVideo",
      "createBlockFile",
      "getBlockFileList",
      "getBlockVideosList",
      "createBlockImage",
      "deleteBlockImage",
      "createBlockVideo",
      "deleteBlockVideo",
      "getBlockYoutubeVideoList",
      "createBlockYoutubeVideo",
      "updateBlockYoutubeVideo",
      "deleteBlockYoutubeVideo"
    ]),
    // ..................... image ......................
    createImage(value) {
      console.log(value);
      this.enable = true;
      this.createBlockImage({
        info: value.info,
        image: value.image ? value.image : null,
        id: this.blockId
      });
    },
    deleteImage(id) {
      this.deleteBlockImage({ id: this.blockId, attachment_id: id });
    },
    // .....................video ......................
    openVideo() {
      this.getBlockVideosList({ id: this.blockId });
    },
    create_Video(value) {
      this.createBlockVideo({
        info: value.info,
        video: value.video ? value.video : null,
        id: this.blockId
      });
    },
    delete_Video(value) {
      this.deleteBlockVideo({
        blockId: this.blockId,
        file_id: value
      });
    },

    // -------------------------------files---------------------------
    openFile() {
      this.getBlockFileList({ id: this.blockId });
    },
    create_File(info, path) {
      console.log("hi from createee", info, path);
      this.createBlockFile({ info: info, file: path, id: this.blockId });
    },
    delete_File(id) {
      this.deleteBlockFile({ id: this.blockId, file_id: id });
    },
    //  ....................... youtube .......................
    openYoutubeVideo() {
      this.getBlockYoutubeVideoList({ id: this.blockId });
    },
    create_Youtube(info, path) {
      this.createBlockYoutubeVideo({
        info: info,
        path: path,
        id: this.blockId
      });
    },
    update_Youtube(info, path, attach_id) {
      this.updateBlockYoutubeVideo({
        info: info,
        path: path,
        attachment_id: attach_id,
        id: this.blockId
      });
    },
    delete_Youtube(val) {
      this.deleteBlockYoutubeVideo({
        blockId: this.blockId,
        youtube_id: val
      });
    }
  },
  computed: {
    ...mapGetters([
      "_blockImageList",
      "_blockFileList",
      "_successAddBlockImage",
      "_sccussCreateBlockFile",
      "_blockVideosList",
      "_blockYoutubeVideosList",
      "_isBLoadAttach",
      "_BwrongYoutubeurl",
      "_successAddBlockYoutubeVideo"
    ])
  },
  watch: {
    _blockImageList: function(val) {
      this.enable = false;
    }
  }
};
</script>
