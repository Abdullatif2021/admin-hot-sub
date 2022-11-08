<template>
  <div class="icon-cards-row perCard" style="background-color: white;">
    <glide-component :settings="glideIconsOption">
      <icon-card 
        :title="$t('dashboards.pending-orders') + ' 01'" 
        img="/assets/img/cards/def.png" 
        :value="14"

        :desc="'I have Django and Vue project and I need to add permissions in the Vue router based on user role.'"
       />
      <icon-card
        :title="$t('dashboards.completed-orders') + ' 02'"
        img="/assets/img/cards/def.png"
        :value="32"
        :desc="'I have Django and Vue project and I need to add permissions in the Vue router based on user role.'"
      />
      <icon-card
        :title="$t('dashboards.refund-requests') + ' 03'"
        img="/assets/img/cards/def.png"
        :value="74"
        :desc="'I have Django and Vue project and I need to add permissions in the Vue router based on user role.'"
      />
      <icon-card :title="$t('dashboards.new-comments')" icon="iconsminds-mail-read" :value="25" />
    </glide-component>
  </div>
</template>
<script>
import GlideComponent from "../../components/Carousel/GlideComponent";
import IconCard from "../../components/Cards/IconCard";

export default {
  components: {
    "glide-component": GlideComponent,
    "icon-card": IconCard
  },
  data() {
    return {
      glideIconsOption: {
        gap: 5,
        perView: 4,
        type: "carousel",
        breakpoints: {
          320: {
            perView: 1
          },
          576: {
            perView: 2
          },
          1600: {
            perView: 3
          },
          1800: {
            perView: 4
          }
        },
        hideNav: true
      }
    };
  }
};
</script>

<style scoped>
.perCard{
  background-color: white;
  box-shadow: 0 1px 15px rgb(0 0 0 / 4%), 0 1px 6px rgb(0 0 0 / 4%);
  margin-top: 0px;
}
</style>
