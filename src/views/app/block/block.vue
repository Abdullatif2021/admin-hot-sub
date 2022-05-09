<template>
  <div></div>
</template>

<script>
import SingleLightbox from "../../../containers/pages/SingleLightbox.vue";
import VideoPlayer from "../../../components/Common/VideoPlayer.vue";
import RecentPost from "../../../components/Common/RecentPost.vue";
import { blogData, blogCategories } from "../../../data/blog";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    "single-lightbox": SingleLightbox,
    "video-player": VideoPlayer,
    "recent-post": RecentPost
  },
  data() {
    return {
      blockId: null,
      recentPosts: blogData.slice(5),
      blogCategories
    };
  },
  methods: {
    ...mapActions(["getBlock"]),
    ...mapGetters(["block"])
  },
  created() {
    this.blockId = this.$route.params.id;
    this.getBlock(this.blockId);
    console.log(this.block);
  }
};
</script>
