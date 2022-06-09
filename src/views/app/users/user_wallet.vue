<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" no-body>
        <b-tabs card no-fade>
          <b-tab
            title-item-class="w-30 text-center"
            :title="$t('forms.wallet')"
            active
          >
            <b-row>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.balance')">
                  <b-form-input
                    type="number"
                    readonly
                    v-model="walletForm.balance"
                  ></b-form-input>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.total_balance')">
                  <b-form-input
                    type="number"
                    readonly
                    v-model="walletForm.total_balance"
                  ></b-form-input>
                </b-form-group>
              </b-colxx>
            </b-row>
          </b-tab>
          <b-tab
            title-item-class="w-30 text-center"
            :title="$t(`forms.transactions`)"
          ></b-tab>
          <b-tab
            title-item-class="w-30 text-center"
            :title="$t(`forms.deposits`)"
          ></b-tab>
        </b-tabs>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
export default {
  data() {
    return {
      walletForm: {
        balance: 1900,
        total_balance: "1900.0000"
      }
    };
  }
};
</script>
