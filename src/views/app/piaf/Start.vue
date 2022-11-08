<template>
  <div >
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.start')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row>
          <b-colxx lg="8" xl="8" class="mb-4">
            <b-row>
              <b-colxx lg="4" class="mb-4">
                <gradient-with-radial-progress-card
                  svgImage="auction"
                  :filterAuction="true"
                  @filtering = "filtering" 
                  :title="isLoadActive ? `${data.auction_active} ${$t('dashboards.active')}` : `${data.auction_upcoming} ${$t('dashboards.pending')}`"
                  :detail="$t('dashboards.pending-for-publish')"
                  :percent="isLoadActive ? (data.total_auction /data.auction_active) /100 : (data.total_auction/data.auction_upcoming) / 100"
                  :progressText="isLoadActive ? `${data.auction_active} / ${data.total_auction}` : `${data.auction_upcoming} / ${data.total_auction}`"
                />
              </b-colxx>
              <b-colxx lg="4" class="mb-4">
                    <gradient-with-radial-progress-card
                      icon="iconsminds-male"
                      :title="`${data.active_users} ${$t('dashboards.users')}`"
                      :detail="$t('dashboards.on-approval-process')"
                      :percent="(data.users * 100/data.active_users)"
                      :progressText="`${data.active_users}/${data.users}`"
                    />
              </b-colxx>
              <b-colxx lg="4" class="mb-4">
                <gradient-with-radial-progress-card
                  icon="iconsminds-bell"
                  svgImage="bids"
                  :filter="true"
                  :title="`${data.bids} ${$t('dashboards.bids')}`"
                  :detail="$t('dashboards.waiting-for-notice')"
                  :percent="(data.bids * 100/data.bids)"
                  :progressText="`${data.bids}/${data.bids}`"
                  @filterFormSubmited="filterFormSubmited"
                  :auction_list= "auction_list"
                  @filtercanceled="filtercanceled"
                />
              </b-colxx>
            </b-row>
            <h4 class="mb-3">Active Auctions</h4>
            <small-line-charts :myArray="active_auctions_list" @refresh="refreshAuctions" itemClass="dashboard-small-chart"></small-line-charts>
          </b-colxx>
          <b-colxx lg="4" md="6" class="mb-4">
            <b-card class="mb-4" no-body>
                <b-tabs card no-fade>
                    <b-tab :title="$t('forms.pie-chart')" active>
                        <b-colxx sm="12">
                          <b-card class="mb-4" no-body>
                            <b-card-body>
                              <div class="chart-container">
                                <doughnut-chart :data="genderChartData" shadow />
                              </div>
                            </b-card-body>
                          </b-card>
                        </b-colxx>
                    </b-tab>
                    <b-tab :title="`${$t('forms.percentages')}`">
                        <b-colxx sm="12">
                            <profile-statuses :data="percentagesData"></profile-statuses>
                        </b-colxx>
                    </b-tab>
                </b-tabs>
            </b-card>
            <logs :logs="logs" class="mb-4"></logs>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx md="6" lg="4" class="mb-4">
            <gradient-card>
              <b-badge pill variant="theme-3" class="align-self-start mb-3">{{
                  $t("dashboards.piaf")
                }}
              </b-badge>
              <p class="lead text-white">
                {{ $t("dashboards.magic-is-in-the-details") }}
              </p>
              <p class="text-white">{{ $t("dashboards.yes-it-is-indeed") }}</p>
            </gradient-card>
          </b-colxx>
          <b-colxx md="6" lg="4" class="mb-4">
            <cakes :sides="sides" :owners="owners"></cakes>
          </b-colxx>
          <b-colxx md="6" lg="4" class="mb-4">
            <tickets></tickets>
          </b-colxx> 
          
        </b-row>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import IconCard from "../../../components/Cards/IconCard.vue";
import GradientCard from "../../../components/Cards/GradientCard";
import {mapActions, mapGetters} from "vuex";
import SmallLineCharts from "@/containers/dashboards/SmallLineCharts";
import TopRatedItems from "@/containers/dashboards/TopRatedItems";
import ProfileStatuses from "@/containers/dashboards/ProfileStatuses";
import Cakes from "@/containers/dashboards/Cakes";
import Logs from "../../../containers/dashboards/Logs";
import Tickets from "../../../containers/dashboards/Tickets";
import RecentOrders from "@/containers/dashboards/RecentOrders";
import SortableStaticticsRow from "@/containers/dashboards/SortableStaticticsRow";
import DoughnutChart from "../../../components/Charts/Doughnut";
import { ThemeColors } from "../../../utils";
import GradientWithRadialProgressCard from "../../../components/Cards/GradientWithRadialProgressCard";
import { getCurrentLanguage } from "../../../utils";
import { adminRoot } from "../../../constants/config";

