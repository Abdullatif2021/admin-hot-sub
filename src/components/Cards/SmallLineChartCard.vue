<template>
  <b-card class="mb-3" no-body>
    <b-row style="display: flex;flex-direction: column;" no-gutters>
<!--      todo:fixing image layout-->
      <b-col class="image_card" sm="3">
        <b-card-img   src="https://picsum.photos/150/150/?image=20" alt="Image" class="list-thumbnail border-0 rounded-0 py-2"></b-card-img>
      </b-col>
      <b-col sm="9">
        <b-card-body class="p-3">
          <small-line-chart :data="data" labelPrefix="$"/>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import SmallLineChart from "../Charts/SmallLine";

export default {
  props: ["labelPrefix", "data"],
  components: {
    "small-line-chart": SmallLineChart
  },
  data() {
    return {
      labelx: "",
      labely: ""
    };
  },
  methods: {
    onChartMouseOver({labelx, labely}) {
      this.labelx = labelx;
      this.labely = labely;
    }
  }
};
</script>
