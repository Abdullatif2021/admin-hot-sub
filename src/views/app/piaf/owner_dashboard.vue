<template>
    <div>
      <b-row>
        <b-colxx xxs="12">
          <piaf-breadcrumb :heading="$t('menu.owner-dashboard')" />
          <div class="separator mb-5"></div>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx xl="6" lg="6" class="mb-4">
            <website-visit-chart-card></website-visit-chart-card>
        </b-colxx>
        <b-colxx xl="3" lg="6" class="mb-4">
            <cakes :isOwnerDashboard="true" :sides="sides" :owners="owners"></cakes>
        </b-colxx>
        <b-colxx xl="3" lg="6" class="mb-4">
            <product-categories-doughnut></product-categories-doughnut>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx lg="6" xxs="12" class="mb-4">
            <profile-statuses :height="true" :data="percentagesData"></profile-statuses>
        </b-colxx>
        <b-colxx lg="6" xxs="12" class="mb-4">
            <icon-cards-carousel></icon-cards-carousel>
        </b-colxx>
      </b-row>
    </div>
  </template>
  
  <script>
  import ConversionRatesChartCard from "../../../containers/dashboards/ConversionRatesChartCard";
  import OrderStockRadarChart from "../../../containers/dashboards/OrderStockRadarChart";
  import ProductCategoriesDoughnut from "../../../containers/dashboards/ProductCategoriesDoughnut";
  import ProductCategoriesPolarArea from "../../../containers/dashboards/ProductCategoriesPolarArea";
  import ProfileStatuses from "../../../containers/dashboards/ProfileStatuses";
  import SalesChartCard from "../../../containers/dashboards/SalesChartCard";
  import SmallLineCharts from "../../../containers/dashboards/SmallLineCharts";
  import SortableStaticticsRow from "../../../containers/dashboards/SortableStaticticsRow";
  import WebsiteVisitsChartCard from "../../../containers/dashboards/WebsiteVisitsChartCard";
  import Cakes from "@/containers/dashboards/Cakes";
  import IconCardsCarousel from "../../../containers/dashboards/IconCardsCarousel";

  export default {
    components: {
      "converconversion-rates-chart-card": ConversionRatesChartCard,
      "order-stock-radar-chart": OrderStockRadarChart,
      "product-categories-doughnut": ProductCategoriesDoughnut,
      "product-categories-polar-area": ProductCategoriesPolarArea,
      "profile-statuses": ProfileStatuses,
      "sales-chart-card": SalesChartCard,
      "icon-cards-carousel": IconCardsCarousel,
      "small-line-charts": SmallLineCharts,
      cakes: Cakes,

      "sortable-statictics-row": SortableStaticticsRow,
      "website-visit-chart-card": WebsiteVisitsChartCard
    },
    data(){
        return {
            percentagesData: []
        }
    },
    created() {
        for (let index = 0; index < 4; index++) {
            this.percentagesData.push( new Object({
                title: this.$t('ended'),
                status: 23,
                total: 66
            }))  
        }
    }
  };
  </script>
  