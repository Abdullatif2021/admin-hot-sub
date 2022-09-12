<template>
<div :class="containerClass1">
  <div :class="containerClass2">
    <div :class="containerClass3">
      <b-colxx xxs="6" v-for="(thumb, thumbIndex) in items" :key="`thumb_${thumbIndex}`">
      <div  class="file_pic" >
        <div class="position-absolute card-top-buttons-2"> 
                        <b-button  variant="outline-white" class="icon-button">
                          <i @click="$emit('showDeleteModel', thumb.id, thumb.type)" class="simple-icon-trash" />
                        </b-button>
                      </div>
                       <img
          class="img-fluid border-radius"
          style="height: 100px;width: 100px;border-radius: 10px;"
          :src="thumb.img"
          @click="open_link(thumb.link)"
          alt="thumbnail"
        />
        <div class="file_title"> <p v-if="thumb.img != thumb.link">{{thumb.original_filename}}</p></div>
       
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
    containerClass1: {
      type: String,
      default: ""
    },
    containerClass2: {
      type: String,
      default: ""
    },
    containerClass3: {
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
