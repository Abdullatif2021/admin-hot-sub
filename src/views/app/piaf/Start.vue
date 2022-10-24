<template>
  <div>
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
                  icon="iconsminds-clock"
                  :title="`35 ${$t('dashboards.posts')}`"
                  :detail="$t('dashboards.pending-for-publish')"
                  :percent="5*100/12"
                  progressText="35/152"
                />
              </b-colxx>
              <b-colxx lg="4" class="mb-4">
                    <gradient-with-radial-progress-card
                      icon="iconsminds-male"
                      :title="`40 ${$t('dashboards.users')}`"
                      :detail="$t('dashboards.on-approval-process')"
                      :percent="4*100/6"
                      progressText="40/766"
                    />
              </b-colxx>
              <b-colxx lg="4" class="mb-4">
                <gradient-with-radial-progress-card
                  icon="iconsminds-bell"
                  :title="`87 ${$t('dashboards.alerts')}`"
                  :detail="$t('dashboards.waiting-for-notice')"
                  :percent="8*100/10"
                  progressText="87/180"
                />
              </b-colxx>
            </b-row>
            <h4 class="mb-3">Active Auctions</h4>
            <small-line-charts itemClass="dashboard-small-chart"></small-line-charts>
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
                            <profile-statuses></profile-statuses>
                        </b-colxx>
                    </b-tab>
                </b-tabs>
            </b-card>
            <logs class="mb-4"></logs>
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
            <cakes></cakes>
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
import {mapActions} from "vuex";
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
            data: [85, 45, 20]
          }
        ]
      },
    };
  },
  methods: {
    // ...mapActions(["getItems"]),
    // click() {
    //   this.getItems();
    // }
  }
};
</script>
