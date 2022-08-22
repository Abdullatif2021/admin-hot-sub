<template>
  <div>
     <template v-if="_isLoadAuctions">
    <b-row>
      <b-colxx xxs="12">
        <h1>Chocolate Cake</h1>
        <!-- <div class="top-right-button-container">
          <b-dropdown
            id="ddown5"
            :text="$t('pages.actions')"
            size="lg"
            variant="outline-primary"
            class="top-right-button top-right-button-single"
            no-fade="true"
          >
            <b-dropdown-item>{{ $t("dashboards.last-week") }}</b-dropdown-item>
            <b-dropdown-item>{{ $t("dashboards.this-month") }}</b-dropdown-item>
          </b-dropdown>
        </div> -->
        <piaf-breadcrumb />
        <b-tabs
          nav-class="separator-tabs ml-0 mb-5"
          content-class="tab-content"
          :no-fade="true"
        >
          <b-tab :title="$t('pages.details')">
            <b-row>
              <b-colxx xxs="12" lg="4" class="mb-4">
                <b-card class="mb-4" no-body>
                
                  <img
                    :src="auction_form.image"
                    alt="Detail"
                    class="card-img-top"
                  />
                  <b-card-body>
                    <p class="text-muted text-small mb-2">
                      {{ $t("pages.description") }}
                    </p>
                    <p class="mb-3">
                        {{auction_form.description ? auction_form.description : ' ... '}}
                    </p>
                    <p class="text-muted text-small mb-2">
                      {{ $t("pages.rating") }}
                    </p>
                    <div class="mb-3">
                      <stars value="4" :disabled="true"></stars>
                    </div>
                   
                  <p class="text-muted text-small mb-2">
                      {{ $t("forms.auction_owner") }}
                    </p>
                    <p class="mb-3">{{auction_form.auction_owner}}</p>
                    <p class="text-muted text-small mb-2">
                      {{ $t("forms.auction_side") }}
                    </p>
                    <p class="mb-3">{{auction_form.auction_side}}</p>
                    <p class="text-muted text-small mb-2">
                      {{ $t("forms.category") }}
                    </p>
                    <p class="mb-3">{{auction_form.category}} , {{auction_form.sub_category}}</p>
                    <p class="text-muted text-small mb-2">
                      {{ $t("forms.duration") }}
                    </p>
                    <p>{{auction_form.start_date}} <i style="font-size: 12px;margin: 10px;color: #a49f9f;" class="simple-icon-control-forward"></i> {{auction_form.end_date}}</p>
                  </b-card-body>
                </b-card>
                 <b-card class="mb-4" :title="$t('forms.location')">
                    <b-card-body>
                      <p class="text-muted text-small mb-2">
                        {{ $t("forms.location") }}
                      </p>
                    <p class="mb-3">{{auction_form.city}} , {{auction_form.area}}</p>
                    </b-card-body>
                    <googleMaps id="maps" :location="auction_form.location" />
                  </b-card>
              
              </b-colxx>
              <b-colxx xxs="12" lg="8">
                <small-line-charts
                  itemClass="dashboard-small-chart"
                  v-if="isLoad"
                ></small-line-charts>
                  <b-card class="mb-4" :title="$t('forms.binig-info')">
                        <b-card-body>
                          
                    <div class="biding_container">
                      <div>
                         <p class="text-muted text-small mb-2">
                      {{ $t("forms.opening_price") }}
                    </p>
                    <p class="mb-3">{{auction_form.opening_price}}</p>

                        <p class="text-muted text-small mb-2">{{ $t("forms.current_price") }}</p>
                        <p class="mb-3">{{auction_form.current_price}}</p>
                      </div>
                      <div>
                        <p class="text-muted text-small mb-2">{{ $t("forms.deposit") }}</p>
                        <p class="mb-3">{{auction_form.deposit}}</p>

                        <p class="text-muted text-small mb-2">{{ $t("forms.minimum_price") }}</p>
                        <p class="mb-3">{{auction_form.minimum_paid}}</p>
                      </div>
                    </div>
                    </b-card-body>
                </b-card> 
                <b-card class="mb-4" :title="$t('forms.custom_field')">
                  <template v-if="isLoad">
                    <list-page-listing
                      :displayMode="displayMode"
                      :items="auction_form.custom_fields"
                    ></list-page-listing>
                  </template>
                  <template v-else>
                    <div class="loading"></div>
                  </template>
                </b-card> 
              
              </b-colxx>
            </b-row>
          </b-tab>
          <b-tab :title="$t('forms.preview-requests')">
            <b-row>
              <b-colxx>
                <order-item
                  v-for="(order, index) in orders"
                  :key="index"
                  :data="order"
                  detail-path="#"
                />
              </b-colxx>
            </b-row>
          </b-tab>
        </b-tabs>
      </b-colxx>
    </b-row>
    </template>
    <template v-else>
        <div class="loading"></div>
    </template>
  </div>
