<template>
  <div class="icon-row-item">
    <b-card :class="className">
      <p class="card-text font-weight-semibold mb-0">{{ title }}</p>
      <img :src="img" class="image"/>
      <p class="persan">{{ value }}%</p>
      <p class="desc">{{desc}}</p>
    </b-card>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, default: 'icon-card-title' },
    img: { type: String, default: 'iconsminds-clock' },
    className: { type: String, default: 'card' },
    desc: { type: String, default: 'iconsminds-clock' }, 
    value: { type: Number, default: 0 }
  }
}
</script>
<style scoped>
.card{
  margin-left: 11px;
    height: 345px;
  background-color: unset;
  box-shadow: unset;
}
.card_3{
  margin-left: 0px;
  height: 321px;
  background-color: unset;
  box-shadow: unset;
}
.desc{
    text-align: left;
    font-size: 11px;
    height: 42px;
    margin-top: 7px;
    color: #8f8f8f !important;
}
.image{
  margin-bottom: 20px;
  height: 130px;
  width: 130px;
  border-radius: 10%;
}
.persan{
    color: #0522ff !important;
    text-align: inherit;
    font-size: 40px;
    font-weight: 500;
}
</style>