<template>
  <b-row>
    <b-colxx xxs="12" class="mb-4">
<!--      todo:needs fixed height-->
      <vue-perfect-scrollbar
        class="scroll dashboard-list-with-thumbs"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData1"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData2"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData3"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData4"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData1"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData2"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData3"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData4"/>
      </vue-perfect-scrollbar>
    </b-colxx>
  </b-row>
</template>
<script>
import SmallLineChartCard from "../../components/Cards/SmallLineChartCard";
import {
  smallChartData1,
  smallChartData2,
  smallChartData3,
  smallChartData4
} from "../../data/charts";


export default {
  components: {
    "small-line-chart-card": SmallLineChartCard
  },
  props: ["itemClass"],
  data() {
    return {
      smallChartData1,
      smallChartData2,
      smallChartData3,
      smallChartData4
    };
  }
};
</script>
