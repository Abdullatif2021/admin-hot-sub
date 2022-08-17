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
            <sortable-statictics-row></sortable-statictics-row>
            <h4 class="mb-3">Active Auctions</h4>
            <small-line-charts
              itemClass="dashboard-small-chart"
            ></small-line-charts>
<!--            <top-rated-items></top-rated-items>-->
          </b-colxx>
          <b-colxx lg="4" md="6" class="mb-4">
            <logs class="mb-4"></logs>
            <tickets></tickets>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx sm="12" lg="4" class="mb-4">
            <profile-statuses></profile-statuses>
          </b-colxx>
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
    "sortable-statictics-row": SortableStaticticsRow,
  },
  data() {
    return {};
  },
  methods: {
    // ...mapActions(["getItems"]),
    // click() {
    //   this.getItems();
    // }
  }
};
</script>
