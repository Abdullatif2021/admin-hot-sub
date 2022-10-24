<template>
  <b-row>
    <b-colxx xxs="12" class="mb-4">
<!--      todo:needs fixed height-->
      <!-- <vue-perfect-scrollbar
        class="scroll dashboard-list-with-thumbs"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
      <draggable ghost-class="ghost" @end="onEnd">
      <transition-group tag="small-line-chart-card" type="transition" name="flip-list">
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData1"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData2"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData3"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData4"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData1"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData2"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData3"/>
        <small-line-chart-card :class="itemClass" label-prefix="$" :data="smallChartData4"/>
      </transition-group>
    </draggable>
       
      </vue-perfect-scrollbar> -->


      <!-- <draggable v-model="myArray" ghost-class="ghost" @end="onEnd"> -->
        <vue-perfect-scrollbar
        class="scroll dashboard-list-with-thumbs "
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
      <transition-group type="transition" name="flip-list">
        <div class="sortable" :id="element.id" v-for="element in myArray" :key="element.id">
          <small-line-chart-card :name="element.name" :class="itemClass" label-prefix="$" :data="smallChartData3"/>      </div>
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
  props: ["itemClass"],
  data() {
    return {
      smallChartData1,
      smallChartData2,
      smallChartData3,
      smallChartData4,
      myArray: [
        { name: "VueJS", id: 0 },
        { name: "HTML", id: 1 },
        { name: "CSS", id: 2 },
        { name: "JavaScript", id: 3 },
        { name: "Java", id: 4 },
        { name: "Groovy", id: 5 }
      ],
    };
  },
  created(){
    setTimeout(() => {
      this.refresh();
    }, 2000)
  },
  methods: {
    onEnd(){
      console.log('end is here');
    },
    refresh(){
      setTimeout(() => {
        this.myArray = [];
      this.myArray.push(
        { name: "Code", id: 1 },
        { name: "python", id: 3 },
        { name: "C++", id: 4 },
        { name: "React", id: 0 },
        { name: "Rube", id: 2 },
        { name: "C#", id: 5 }
      )
      this.refreshAgain();
      }, 4000)
     
    },
    refreshAgain(){
      setTimeout(() => {
        this.myArray = [];
      this.myArray.push(
        { name: "Rube", id: 2 },
        { name: "React", id: 0 },
        { name: "C++", id: 4 },
        { name: "python", id: 3 },
        { name: "Code", id: 1 },
        { name: "C#", id: 5 }
      )
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
