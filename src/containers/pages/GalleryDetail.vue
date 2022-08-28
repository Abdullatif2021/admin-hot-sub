<template>
  <div :class="containerClass">
    <div class="row social-image-row gallery">
      <b-colxx xxs="6" v-for="(thumb, thumbIndex) in items" :key="`thumb_${thumbIndex}`">
      <div style="display: flex;flex-direction: column;" @click="open_link(thumb.link)">
                       <img
          class="img-fluid border-radius"
          :src="thumb.img"
          alt="thumbnail"
          @click="onThumbClick(thumbIndex)"
        />
        <div style="display: flex;justify-content: center;align-items: center;"> <p v-if="thumb.img != thumb.link">{{thumb.original_filename}}</p></div>
       
                    </div>
      </b-colxx>
    </div>
    <!-- <LightGallery
      :images="items"
      :index="photoIndex"
      :disable-scroll="true"
      @close="handleHide()"
    /> -->
  </div>
</template>

<script>
import { LightGallery } from "vue-light-gallery";

const images = [
  "/assets/img/products/fruitcake.jpg",
  "/assets/img/products/napoleonshat.jpg",
  "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg", "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg", "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg", "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg",
  "/assets/img/products/marble-cake.jpg",
  "/assets/img/products/parkin.jpg"
];
const thumbs = [
  "/assets/img/products/fruitcake-thumb.jpg",
  "/assets/img/products/napoleonshat-thumb.jpg",
  "/assets/img/products/tea-loaf-thumb.jpg",
  "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg", "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg", "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg", "/assets/img/products/tea-loaf.jpg",
  "/assets/img/products/magdalena.jpg",
  "/assets/img/products/marble-cake.jpg",
  "/assets/img/products/magdalena-thumb.jpg",
  "/assets/img/products/marble-cake-thumb.jpg",
  "/assets/img/products/parkin-thumb.jpg"
];
export default {
   props: {
    items: {
      
    },
    containerClass: {
      type: String,
      default: ""
    },
  
  },
  components: {
    LightGallery
  },
  data() {
    return {
      images,
      thumbs,
      isOpen: false,
      photoIndex: null
    };
  },
 
  methods: {
    onThumbClick(index) {
      this.photoIndex = index;
      this.isOpen = false;
    },
    open_link(link){
      window.open(link);
    },
    handleHide() {
      this.photoIndex = null;
      this.isOpen = false;
    }
  }
};
</script>
