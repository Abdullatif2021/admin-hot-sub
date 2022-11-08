<template>
  <b-card  class="dashboard-link-list">
    <two-column-list :isOwnerDashboard="isOwnerDashboard" :sides="sides" :owners="owners"/>
  </b-card>
</template>
<script>
import TwoColumnList from "../../components/Listing/TwoColumnList";

export default {
  props: ['sides', 'owners', 'isOwnerDashboard'],
  components: {
    "two-column-list": TwoColumnList
  },
  data() {
    return {
      
    };
  }
};
</script>
