<template>
  <div>
   
     <template v-if="_isLoadAuctions">
    <b-row>
      <b-colxx xxs="12">
         <h1>{{auction_form.title}}</h1>
      <div v-if="customFiledOn" class="top-right-button-container">
        <b-button
          variant="primary"
          
          class="top-right-button"
          @click="refresh()"
          ><i style="font-size: 19px;" class="simple-icon-refresh"></i></b-button
        >
      </div>
        <piaf-breadcrumb /> 
           <div v-if="customFiledOn"  style="display: grid;position: absolute;left: 77%;" class="mb-2 mt-2">
        <b-collapse id="displayOptions" class="d-md-block">
          <div class="d-block d-md-inline-block">
            

      
          </div>
          <div class="float-md-right pt-1">
            <div class="search-sm d-inline-block float-md-left mr-1 align-top">
              <b-input
                :placeholder="$t('menu.search')"
                @input="val => searchChange(val)"
              />
            </div>
            <span class="text-muted text-small mr-1 mb-2"
              >{{ from }}-{{ to }} {{ $t("forms.of") }} {{ total }}</span
            >
            <b-dropdown
              id="ddown2"
              right
              :text="`${perPage}`"
              variant="outline-dark"
              class="d-inline-block"
              size="xs"
            >
              <b-dropdown-item
                v-for="(size, index) in pageSizes"
                :key="index"
                @click="changePageSize(size)"
                >{{ size }}</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </b-collapse>
      </div>
        <b-tabs
          nav-class="separator-tabs ml-0 mb-5"
          content-class="tab-content"
          :no-fade="true"
        >
          <b-tab @click="customFiledOn = false" :title="$t('pages.details')">
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
                    <p>{{formatStartDate}} <i style="font-size: 12px;margin: 10px;color: #a49f9f;" class="simple-icon-control-forward"></i> {{formatEndDate}}</p>
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
                  <b-card class="mb-4" no-body>
                <b-card-body>
                  <b-card-title>{{$t('forms.attach')}}</b-card-title>
                  <gallery-detail :containerClass="containerClass" :items="file_lists" />
                </b-card-body>
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
          <vuetable
            table-height="360px"
            ref="vuetable"
            :api-mode="false"
            class="order-with-arrow"
            :fields="fields"
          >
          </vuetable>
                  <!-- <template v-if="isLoad">
                    <list-page-listing
                      :displayMode="displayMode"
                      :items="auction_form.custom_fields"
                    ></list-page-listing>
                  </template>
                  <template v-else>
                    <div class="loading"></div>
                  </template> -->
                </b-card> 
              
              </b-colxx>
            </b-row>
          </b-tab>
          <b-tab @click="customFiledOn = false,  getReviewRequests({auction_id : auctionId})" :title="$t('forms.preview-requests')">
            <b-row>
              <b-colxx>
                <template v-if="_get_reviews">
                <vuetable
                  ref="previews_vuetable"
                  class="table-divided order-with-arrow"
                  :api-mode="false"
                  :fields="review_fields"
                >
                </vuetable>
                </template>
                <template v-else>
          <div class="loading"></div>
        </template>
              </b-colxx>
            </b-row>
          </b-tab>
          <b-tab @click="getAuctionBids({auction_id: auction_id})" :title="$t('forms.bids')">
            <b-row>
              <b-colxx>
                <template v-if="_isLoadAuctionBids">
                 <vuetable
          ref="bids_vuetable"
          class="table-divided order-with-arrow"
          :per-page="perPage"
          :api-mode="false"
          :fields="bids_fields"
          pagination-path
          @vuetable:pagination-data="onPaginationData"
        >
        </vuetable>
        <vuetable-pagination-bootstrap
          class="mt-4"
          ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        />
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
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
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import GalleryDetail from "../../../containers/pages/GalleryDetail";
import orders from "../../../data/orders";
import SmallLineCharts from "../../../containers/dashboards/SmallLineCharts.vue";
import WebsiteVisitsChartCard from "../../../containers/dashboards/WebsiteVisitsChartCard.vue";
import { getCurrentLanguage } from "../../../utils";
import googleMaps from "../../../components/shared/googleMaps.vue";
import { mapGetters, mapActions } from "vuex";
import ListPageListing from "../../../containers/pages/ListPageListing";
import Vuetable from "vuetable-2/src/components/Vuetable";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";

