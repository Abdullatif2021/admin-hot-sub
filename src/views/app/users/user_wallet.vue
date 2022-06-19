<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" no-body>
          <b-tabs card no-fade>
            <b-tab
              title-item-class="w-30 text-center"
              :title="$t('forms.wallet')"
              @click="$emit('hide_filter')"
              active
            >
              <b-row>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.balance')">
                    <b-form-input
                      type="number"
                      readonly
                      v-model="wallet.balance"
                    ></b-form-input>
                  </b-form-group>
                </b-colxx>
                <b-colxx sm="6">
                  <b-form-group :label="$t('forms.total_balance')">
                    <b-form-input
                      type="number"
                      readonly
                      v-model="wallet.total_balance"
                    ></b-form-input>
                  </b-form-group>
                </b-colxx>
              </b-row>
            </b-tab>
            <b-tab
              title-item-class="w-30 text-center"
              :title="$t(`forms.transactions`)"
              @click="
                $emit('show_filter', methodOptions, stateOptions, typeOptions)
              "
            >
              <b-row>
                <b-colxx xxs="12">
                  <!-- <template v-if="_isLoadPages"> -->
                  <vuetable
                    ref="transaction_vuetable"
                    class="table-divided order-with-arrow"
                    :api-mode="false"
                    :reactive-api-url="true"
                    :fields="transaction_fields"
                    @vuetable:cell-rightclicked="rightClicked"
                  >
                    <template slot="actions" slot-scope="props">
                      <b-button
                        v-if="
                          props.rowData.payment_method ===
                            'PAYMENT_BANK_TRANSFER' &&
                            props.rowData.payment_status !== 'ACCEPTED'
                        "
                        v-b-modal.bank_notice
                        variant="outline-theme-3"
                        class="icon-button"
                        @click="bank_details(props.rowData)"
                      >
                        <i class="simple-icon-arrow-right-circle"></i>
                      </b-button>
                    </template>
                  </vuetable>
                  <!-- <vuetable-pagination-bootstrap
            class="mt-4"
            ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          /> -->
                  <!-- </template>
                <template v-else>
                  <div class="loading"></div>
                </template> -->
                </b-colxx>
              </b-row>
            </b-tab>
            <b-tab
              title-item-class="w-30 text-center"
              :title="$t(`forms.deposits`)"
              @click="$emit('hide_filter')"
            >
              <b-row>
                <b-colxx xxs="12">
                  <!-- <template v-if="_isLoadPages"> -->
                  <vuetable
                    ref="deposit_vuetable"
                    class="table-divided order-with-arrow"
                    :api-mode="false"
                    :reactive-api-url="true"
                    :fields="deposit_fields"
                  >
                    <!-- <template
                   
                    slot="actions"
                    slot-scope="props"
                  >
                    <b-button
                      variant="outline-theme-3"
                      class="icon-button"
                      @click="modify(props.rowData.id)"
                    >
                      <i class="simple-icon-settings"></i>
                    </b-button>
                  </template> -->
                  </vuetable>
                  <!-- <vuetable-pagination-bootstrap
            class="mt-4"
            ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          /> -->
                  <!-- </template>
                <template v-else>
                  <div class="loading"></div>
                </template> -->
                </b-colxx>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-colxx>
    </b-row>
    <b-modal
      id="bank_notice"
      hide-footer
      size="lg"
      :title="$t('forms.bank_notice')"
    >
      <b-card class="mb-4" no-body>
        <single-lightbox
          :thumb="bank_notice.notice_photo"
          :large="bank_notice.notice_photo"
          class-name="responsive border-0 card-img-top mb-3"
        />
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
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="onContextMenuAction('ACCEPTED')">
        <i
          class="iconsminds-record-music"
          style="
  
        color: #059727;
    background: #059727;
    border-radius: 10px;
"
        />
        <span>{{ $t("forms.accepted") }}</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('REJECTED')">
        <i
          class="iconsminds-record-music"
          style="
     color: red;
    background: red;
    border-radius: 10px;
"
        />
        <span>{{ $t("forms.rejected") }}</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('PENDING')">
        <i
          class="iconsminds-record-music"
          style="
    color: #b69329;
    background: #b69329;
    border-radius: 10px;
"
        />
        <span>{{ $t("forms.pending") }}</span>
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import { mapGetters, mapActions } from "vuex";
import { adminRoot } from "../../../constants/config";
import SingleLightbox from "../../../containers/pages/SingleLightbox.vue";
export default {
  props: ["userId", "filter"],
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
      bank_notice: {
        notice_number: null,
        notice_photo: null
      },
      method: null,
      type: null,
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
          name: "type",
          title: "Type",
          titleClass: "",
          dataClass: "text-muted",
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
          width: "20%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
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
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
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
    bank_details(item) {
      console.log(item);
      this.transaction_id = item.id;
      this.bank_notice.notice_photo = item.notice_photo;
      this.bank_notice.notice_number = item.notice_number;
      // this.$refs["bank_notice"].show();
    },
    verfiy_transaction(event) {
      this.verfiyTransaction({ type: event, id: this.transaction_id });
    },
    rightClicked(dataItem, field, event) {
      event.preventDefault();
      console.log(dataItem, field, event);
      this.transaction_id = dataItem.id;
      if (field.name === "payment_status") {
        this.$refs.contextmenu.show({ top: event.pageY, left: event.pageX });
      }
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
      console.log("depositttttttttttttttt", val);
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
