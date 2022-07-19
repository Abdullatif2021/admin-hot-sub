<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.faq')" />
        <b-button
          variant="primary"
          size="lg"
          :class="dir.isRtl ? 'top-faq-left-button' : 'top-faq-right-button'"
          >New FAQ</b-button
        >
        <b-button
          variant="primary"
          size="lg"
          :class="
            dir.isRtl
              ? 'top-faq-category-left-button'
              : 'top-faq-category-right-button'
          "
          >Edit ... Category</b-button
        >

        <div class="separator mb-5"></div>
      </b-colxx>
      <b-colxx xxs="12" class="mb-4">
        <b-card
          no-body
          class="d-flex mb-3"
          v-for="(item, index) in faqData"
          :key="`faq_${index}`"
        >
          <div class="d-flex flex-grow-1 min-width-zero" role="tab">
            <b-button
              href="#"
              class="card-body  btn-empty btn-link list-item-heading text-left text-one"
              v-b-toggle="`faq_${index}`"
              variant="link"
              >{{ item.question }}</b-button
            >
            <div style="margin: 22px;">
              <b-button
                variant="outline-theme-3"
                class="icon-button"
                style="margin-right: 8px;"
                @click="modify(item)"
              >
                <i class="simple-icon-pencil"></i>
              </b-button>
              <b-button
                variant="outline-theme-6"
                class="icon-button"
                @click="open_model('deleteFaq', item)"
              >
                <i class="simple-icon-trash"></i>
              </b-button>
            </div>
          </div>
          <b-collapse
            :id="`faq_${index}`"
            :visible="index === 0"
            accordion="faq-accordion"
            role="tabpanel"
          >
            <div
              class="card-body accordion-content pt-0"
              v-html="item.answer"
            />
          </b-collapse>
        </b-card>
      </b-colxx>
    </b-row>
    <b-modal
      id="deleteFaq"
      ref="deleteFaq"
      :title="$t('modal.modal-delete-faq-title')"
    >
      {{ $t("forms.deleteFaqQuestion") }}
      <template slot="modal-footer">
        <b-button
          :disabled="deleteBtn"
          variant="primary"
          @click="delete_faq()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('deleteFaq')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import faqData from "../../../data/faq";
import { getDirection } from "../../../utils";

export default {
  data() {
    return {
      faqData,
      deleteBtn: false,
      dir: null
    };
  },
  created() {
    this.dir = getDirection();
    console.log(this.dir);
  },
  methods: {
    delete_faq() {
      this.deleteBtn = true;
      console.log("delete_faq");
    },
    open_model(refName, id, active) {
      this.$refs[refName].show();
      //   this.id = id;
      //   this.active = active
    },
    hideModal(refName) {
      this.$refs[refName].hide();
    }
  }
};
</script>
