<template>
  <b-card :class="height ? 'preCard' : ''">
    <div class="title">
                <h4>Marketrs</h4>
            </div>
    <div v-for="(s,index) in data" :key="index" class="mb-4">
      <p class="mb-2">
        {{ s.title }}
        <span class="float-right text-muted">{{s.status}}/{{s.total}}</span>
      </p>
      <b-progress :value="(s.status / s.total) * 100"></b-progress>
    </div>
  </b-card>
</template>
<script>
import profileStatuses from "../../data/profileStatuses";

export default {
  props: ['data' , 'height'],
  data() {
    return {
      profileStatuses
    };
  }
};
</script>

<style scoped>
.title {
    margin-bottom: 23px;
    font-weight: 900;
}
.preCard {
    height: 353px;
}
</style>
