<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card :title="$t('maps.yandex')" class="mb-4">
        <yandex-map
          :coords="coords"
          @click="onClick"
          zoom="5"
          class="map-item"
          map-type="map"
        >
          <ymap-marker
            marker-id="123"
            :coords="coords"
            :balloon-template="balloonTemplate"
          ></ymap-marker>
        </yandex-map>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import vue from "vue";
import ymapPlugin from "vue-yandex-maps";

const yandexOptions = {
  apiKey: "", // '' by default
  lang: "en-US", // 'ru_RU' by default
  version: "2.1" // '2.1' by default
};

vue.use(ymapPlugin, yandexOptions);

export default {
  props: ["coords"],
  data() {
    return {
      // coords: [30.434447148758963, 37.061051995669274],
      center: { lat: -34.397, lng: 150.644 },
      markers: [
        {
          position: { lat: 29.407588309367938, lng: 36.93800431600657 }
        }
      ]
    };
  },
  created() {
    console.log(this.coords);
  },
  computed: {
    balloonTemplate() {
      return `
        <p>I am here: ${this.coords}</p>
      `;
    }
  },
  methods: {
    onClick(e) {
      this.coords = e.get("coords");
      console.log(this.coords);
      this.$emit("select_location", this.coords);
    }
  }
};
</script>
<style>
.ymap-container {
  height: 400px;
}
</style>
