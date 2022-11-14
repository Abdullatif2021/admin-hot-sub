<template>
  <b-card class="h-100" :title="$t('forms.percent-auctions')">
    <div class="dashboard-donut-chart">
      <doughnut-chart :data="genderChartData" shadow />
    </div>
  </b-card>
</template>
<script>
import DoughnutChart from "../../components/Charts/Doughnut";

export default {
  props: ['genderChartData'],
  components: {
    "doughnut-chart": DoughnutChart
  },
  data() {
    return {
    };
  }
};
</script>
