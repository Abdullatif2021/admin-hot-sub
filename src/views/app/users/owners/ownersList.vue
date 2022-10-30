<template> 
    <div>
    <datatable-heading
        :title="$t(`menu.owners`)"
        :changePageSize="changePageSize"
        :searchChange="searchChange"
        :add_new_button="true"
        :add_new_title="$t('todo.add-new')"
        :from="from"
        @add_new="add_New"
        :to="to"
        :total="total"
        :perPage="perPage"
    ></datatable-heading>
    <b-row>
        <b-colxx xxs="12">
            <template v-if="_isLoadOwners">
                <vuetable
                    ref="vuetable"
                    class="table-divided order-with-arrow"
                    :api-mode="false"
                    :data-total="dataCount"
                    :per-page="perPage"
                    :data-manager="dataManager"
                    :reactive-api-url="true"
                    :fields="fields"
                    pagination-path
                    @vuetable:pagination-data="onPaginationData"
                >
                    <template slot="actions" slot-scope="props">
                        <b-button
                            variant="outline-theme-3"
                            id="edit"
                            class="icon-button-auction"
                            @click="modify(props.rowData.id)">
                            <i class="simple-icon-arrow-right"></i>
                        </b-button>
                    </template>
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
    </div>
</template>


<script>
import { mapActions, mapGetters} from 'vuex';
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../../containers/datatable/DatatableHeading.vue";
import { getCurrentLanguage } from "../../../../utils";
import { adminRoot } from "../../../../constants/config";

export default {
    components: {
        vuetable: Vuetable,
        "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
        "datatable-heading": DatatableHeading
    },
    data() {
        return {
            fields: [
                {
                name: "logo",
                callback: value => {
                    return `<img src="${value}" style="border-radius: 34%;" alt="Image" width="50" height="50">`;
                },
                title: "Image",
                titleClass: "",
                dataClass: "list-item-heading",
                width: "20%"
                },
                {
                name: "name",
                sortField: "name",
                title: "Name",
                direction: "asc",
                titleClass: "",
                dataClass: "list-item-heading",
                width: "20%"
                },
                {
                name: "email",
                title: "Email",
                titleClass: "",
                dataClass: "text-muted",
                width: "20%"
                },
                {
                name: "phone_number",
                title: "Phone Number",
                titleClass: "",
                dataClass: "text-muted",
                width: "20%"
                },
                {
                name: "auction_number",
                title: "Number of auctions",
                titleClass: "",
                dataClass: "text-muted",
                width: "20%"
                },
                {
                name: "__slot:actions",
                title: "",
                titleClass: "center aligned text-right",
                dataClass: "center aligned text-right",
                width: "10%"
                }
            ],
            language: null,
            limit: null,
            search: null,
            dir: null,
            order_by: null,
            type: null,
            reload: true,
            perPage: 8,
            from: 0,
            to: 0,
            total: 0,
            dataCount: 0,
            lastPage: 0,
        }
    },
    created(){
        this.getAuctionOwner({
            order_dir: null,
            keyword: null,
            limit: null,
            page: null
        })
        this.language = getCurrentLanguage();
    },
    methods: {
        ...mapActions(["getAuctionOwner"]),
        modify(id) {
            this.$router.push({
                path: `${adminRoot}/owners/owner`,
                query: { id: id }
            });
        },
        add_New() {
            this.$router.push({
                path: `${adminRoot}/owners/owner`
             });
        },
        onPaginationData(paginationData) {
        this.from = paginationData.from;
        this.to = paginationData.to;
        this.total = paginationData.total;
        this.lastPage = paginationData.last_page;
        this.items = paginationData.data;
        this.$refs.pagination.setPaginationData(paginationData);
        },
        dataManager(sortOrder, pagination) {
        if (sortOrder.length > 0) {
            if (sortOrder[0].direction == "asc") {
            this.order_by = sortOrder[0].sortField;
            this.dir = "ASC";
            this.getAuctionOwner({
                sorting: true,
                dir: this.dir,
                search: this.search,
                order_by: this.order_by,
                limit: this.limit,
                page: this.page
            });
            }
            if (sortOrder[0].direction == "desc") {
            this.order_by = sortOrder[0].sortField;
            this.dir = "DESC";
            this.getAuctionOwner({
                sorting: true,
                dir: this.dir,
                search: this.search,
                order_by: this.order_by,
                limit: this.limit,
                page: this.page
            });
            }
        }
        },

        onChangePage(page) {
            if (page == "next" || page == "prev") {

            } else {
                this.page = page;
                this.getAuctionOwner({
                dir: this.dir,
                search: this.search,
                order_by: this.order_by,
                limit: this.limit,
                page: this.page
                });
            }
        },
        changePageSize(perPage) {
            this.limit = perPage;
            this.getAuctionOwner({
                dir: this.dir,
                search: this.search,
                order_by: this.order_by,
                limit: this.limit,
                page: this.page
            });
        },
        searchChange(val) {
            this.search = val;
            this.getAuctionOwner({
                dir: this.dir,
                search: val,
                order_by: this.order_by,
                limit: this.limit,
                page: this.page
            });
        },
    },
    computed: {
        ...mapGetters(["_auctionOwner", "_ownerPaginations", "_isLoadOwners"])
    },
    watch: {
        _auctionOwner: function(val) {
            this.$refs.vuetable.setData(val);
        },
        _ownerPaginations: function(val) {
            console.log(val);
            this.perPage = val.per_page;
            this.from = val.from;
            this.to = val.to;
            this.total = val.total;
            this.$refs.pagination.setPaginationData(val);
        }
    }
}
</script>