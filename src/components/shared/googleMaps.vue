<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4">
        <GmapMap
          :center="center"
          :zoom="5"
          map-type-id="roadmap"
          class="map-item"
          @click="updateMarker"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center = m.position"
            @dragend="showLocation"
          />
        </GmapMap>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

const googleOptions = {
  load: {
    key: "AIzaSyAoKVl05vx0FFhJQaSoGYalKM9iv_QKD5g",
    libraries: "geometry,drawing,places",
    v: "3.exp"
  }
};

vue.use(VueGoogleMaps, googleOptions);

export default {
  props: ["location"],
  data() {
    return {
      center: { lat: 24.671530316321263, lng: 46.66877598313708 },
      markers: [
        {
          position: { lat: 24.671530316321263, lng: 46.66877598313708 }
        }
      ],
      position: null
    };
  },
  created() {
    if (this.location) {
      console.log(this.location);
      this.markers[0].position.lat = this.location[0];
      this.markers[0].position.lng = this.location[1];
    }
  },

  methods: {
    updateMarker(location) {
      console.log(location.latLng.lat(), location.latLng.lng());
      this.markers[0].position.lat = location.latLng.lat();
      this.markers[0].position.lng = location.latLng.lng();
      console.log("this.markers[0].position", this.markers[0].position);
      this.$emit("select_location", this.markers[0].position);
    },
    showLocation: function(location) {
      console.log(location.latLng.lat(), location.latLng.lng(), "enddrog");
      this.markers[0].position.lat = location.latLng.lat();
      this.markers[0].position.lng = location.latLng.lng();
      console.log("this.markers[0].position", this.markers[0].position);
      this.$emit("select_location", this.markers[0].position);
    }
  }
};
</script>
<style>
.ymap-container {
  height: 400px;
}
</style>
