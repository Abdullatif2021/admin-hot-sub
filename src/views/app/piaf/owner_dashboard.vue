<template>
    <div> 
      <template v-if="_isLoadChart">
      <b-row>
        <b-colxx xxs="12">
          <piaf-breadcrumb :heading="$t('menu.owner-dashboard')" />
          <div class="separator mb-5"></div>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx xl="6" lg="6" class="mb-4">
            <website-visit-chart-card :areaChartData="areaChartData" :chartOptions="chartOptions"></website-visit-chart-card>
        </b-colxx>
        <b-colxx xl="3" lg="6" class="mb-4">
            <cakes :auctions="inprogressArray" :isOwnerDashboard="true"></cakes>
        </b-colxx>
        <b-colxx xl="3" lg="6" class="mb-4">
            <product-categories-doughnut :genderChartData="genderChartData"></product-categories-doughnut>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx lg="6" xxs="12" class="mb-4">
            <profile-statuses  :height="true" :data="percentagesData"></profile-statuses>
        </b-colxx>
        <b-colxx lg="6" xxs="12" class="mb-4">
            <icon-cards-carousel v-if="_isLoadOwners" :marketers="sides"></icon-cards-carousel>
        </b-colxx>
      </b-row>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
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
  import {mapActions, mapGetters} from "vuex";
  import { ThemeColors, getCurrentLanguage } from '../../../utils'
  const colors = ThemeColors()
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
            percentagesData: [],
            sides: [],
            inprogressArray: [],
            language: null,
            chartOptions: {
              legend: {
                display: false
              },
              responsive: true,
              maintainAspectRatio: false,
              tooltips:  {
                enabled: true,
                mode: 'single',
                backgroundColor: '#ffffff',
                titleFontColor: '#000',
                borderColor: '#d1d1d1',
                borderWidth: 0.5,
                bodyFontColor: '#000000',
                bodySpacing: 10,
                xPadding: 15,
                yPadding: 15,
                cornerRadius: 0.15,
                callbacks: {
                    label: function(tooltipItems, data) { 
                        return `Total bids: ${tooltipItems.yLabel}`;
                    },
                    title: function(tooltipItems, data) {
                      return `High bid: ${data.dates[tooltipItems[0].index]}`;
                    }
                }
              },
              scales: {
                yAxes: [
                  {
                    gridLines: {
                      display: true,
                      lineWidth: 1,
                      color: 'rgba(0,0,0,0.1)',
                      drawBorder: false
                    },
                    ticks: {
                      beginAtZero: true,
                      stepSize: 1,
                      min: null,
                      max: null,
                      padding: 20
                    }
                  }
                ],
                xAxes: [
                  {
                    gridLines: {
                      display: false
                    }
                  }
                ]
              }
            },
            areaChartData: {
              labels: [],
              dates: [],
              datasets: [
                {
                  label: '',
                  data: [],
                  borderColor: colors.themeColor1,
                  pointBackgroundColor: colors.foregroundColor,
                  pointBorderColor: colors.themeColor1,
                  pointHoverBackgroundColor: colors.themeColor1,
                  pointHoverBorderColor: colors.foregroundColor,
                  pointRadius: 4,
                  pointBorderWidth: 2,
                  pointHoverRadius: 8,
                  fill: true,
                  borderWidth: 2,
                  backgroundColor: colors.themeColor1_10
                },
                // {
                //   label: '',
                //   data: [70, 65, 55, 59, 69, 62, 54],
                //   borderColor: '#f7cf1f',
                //   pointBackgroundColor: colors.foregroundColor,
                //   pointBorderColor: '#f7cf1f',
                //   pointHoverBackgroundColor: '#f7cf1f',
                //   pointHoverBorderColor: colors.foregroundColor,
                //   pointRadius: 4,
                //   pointBorderWidth: 2,
                //   pointHoverRadius: 8,
                //   fill: true,
                //   borderWidth: 2,
                //   backgroundColor: colors.themeColor1_10
                // }
              ]
            },
            genderChartData: {  
              labels: ["Pending", "Ended", "Upcoming"],
              datasets: [
                {
                  label: "",
                  borderColor: [
                    colors.themeColor1,
                    colors.themeColor2,
                    colors.themeColor3
                  ],
                  backgroundColor: [
                    colors.themeColor1_10,
                    colors.themeColor2_10,
                    colors.themeColor3_10
                  ],
                  borderWidth: 2,
                  data: []
                }
              ]
            }
        }
    },
    mounted() {
     
    },
    created() {
      this.language = getCurrentLanguage();
      this.getAuctionSide();
      this.getStatistics({
        auction_id: null,
        owner_id: 2,
        start_date: null,
        end_date: null,
        date: null
      }),
        this.getAuctions({
        dir: null,
        auction_owner: 2,
        auctionType: 1,
        search: null,
        order_by: null,
        limit: null,
        page: null
      });
        this.getOwnerChart({owner_id: 2})
    },
    methods: {
      ...mapActions(['getAuctionSide', 'getStatistics', 'getOwnerChart', 'getAuctions'])
    },
    computed: {
      ...mapGetters(['_statistics', '_isLoadOwners', '_auctionSide', '_ownerChart', '_isLoadChart', 'auctions'])
    },
    watch: {
      auctions: function(val) {
            val.forEach(el => {
                this.inprogressArray.push(
                    new Object({
                    title: el.locales[this.language].title,
                    value: el.current_price,
                    })
                )
            })
      },
      _auctionSide: function(val) {
        this.sides = []
        val.forEach(el =>{
          this.sides.push( new Object({
            title: el.name.slice(0, 12)+ "...",
            // link: `${adminRoot}/auctions?markter_id=${el.id}`
          }))
        })
      },
      _statistics: function(val) {
        this.percentagesData = [];
        this.genderChartData.datasets[0]['data'].push(val.percentage_auction_active)
        this.genderChartData.datasets[0]['data'].push(val.percentage_auction_ended)
        this.genderChartData.datasets[0]['data'].push(val.percentage_auction_upcoming)
        this.percentagesData.push( new Object({
          title: this.$t('forms.pending'),
          status: val.auction_upcoming,
          total: val.total_auction
        }))
        this.percentagesData.push( new Object({
          title: this.$t('forms.active'),
          status: val.auction_active,
          total: val.total_auction 
        }))
        this.percentagesData.push( new Object({
          title: this.$t('ended'),
          status: val.auction_ended,
          total: val.total_auction
        }))
      },
      _ownerChart: function(val) {
        val.forEach(el => {
          this.areaChartData.datasets[0].data.push(el.total)
          this.areaChartData.dates.push(el.high_bids)
          const date = el.created_at.toString().split('-')
          this.areaChartData.labels.push(`${date[1]}-${date[2]}`)
        });
        console.log('eddedededeed',this.areaChartData);
        const min = Math.min(...this.areaChartData.datasets[0].data)
        const max = Math.max(...this.areaChartData.datasets[0].data)
        this.chartOptions.scales.yAxes[0].ticks.min = 0
        this.chartOptions.scales.yAxes[0].ticks.max = max
      }
    }
  };
  </script>
  