const colors = ThemeColors();
export default {
  components: {
    "icon-card": IconCard,
    "small-line-charts": SmallLineCharts,
    "top-rated-items": TopRatedItems, 
    cakes: Cakes,
    logs: Logs,
    tickets: Tickets,
    "profile-statuses": ProfileStatuses,
    "gradient-card": GradientCard,
    "recent-orders": RecentOrders,
    "gradient-with-radial-progress-card": GradientWithRadialProgressCard,
    "sortable-statictics-row": SortableStaticticsRow,
    "doughnut-chart": DoughnutChart
  },
  data() {
    return {
      data: null,
      logs: [],
      isLoadActive: false,
      owners: [],
      sides: [],
      active_auctions_list: [],
      language: null,
      auction_list: [],
      percentagesData: [],
      genderChartData: {  labels: ["Pending", "Ended", "Upcoming"],
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
    };
  },
  created(){
    this.language = getCurrentLanguage();
    this.getLogs();
    this.getStatistics({
        auction_id: null,
        start_date: null,
        end_date: null,
        date: null
      }),
    this.getAuctions({
        dir: null,
        auctionType: 1,
        search: null,
        auction_owner: null,
        order_by: null,
        limit: null,
        page: null
      }),
      this.getAuctionSide();
      this.getAuctionOwner({
      order_dir: null,
      keyword: null,
      limit: null,
      page: null
    })
  },  
  methods: {
    ...mapActions(["getStatistics", "getAuctions", "getAuctionOwner", "getAuctionSide", "getLogs"]),
    refreshAuctions(){
      this.getAuctions({
        dir: null,
        auctionType: 1,
        search: null,
        auction_owner: null,
        order_by: null,
        limit: null,
        page: null
      })
    },
    filtering(){
      this.isLoadActive = !this.isLoadActive
    },
    filterFormSubmited(id, rangeDate, date){
      console.log(id, rangeDate, date);
      this.getStatistics({
        auction_id: id,
        start_date: rangeDate ? new Date(rangeDate[0]).toISOString().split('T')[0] : null,
        end_date: rangeDate ? new Date(rangeDate[1]).toISOString().split('T')[0] : null,
        date: date ? new Date(date).toISOString().split('T')[0] : null
      })
    },
    filtercanceled(){
      this.getStatistics({
        auction_id: null,
        start_date: null,
        end_date: null,
        date: null
      })
    }
  },
  computed: {
    ...mapGetters(["_statistics",
     "_isLoadData",
     "auctions",
     "_auctionOwner",
     "_auctionSide",
     "_logs",
     "_logsProssing"
    ]),

  },
  watch: {
    _auctionOwner: function(val) {
      this.owners = [];
      console.log(val);
      val.forEach(el =>{
        this.owners.push(  new Object({
          title: el.name,
          auctionNumber: el.auction_number,
          link: `${adminRoot}/auctions?owner_id=${el.id}`
        }))
      })
    },
    _logs: function (val) {
      console.log(val);
      val.forEach(el => {
        this.logs.push( new Object({
          type: el.type,
          ref_type: el.referable_type.split("\\").pop(),
          ref_id: `${adminRoot}/auctions/auction-review?id=${el.referable_id}`,
          message: `${el.created_by.first_name} ${el.created_by.last_name}`,
          title: el.data.slug,
          user_id: `${adminRoot}/users/user?id=${el.created_by.id}`,
          date: '3 weeks ago'
        }))
      })
      console.log('new logsss',this.logs)
    },
    _auctionSide: function(val) {
      this.sides = []
      val.forEach(el =>{
        this.sides.push( new Object({
          title: el.name,
          link: `${adminRoot}/auctions?markter_id=${el.id}`
        }))
        console.log(el.name.length);
      })
    },
    _statistics: function(val){
        this.percentagesData = [];
        this.data = val;
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
    auctions: function(val) {
        this.auction_list = []
        if (val) {
          val.forEach(el => {
            this.auction_list.push(
              new Object({
                text:el.locales[this.language].title,
                value: el.id
              })
            )
          });
          this.active_auctions_list = [];
          val.forEach(el => {
            this.active_auctions_list.push(
              new Object({
                data:el,
                name:el.locales[this.language].title,
                link: `${adminRoot}/auctions/auction-review?id=${el.id}`
              })
            )
          });
        }
       
    }
    },
  
};
</script>
