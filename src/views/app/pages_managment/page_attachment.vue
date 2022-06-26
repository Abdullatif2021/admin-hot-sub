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
              >{{ $t("survey.add-new") }}</b-button
            >
            <b-colxx lg="12" xl="12" class="mb-4">
              <recent-orders
                @deleteImage="deleteImage"
                :_ImageList="_pageImageList"
              />
            </b-colxx>
          </div>
          <add-new-modal
            :enable="enable"
            :_sccussCreateImage="_sccussCreatePageImage"
            @AddNewImage="createImage"
          ></add-new-modal>
        </b-tab>
        <b-tab @click="openFile()" :title="$t('forms.files')">
          <file
            :list="_pageFileList"
            :isLoad="_isLoadAttach"
            @delete-file="delete_File"
            @create-file="create_File"
          />
        </b-tab>
        <b-tab @click="openVideo()" :title="$t('forms.videos')">
          <videoAttachment
            :video_list="_pageVideosList"
            :isLoad="_isLoadAttach"
            @delete-video="delete_Video"
            @create-video="create_Video"
          />
        </b-tab>
        <b-tab @click="openYoutubeVideo()" :title="$t('forms.youtube_videos')">
          <youtube_video
            :list="_pageYoutubeVideosList"
            :isLoad="_isLoadAttach"
            :successAddYoutubeVideo="_successAddPageYoutubeVideo"
            :wrongYoutubeurl="_wrongYoutubeurl"
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
import file from "../../../components/shared/file.vue";
import video from "../../../components/shared/video.vue";
import youtube_video from "../../../components/shared/youtube_video.vue";

export default {
  components: {
    file: file,
    "add-new-modal": AddNewModal,
    videoAttachment: video,
    youtube_video: youtube_video,
    "recent-orders": RecentOrders
  },
  props: ["pageId"],
  data() {
    return {
      enable: false
    };
  },

  created() {
    this.getPageImageList({ id: this.pageId });
  },
  methods: {
    ...mapActions([
      "getPageImageList",
      "deletePageFile",
      "deletePageImage",
      "deletePageVideo",
      "createPageFile",
      "createPageImage",
      "getPageFileList",
      "getPageVideosList",
      "createPageVideo",
      "getPageYoutubeVideoList",
      "createPageYoutubeVideo",
      "updatePageYoutubeVideo",
      "deletePageYoutubeVideo"
    ]),
    // .....................image ......................
    deleteImage(id) {
      this.deletePageImage({ id: this.pageId, attachment_id: id });
    },
    createImage(value) {
      console.log(value);
      this.enable = true;
      this.createPageImage({
        info: value.info,
        image: value.image ? value.image : null,
        id: this.pageId
      });
    },
    // ..................... video ......................
    openVideo() {
      this.getPageVideosList({ id: this.pageId });
      this.isLoadAttach = false;
    },
    create_Video(value) {
      this.createPageVideo({
        info: value.info,
        video: value.video ? value.video : null,
        id: this.pageId
      });
    },
    delete_Video(value) {
      this.deletePageVideo({
        pageId: this.pageId,
        file_id: value
      });
    },
    // -------------------------------files---------------------------
    openFile() {
      this.getPageFileList({ id: this.pageId });
      this.isLoadAttach = false;
    },
    create_File(info, path) {
      console.log("hi from createee", info, path);
      this.createPageFile({ info: info, file: path, id: this.pageId });
    },
    delete_File(id) {
      this.deletePageFile({ pageId: this.pageId, file_id: id });
    },
    //  ....................... youtube ............................
    openYoutubeVideo() {
      this.getPageYoutubeVideoList({ id: this.pageId });
      this.isLoadAttach = false;
    },
    create_Youtube(info, path) {
      this.createPageYoutubeVideo({
        info: info,
        path: path,
        id: this.pageId
      });
    },
    update_Youtube(info, path, attach_id) {
      this.updatePageYoutubeVideo({
        info: info,
        path: path,
        attachment_id: attach_id,
        id: this.pageId
      });
    },
    delete_Youtube(val) {
      this.deletePageYoutubeVideo({
        pageId: this.pageId,
        youtube_id: val
      });
    }
  },
  computed: {
    ...mapGetters([
      "_pageImageList",
      "_pageFileList",
      "_successAddPageYoutubeVideo",
      "_sccussCreateFile",
      "_sccussCreatePageImage",
      "_pageVideosList",
      "_isLoadAttach",
      "_pageYoutubeVideosList",
      "_wrongYoutubeurl"
    ])
  },
  watch: {
    _pageImageList: function(val) {
      this.enable = false;
    }
  }
};
</script>
