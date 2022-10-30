<template>
    <div>
        <b-card class="progress-banner" no-body>
            <b-card-header v-if="filter" class="p-0 position-relative" >
                <div @click="open_modal" class="position-absolute handle card-icon">
                    <i style="font-size: 20px;color: #eee;" :class="showFilter ? 'simple-icon-close' : 'iconsminds-filter-2'" />
                </div>
            </b-card-header>
            <b-card-header v-if="filterAuction" class="p-0 position-relative" >
                <div  @click="$emit('filtering')" class="position-absolute handle card-icon">
                    <i style="font-size: 20px;color: #eee;" class="iconsminds-repeat" />
                </div>
            </b-card-header>

            <b-card-body class="justify-content-between d-flex flex-row align-items-center">
                <div>
                    <img v-if="svgImage" :src="`/assets/img/landing-page/${svgImage}.svg`"   alt="Image" />
                    <i v-else :class="`${icon} mr-2 text-white align-text-bottom d-inline-block`" />
                    <div>
                        <p class="lead text-white">{{ title }}</p>
                        <!-- <p class="text-small text-white">{{ detail }}</p> -->
                    </div>
                </div>
                <div class="progress-bar-circle progress-bar-banner position-relative">
                    <radial-progress-bar :diameter="diameter" :strokeWidth="strokeWidth" :completed-steps="percent" :total-steps=100>{{progressText}}</radial-progress-bar>
                </div>
            </b-card-body>
        </b-card>
        <b-modal
            @hide="doSometing"
            id="status_filter"
            ref="status_filter"
            :title="$t('forms.filter')"
            modal-class="modal-right"
            :hide-backdrop="true"
            :no-close-on-backdrop="false"
        >
        <form class="av-tooltip tooltip-label-right">
            <b-form-group :label="$t('forms.auction')">
                <b-form-select
                    v-model="auctionId"
                    :options="auction_list"
                    @change="get_bids_by_auction()"
                    plain
                />
            </b-form-group>
            <b-form-group :label="$t('forms.range-date')">   
                <div id="app">
                    <datepicker :popupStyle="{ top: '0px' }" range v-model="value">
                        <template v-slot:content="slotProps">
                            <calendar-range
                            :value="slotProps.value"
                            @select="slotProps.emit"
                            ></calendar-range>
                        </template>
                    </datepicker>
                </div>
            </b-form-group>
            <b-form-group :label="$t('forms.date')">
                <datepicker
                    style="width: 100%;"
                    type="datetime"
                    value-type="YYYY-MM-DD HH:mm:ss"
                    v-model="dateSelected"
                ></datepicker>
            </b-form-group>
        </form>
        <template slot="modal-footer">
            <b-button  variant="outline-secondary" @click="hideModal('status_filter')">{{ $t("survey.cancel") }}</b-button>
            <b-button variant="primary" :disabled="enable" @click="formSubmit()" class="mr-1">{{ $t("survey.submit") }}</b-button>
        </template>
        </b-modal>
    </div>
  
    
</template>

<script>
import RadialProgressBar from 'vue-radial-progress';
import DatePicker from "vue2-datepicker";
import calender_range from '../shared/calender_range.vue'
import { mapGetters, mapActions} from "vuex";
export default {
    components: {
        datepicker: DatePicker,
        'calendar-range': calender_range,
        'radial-progress-bar': RadialProgressBar
    },
    props: ['icon', 'svgImage', 'title', 'filter', 'auction_list', 'filterAuction', 'detail', 'percent', 'progressText', 'is_load'],
    data() {
        return {
            diameterDefault: 105,
            strokeWidthDefault: 5,
            diameter: this.diameterDefault,
            strokeWidth: this.strokeWidthDefault,
            showFilter: false,
            enable: false,
            value: null,
            AuctionOptions: [],
            auctionId: null,
            dateSelected: null,
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleWindowResize)
        this.handleWindowResize()
    },
    created(){
        
    },
    methods: {
        ...mapActions(['getAuctions']),
        handleWindowResize(event) {
            if (event && !event.isTrusted) {
                return
            }
            const windowWidth = window.innerWidth
            if (windowWidth <= 1200) {
                this.diameter = 84
                this.strokeWidth = 2
            } else {
                this.diameter = this.diameterDefault
                this.strokeWidth = this.strokeWidthDefault
            }
        },
        get_bids_by_auction(val){
            console.log(val);
        },
        open_modal(){
            this.showFilter = true;
            this.$refs['status_filter'].show();
        },
        hideModal(refname) {
            this.showFilter = false;
            this.$refs[refname].hide();
            this.$emit('filtercanceled')
            this.auctionId = null;
            this.value = null;
            this.dateSelected = null;
        },
        rangeSelected(val){
            console.log(val);
        },
        doSometing(){
            console.log('doSometing');
            this.showFilter = false;
        },
        formSubmit(){
            this.$emit('filterFormSubmited', this.auctionId, this.value, this.dateSelected)
        }
       

    },
    computed: {
        ...mapGetters(["auctions",])
    },
    watch: {
        value: function(val) {
            console.log(val);
            val.forEach(el => {
                console.log(el.getDate());
            });
        },
       
    }
}
</script>
<style scoped>
.simple-icon-shuffle{
    
}
</style>
