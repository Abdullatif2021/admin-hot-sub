<template>
  <b-row>
    <b-colxx xxs="12" class="mb-4">
        <vue-perfect-scrollbar
        class="scroll dashboard-list-with-thumbs "
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
      <transition-group type="transition" name="flip-list">
        <div class="sortable" :id="element.data.id" v-for="element in myArray" :key="element.data.id">
          <router-link :to="element.link">
            <small-line-chart-card :name="element.name" :class="itemClass" label-prefix="$" :data="smallChartData3"/>  
          </router-link>
        </div>
      </transition-group>
    </vue-perfect-scrollbar> 
    <!-- </draggable> -->

    </b-colxx>
  </b-row>
</template>
<script>
import SmallLineChartCard from "../../components/Cards/SmallLineChartCard";
import draggable from "vuedraggable";
import {
  smallChartData1,
  smallChartData2,
  smallChartData3,
  smallChartData4
} from "../../data/charts";


export default {
  components: {
    "small-line-chart-card": SmallLineChartCard,
    draggable
  },
  props: ["itemClass", "myArray"],
  data() {
    return {
      smallChartData1,
      smallChartData2,
      smallChartData3,
      smallChartData4,

    };
  },
  created(){
    setTimeout(() => {
      this.refresh();
    }, 4000)
  },
  methods: {
    onEnd(){
      console.log('end is here');
    },
    refresh(){
      setTimeout(() => {
        this.$emit('refresh')
        this.refreshAgain();
      }, 4000)
     
    },
    refreshAgain(){
      setTimeout(() => {
        this.$emit('refresh')
        this.refresh();
      }, 4000)
    }
  }
};
</script>


<style scoped>
strong {
  display: inline-block;
}
.sortable {
  width: 100%;
  background: white;
  padding: 1em;
  margin-bottom: 2px;
}
.sortable span {
  float: right;
}
.flip-list-move {
  transition: transform 2s;
}
.ghost {
  border-left: 5px solid rgb(134, 206, 156);
  box-shadow: 10px 10px 5px -1px rgba(0, 0, 0, 0.14);
  opacity: 0.7;
}
</style>
