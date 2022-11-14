<template>
  <b-card  class="dashboard-link-list">
    <two-column-list :auctions="auctions" :isOwnerDashboard="isOwnerDashboard" :sides="sides" :owners="owners"/>
  </b-card>
</template>
<script>
import TwoColumnList from "../../components/Listing/TwoColumnList";

export default {
  props: ['sides', 'owners', 'auctions', 'isOwnerDashboard'],
  components: {
    "two-column-list": TwoColumnList
  },
  data() {
    return {
      
    };
  },
  watch: {
    
  }
};
</script>