export default {
  components: {
      vuetable: Vuetable,
    stars: Stars,
    "datatable-heading": DatatableHeading,
    "gallery-detail": GalleryDetail,
      googleMaps : googleMaps,
    "radial-progress-card": RadialProgressCard,
    "comment-item": CommentItem,
    "order-item": OrderItem,
        "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "small-line-charts": SmallLineCharts,
    "website-visit-chart-card": WebsiteVisitsChartCard,
     "list-page-listing": ListPageListing,
  },
  data() {
    return {
      isLoad: false,
      search: null,
      customFiledOn: false,
      isLoadReviewRequests: false,
      limit: null,
      comments: comments.slice(0, 5),
      orders,
        pageSizes: [4, 8, 12],
      auction_id: null,
     fields: [
        {
          name: "",
          callback: value => {
            return `<img src="${value.icon}" style="border-radius: 34%;" alt="Image" width="50" height="50"> 
            `;
          },
          title: "Icon",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%"
        },
        {
          name: "name",
          title: "Name",
          titleClass: "",
          dataClass: "text-muted",
          width: "30%"
        },
        {
          name: "value",
          title: "Value",
          titleClass: "",
          dataClass: "text-muted",
          width: "30%"
        },
      ],
      bids_fields: [
        {
          name: "user_info",
          callback: value => {
            return `<img src="${value.image}" style="border-radius: 34%;" alt="Image" width="50" height="50"> 
            `;
          },
          title: "Image",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "25%"
        },
        {
          name: "user_info",
           callback: value => {
            return `${value.first_name} ${value.last_name}`;
          },
          title: "Name",
          titleClass: "",
          dataClass: "text-muted",
          width: "25%"
        },
        {
          name: "amount",
          title: "Amount",
          titleClass: "",
          dataClass: "text-muted",
          width: "25%"
        },
         {
          name: "created_at",
             callback: value => {
               return new Date(value).toString().slice(new Date(value).toString().indexOf(' '),
  new Date(value).toString().lastIndexOf(':'),)
            
          },
          title: "Date",
          titleClass: "",
          dataClass: "text-muted",
          width: "25%"
        },
      ],
      review_fields: [
        {
          name: "name",
          title: "Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "phone",
          title: "Phone Number",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "notes",
          title: "Note",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
         {
          name: "date",
             callback: value => {
               return new Date(value).toString().slice(new Date(value).toString().indexOf(' '),
  new Date(value).toString().lastIndexOf(':'),)
            
          },
          title: "Date",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
         {
          name: "status",
              callback: value => {

            return `<span class="badge badge-pill badge-${value.toLowerCase()} handle mr-1">
                ${value}
              </span>`;

          },
          title: "Status",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
      ], 
      formatStartDate: null,
      formatEndDate: null,
        isLoad: false,
        file_lists: [],
         attachments: [],
        containerClass: "gallery_custom_container",
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
        preview: [],
        end_date: null,
        start_date: null,
        latitude: null,
        longitude: null,
        minimum_paid: null,
        opening_price: null,
      },
      from: null,
      to: null,
      total: null,
      lastPage: null,
      perPage: null,
      items: null,
      auctionId: null,
    };
  },
  created() {
    this.language = getCurrentLanguage();
    this.auctionId = this.$route.query.id;
    this.getAuction({ id: this.auctionId });
   
  },
  methods: {
...mapActions(["getAuction", "getAuctionFiles", "getAuctionImages", "getAuctionBids", "getReviewRequests"]),
 onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    getStartDate(){
      this.formatStartDate = this.auction_form.start_date.toString().slice(
  this.auction_form.start_date.toString().indexOf(' '),
  this.auction_form.start_date.toString().lastIndexOf(':'),
);
return this.formatStartDate;
    },
        getEndDate(){
     this.formatEndDate = this.auction_form.end_date.toString().slice(
  this.auction_form.end_date.toString().indexOf(' '),
  this.auction_form.end_date.toString().lastIndexOf(':'),
);
return this.formatEndDate;
    },  
    refresh(){
        this.getAuctionBids({auction_id : this.auction_id})
    },
     changePageSize(perPage) {
      this.limit = perPage;
      this.getAuctionBids({
        search: this.search,
        limit: this.limit,
        page: this.page
      });
    },
     searchChange(val) {
      this.search = val;
      this.getAuctionBids({
        search: val,
        limit: null,
        page: null
      });
    },

     onChangePage(page) {
      if (page == "next" || page == "prev") {
      } else {
        this.page = page;
        this.getAuctionBids({
          search: this.search,
          limit: this.limit,
          page: this.page
        });
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
  },
   computed: {
    ...mapGetters(["auction","_get_reviews", "_auctionReviewRequests", "_isLoadAuctions", "_Image_List", "_File_List", "_bids", "_isLoadAuctions", "_isLoadAuctionBids"])
  },
  watch: {
    auction(newInfo, oldOne) {
      this.isLoad = false;
      this.isLoadAuction = true;
      newInfo.category ? this.auction_form.category = newInfo.category.locales.[this.language].name : '';
      // this.auction_form.sub_category = newInfo.sub_category.locales.[this.language].name;
      this.auction_id = newInfo.id;

      this.auction_form.title = newInfo.locales.[this.language].title;
      this.auction_form.description = newInfo.locales.[this.language].description;
      this.auction_form.terms_conditions = newInfo.locales.[this.language].terms_conditions;
      this.auction_form.brochure = newInfo.locales.[this.language].brochure;
      this.auction_form.opening_price = newInfo.opening_price;
      this.auction_form.auction_number = newInfo.auction_number;
      this.auction_form.current_price = newInfo.current_price;
      this.getAuctionImages({ id: newInfo.id })
      this.getAuctionFiles({ id: newInfo.id})
      this.auction_form.minimum_paid = newInfo.minimum_paid;
      this.auction_form.deposit = newInfo.deposit;
      this.auction_form.auction_side = newInfo.auction_side.name;
      this.auction_form.auction_owner = newInfo.auction_owner.name;
      this.auction_form.latitude = newInfo.latitude;
      this.auction_form.longitude = newInfo.longitude;
      this.auction_form.start_date = new Date(newInfo.start_date);
      this.auction_form.end_date = new Date(newInfo.end_date);
      this.getStartDate();
      this.getEndDate();
      this.auction_form.city = newInfo.city.locales.[this.language].name;
      this.auction_form.city = newInfo.city.locales.[this.language].name;
      this.auction_form.area = newInfo.area.locales.[this.language].name;
      this.auction_form.preview = newInfo.preview;
      this.auction_form.image = newInfo.image;
      this.auction_form.image = newInfo.image;
      this.auction_form.location.push(newInfo.latitude, newInfo.longitude);
      newInfo.custom_fields != [] ? newInfo.custom_fields.forEach(field => {
        this.auction_form.custom_fields.push(
             new Object({
               icon: field.icon,
               type: field.type,
              name: field.locales.[this.language].name,
              value: field.values[0].locales.[this.language].value,
              unit: field.values[0].locales.[this.language].unit,
            
             
          })
        )
      }): this.auction_form.custom_fields = null;
      this.isLoad = true;
      this.$refs.vuetable.setData(this.auction_form.custom_fields);
    },
      _Image_List: function(val) {
    
       val.forEach(el => {
        this.file_lists.push(
             new Object({
            id: el.id,
            link: el.path,
            img:  el.path
          })
        )
      })
    },
     _File_List: function(newInfo) {
      newInfo.forEach(el => {
        this.file_lists.push(
             new Object({
            id: el.id,
            link: el.path,
            img:  "/assets/img/products/file-img.png",
            original_filename: el.original_filename
          })
        )
      })

    },
    _bids: function(val){
       this.$refs.bids_vuetable.setData(val.data);
         this.perPage = val.per_page;
      this.from = val.from;
      this.to = val.to;
      this.total = val.total;
      this.$refs.pagination.setPaginationData(val);
      this.customFiledOn = true
    },
    _auctionReviewRequests: function(val){
      console.log(val);
      this.$refs.previews_vuetable.setData(val);
      this.isLoadReviewRequests = true;

    },
    _get_reviews: function(val){
      console.log(val);
    }
  }
};
</script>
