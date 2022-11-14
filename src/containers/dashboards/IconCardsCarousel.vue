<template>
  <div class="icon-cards-row perCard" style="background-color: white;">
    <glide-component :settings="glideIconsOption">
      <div v-for="(mark, index) in marketers" :key="index">
        <icon-card 
        :title="mark.title + ' 01'" 
        img="/assets/img/cards/def.png" 
        :value="14"
        :desc="'I have Django and Vue project and I need to add permissions in the Vue router based on user role.'"
       />
      </div>
      
      <!-- <icon-card
        :title="$t('dashboards.completed-orders') + ' 02'"
        img="/assets/img/cards/def.png"
        :value="32"
        :desc="'I have Django and Vue project and I need to add permissions in the Vue router based on user role.'"
      />
      <icon-card
        :title="$t('dashboards.refund-requests') + ' 03'"
        img="/assets/img/cards/def.png"
        :value="74"
        :class="'card_3'"
        :desc="'I have Django and Vue project and I need to add permissions in the Vue router based on user role.'"
      /> -->
    </glide-component>
  </div>
</template>
<script>
import GlideComponent from "../../components/Carousel/GlideComponent";
import IconCard from "../../components/Cards/IconCard";

export default {
  props: ['marketers'],
  components: {
    "glide-component": GlideComponent,
    "icon-card": IconCard
  },
  data() {
    return {
      glideIconsOption: {
        gap: 1,
        perView: 1,
        type: "carousel",
        breakpoints: {
          320: {
            perView: 1
          },
          
        },
        hideNav: true
      }
    };
  },
  created(){  console.log("Created", this.marketers) },
  watch: {
    marketers: function(val) {
      console.log('marketers', val)
    }
  }
};
</script>

<style scoped>
.perCard{
  background-color: white;
  box-shadow: 0 1px 15px rgb(0 0 0 / 4%), 0 1px 6px rgb(0 0 0 / 4%);
  margin-top: 0px;
  border-radius: 14px;
}
</style>