</template>

<script>    
import Stars from "../../../components/Common/Stars.vue";
import RadialProgressCard from "../../../components/Cards/RadialProgressCard.vue";
import CommentItem from "../../../components/Listing/CommentItem.vue";
import OrderItem from "../../../components/Listing/OrderItem.vue";
import { comments } from "../../../data/comments";
import orders from "../../../data/orders";
import SmallLineCharts from "../../../containers/dashboards/SmallLineCharts.vue";
import WebsiteVisitsChartCard from "../../../containers/dashboards/WebsiteVisitsChartCard.vue";
import { getCurrentLanguage } from "../../../utils";
import googleMaps from "../../../components/shared/googleMaps.vue";
import { mapGetters, mapActions } from "vuex";
import ListPageListing from "../../../containers/pages/ListPageListing";

export default {
  components: {
    stars: Stars,
      googleMaps : googleMaps,
    "radial-progress-card": RadialProgressCard,
    "comment-item": CommentItem,
    "order-item": OrderItem,
    "small-line-charts": SmallLineCharts,
    "website-visit-chart-card": WebsiteVisitsChartCard,
     "list-page-listing": ListPageListing,
  },
  data() {
    return {
      isLoad: false,
      comments: comments.slice(0, 5),
      orders,
        isLoad: false,
      displayMode: "list",
      items: [],
      auction_form: {
        image: null,
        auction_number: null,
        title: null,
        description: null,
        terms_conditions: null,
        brochure: null,
        location: [],
        auction_owner: null,
        category: null,
        isLoad :false,
        sub_category: null,
        city: null,
        area: null,
        bids_count: null,
        current_price: null,
        custom_fields: [],
        deposit: null,
        end_date: null,
        start_date: null,
        latitude: null,
        longitude: null,
        minimum_paid: null,
        opening_price: null,
        
      },
      auctionId: null,
    };
  },
  created() {
    this.language = getCurrentLanguage();
    this.auctionId = this.$route.query.id;
    this.getAuction({ id: this.auctionId });

  },
  methods: {
...mapActions(["getAuction"])

  },
  mounted() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
  },
   computed: {
    ...mapGetters(["auction", "_isLoadAuctions"])
  },
  watch: {
    auction(newInfo, oldOne) {
      this.isLoad = false;
      this.isLoadAuction = true;
      newInfo.category ? this.auction_form.category = newInfo.category.locales.[this.language].name : '';
      // this.auction_form.sub_category = newInfo.sub_category.locales.[this.language].name;

      this.auction_form.title = newInfo.locales.[this.language].title;
      this.auction_form.description = newInfo.locales.[this.language].description;
      this.auction_form.terms_conditions = newInfo.locales.[this.language].terms_conditions;
      this.auction_form.brochure = newInfo.locales.[this.language].brochure;
      this.auction_form.opening_price = newInfo.opening_price;
      this.auction_form.auction_number = newInfo.auction_number;
      this.auction_form.current_price = newInfo.current_price;
     
      this.auction_form.minimum_paid = newInfo.minimum_paid;
      this.auction_form.deposit = newInfo.deposit;
      this.auction_form.auction_side = newInfo.auction_side.name;
      this.auction_form.auction_owner = newInfo.auction_owner.name;
      this.auction_form.latitude = newInfo.latitude;
      this.auction_form.longitude = newInfo.longitude;
      this.auction_form.start_date = newInfo.start_date;
      this.auction_form.end_date = newInfo.end_date;
      this.auction_form.city = newInfo.city.locales.[this.language].name;
      this.auction_form.city = newInfo.city.locales.[this.language].name;
      this.auction_form.area = newInfo.area.locales.[this.language].name;
      this.auction_form.image = newInfo.image;
      this.auction_form.image = newInfo.image;
      this.auction_form.location.push(newInfo.latitude, newInfo.longitude);
      console.log('this.auction_form.location',this.auction_form.location);
      newInfo.custom_fields != [] ? newInfo.custom_fields.forEach(field => {
        this.auction_form.custom_fields.push(
             new Object({
              name: field.locales.[this.language].name,
              value: field.values[0].locales.[this.language].value,
              unit: field.values[0].locales.[this.language].unit,
              type: field.type,
              icon: field.icon
          })
        )
      }): this.auction_form.custom_fields = null;
       this.isLoad = true;
       console.log(this.auction_form.custom_fields)
    },
  }
};
</script>
