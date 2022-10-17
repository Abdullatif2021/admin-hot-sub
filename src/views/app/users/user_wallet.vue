<template>
  <div>
   
    <b-row>
      <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('forms.wallet')">
                        <b-card-body>

                    <div class="wallet_container">
                      <div class="wallet_el">
                        <!-- <p class="text-muted text-small mb-2">{{ $t('forms.total_balance') }}</p> -->
                    <img src="/assets/img/landing-page/account.svg" style="margin: 6px;"  alt="Image" width="30" height="30" />
                    <p class="mb-3 wallet_value">{{ wallet.total_balance }}</p>

                        
                      </div>
                      <div class="wallet_el">
                        <!-- <p class="text-muted text-small mb-2">{{ $t('forms.balance') }}</p> -->
                        <img src="/assets/img/landing-page/depos.svg"  alt="Image" width="36" height="36" />
                        <p class="mb-3 wallet_value">{{ wallet.balance }}</p>

                        
                      </div>
                    </div>
                    </b-card-body>
      </b-card>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t(`forms.transactions`)">
        <div class="filter_container">
          <b-button
              variant="outline-theme-3"
              id="edit"
              class="icon-button-auction"
              @click="open_filter()">
              <i  class="simple-icon-menu"></i>
            </b-button>
        </div>
        <div v-if="transaction_filter" class="mb-2 mt-2">
        <b-collapse id="displayOptions" class="d-md-block">
          <div class="d-block d-md-inline-block pt-1">
            <b-dropdown
              id="ddown1"
              :text="`${$t('todo.orderbymethod')} ${$t(method_sort.label)}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(method, index) in methodOptions"
                :key="`order${index}`"
                @click="changeOrderBy(method, 'method')"
                >{{ method.label }}</b-dropdown-item
              >
            </b-dropdown>
            <b-dropdown
              id="ddown1"
              :text="`${$t('todo.orderbystate')} ${$t(state_sort.label)}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(state, index) in stateOptions"
                :key="`order${index}`"
                @click="changeOrderBy(state, 'state')"
                >{{ state.label }}</b-dropdown-item
              >
            </b-dropdown>
            <b-dropdown
              id="ddown1"
              :text="`${$t('todo.orderbytype')} ${$t(type_sort.label)}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(type, index) in typeOptions"
                :key="`order${index}`"
                @click="changeOrderBy(type, 'type')"
                >{{ type.label }}</b-dropdown-item
              >
            </b-dropdown>

        
          </div>
        </b-collapse>
      </div>
        <vuetable
        ref="transaction_vuetable"
        table-height="360px"
        :api-mode="false"
        :reactive-api-url="true"
        :fields="transaction_fields"
          >
          <template slot="actions" slot-scope="props">
            <b-button
              variant="outline-theme-3"
              id="edit"
              class="icon-button-auction"
              @click="bank_details(props.rowData)">
              <i  class="simple-icon-arrow-right"></i>
            </b-button>
        </template>
        </vuetable>
      </b-card>
    </b-colxx>
   
  </b-row>
    <b-modal
      id="bank_notice"
      ref="bank_notice"
      hide-footer
      size="lg"
      :title="$t('forms.bank_notice')"
    >
      <b-card class="mb-4" no-body>
      <div v-if="bank_notice.notice_photo">
        <single-lightbox
          :thumb="bank_notice.notice_photo"
          :large="bank_notice.notice_photo"
          class-name="responsive border-0 card-img-top mb-3"
        />
      </div>
        <b-card-body>
          <div class="mb-5">
            <h5 class="card-title">{{ $t("forms.notice_number") }}</h5>
            <b-form-input
              type="number"
              readonly
              v-model="bank_notice.notice_number"
            />
          </div>
        </b-card-body>
        <div style="margin: 14px; display: flex; justify-content: right;">
          <b-button
            variant="primary"
            @click="verfiy_transaction('ACCEPTED')"
            class="mr-1"
            >{{ $t("forms.accept") }}</b-button
          >
          <b-button variant="secondary" @click="hideModal('bank_notice')">{{
            $t("pages.cancel")
          }}</b-button>
        </div>
      </b-card>
    </b-modal>
  
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import { mapGetters, mapActions } from "vuex";
import { adminRoot } from "../../../constants/config";
import SingleLightbox from "../../../containers/pages/SingleLightbox.vue";
export default {
  props: ["userId"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "single-lightbox": SingleLightbox
  },
  data() {
    return {
      wallet: {
        balance: null,
        total_balance: null
      },
      filter: null,
      bank_notice: {
        notice_number: null,
        notice_photo: null
      },
      method: null,
      type: null,
      method_sort: {
        column: null,
        label: "All"
      },
      state_sort: {
        column: null,
        label: "All"
      },
      type_sort: {
        column: null,
        label: "All"
      },
      transaction_filter: false,
      transaction_id: null,
      status: null,
      methodOptions: [
        {
          label: "All",
          column: null
        },
        {
          label: "PAYMENT_BANK_TRANSFER",
          column: 1
        },
        {
          label: "PAYMENT_GATEWAY",
          column: 2
        },
        {
          label: "SADAD",
          column: 3
        },
        {
          label: "Deposit",
          column: 4
        }
      ],
      stateOptions: [
        {
          label: "All",
          column: null
        },
        {
          label: "PENDING",
          column: "PENDING"
        },
        {
          label: "ACCEPTED",
          column: "ACCEPTED"
        },
        {
          label: "REJECTED",
          column: "REJECTED"
        }
      ],
      typeOptions: [
        {
          label: "All",
          column: null
        },
        {
          label: "deposit",
          column: "deposit"
        },
        {
          label: "with draw",
          column: "withdraw"
        }
      ],
      transaction_fields: [
        {
          name: "type",
          callback: value => {
            if (value === "deposit") {
              return `<img src="/assets/img/landing-page/deposit.svg"  alt="Image" width="30" height="30">`;
            } else {
              return `<img src="/assets/img/landing-page/with-draw.svg"  alt="Image" width="36" height="36">`;
            }
          },
          title: "Type",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "reference_id",
          title: "ٌReference",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "amount",
          title: "Amount",
          dataClass: "list-item-heading",
          width: "20%"
        },
 
        {
          name: "payment_status",
          callback: value => {
            if (value === "PENDING") {
              return `<span class="badge badge-pill badge-warning handle mr-1">
                PENDING
              </span>`;
            } else if (value === "ACCEPTED") {
              return `<span class="badge badge-pill badge-success handle mr-1">
                ACCEPTED
              </span>`;
            } else {
              return `<span class="badge badge-pill badge-danger handle mr-1">
                REJECTED
              </span>`;
            }
          },
          title: "Status",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "payment_method",
          callback: value => {
            if (value === "PAYMENT_BANK_TRANSFER") {
              return "Bank transfer";
            } else if (value === "PAYMENT_GATEWAY") {
              return "Gateway";
            } else if (value === "PAYMENT_SADAD") {
              return "Sadad";
            } else {
              return "Deposit";
            }
          },
          title: "Payment Method",
          dataClass: "text-muted",
          width: "25%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "15%"
        }
      ],
      deposit_fields: [
        {
          name: "id",
          title: "ID",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "amount",
          title: "Amount",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "payment_method",
          callback: value => {
            if (value === "PAYMENT_BANK_TRANSFER") {
              return "Bank transfer";
            } else if (value === "PAYMENT_GATEWAY") {
              return "Gateway";
            } else if (value === "PAYMENT_SADAD") {
              return "Sadad";
            } else {
              return "Deposit";
            }
          },
          title: "Payment Method",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "active",
          callback: value => {
            return value === 1
              ? `<span class="badge badge-pill badge-success handle mr-1">
                retrieve
              </span>`
              : `<span class="badge badge-pill badge-danger handle mr-1">
                booked up
              </span>`;
          },
          title: "Status",
          dataClass: "text-muted",
          width: "20%"
        }
      ]
    };
  },
  created() {
    this.getUserWallet({ userId: this.userId });
    this.getUserTransactions({ userId: this.userId });
    this.getUserDeposits({ userId: this.userId });
  },
  methods: {
    ...mapActions([
      "getUserWallet",
      "getUserTransactions",
      "getUserDeposits",
      "verfiyTransaction"
    ]),
    changeOrderBy(val, type){
      
      this.filter = { val, type };
      if (type == "type") {
        this.type_sort = val;
      } else if (type == "method") {
        this.method_sort = val;
      } else {
        this.state_sort = val;
      }
    
      console.log('i am here');
    },
    bank_details(item) {
      this.transaction_id = item.id;
      this.bank_notice.notice_photo = item.notice_photo;
      this.bank_notice.notice_number = item.notice_number;
      this.$refs["bank_notice"].show();
    },
    verfiy_transaction(event) {
      this.verfiyTransaction({ type: event, id: this.transaction_id });
    },
    rightClicked(dataItem, field, event) {
      event.preventDefault();
      this.transaction_id = dataItem.id;
      if (field.name === "payment_status") {
        this.$refs.contextmenu.show({ top: event.pageY, left: event.pageX });
      }
    },
    open_filter(){
      this.transaction_filter = !this.transaction_filter
    },
    onContextMenuAction(event) {},
    hideModal(refname) {
      this.$refs[refname].hide();
    }
  },
  computed: {
    ...mapGetters([
      "_userWallet",
      "_userTransactions",
      "_userDeposit",
      "_verfiyTransaction"
    ])
  },
  watch: {
    _userWallet: function(val) {
      this.wallet.balance = val.balance;
      this.wallet.total_balance = val.total_balance;
    },
    _userTransactions: function(val) {
      this.$refs.transaction_vuetable.setData(val);
    },
    _userDeposit: function(val) {
      this.$refs.deposit_vuetable.setData(val);
    },
    _verfiyTransaction: function(val) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Transaction status changed successfully",
        { duration: 3000, permanent: false }
      );

      this.getUserTransactions({ userId: this.userId });
      this.$refs["bank_notice"].hide();
    },
    filter: function(val) {
      if (val.type == "type") {
        this.type = val.val.column;
        this.getUserTransactions({
          userId: this.userId,
          payment_status: this.status,
          payment_method: this.method,
          type: this.type
        });
      } else if (val.type == "method") {
        this.method = val.val.column;
        this.getUserTransactions({
          userId: this.userId,
          payment_status: this.status,
          payment_method: this.method,
          type: this.type
        });
      } else {
        this.status = val.val.column;
        this.getUserTransactions({
          userId: this.userId,
          payment_status: this.status,
          payment_method: this.method,
          type: this.type
        });
      }
    }
  }
};
</script>
