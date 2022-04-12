<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.blog-list')" />
        <div class="mb-2 mt-2">
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-md-none"
            v-b-toggle.displayOptions
          >
            {{ $t("pages.display-options") }}
            <i class="simple-icon-arrow-down align-middle" />
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block pt-1"></div>
            <div class="float-md-right pt-1" style="margin-top: -0.7rem;">
              <span class="text-muted text-small mr-1 mb-2"
                >{{ paginations.from }}-{{ paginations.to }} of
                {{ paginations.total }}</span
              >
              <b-dropdown
                id="ddown2"
                right
                :text="`${paginations.per_page}`"
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
        <div class="separator mb-5"></div>
      </b-colxx>
      <b-colxx
        v-for="(blockItem, blockIndex) in blocks"
        xxs="12"
        lg="6"
        class="mb-5"
        :key="`blockItem_${blockIndex}`"
      >
        <b-card class="flex-row listing-card-container" no-body>
          <div class="w-40 position-relative">
            <router-link :to="{ path: 'block/' + blockItem.id }">
              <img
                class="card-img-left"
                src="/assets/img/details/block-default.jpg"
                alt="Card cap"
              />
              <b-badge
                variant="primary"
                pill
                class="position-absolute badge-top-left"
                >NEW</b-badge
              >
            </router-link>
          </div>
          <div class="w-60 d-flex align-items-center">
            <b-card-body>
              <router-link :to="{ path: 'block/' + blockItem.id }">
                <h5 class="mb-3 listing-heading" v-line-clamp="2">
                  {{ blockItem.locales.en.name }}
                </h5>
              </router-link>
              <p
                v-if="blockItem.created_by.name"
                class="listing-desc text-muted"
                v-line-clamp="3"
              >
                By : {{ blockItem.created_by.name }}
              </p>
              <p
                v-if="blockItem.created_at"
                class="listing-desc text-muted"
                v-line-clamp="3"
              >
                Since : {{ blockItem.created_at }}
              </p>
            </b-card-body>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-pagination-nav
          class="justify-content-center pagination"
          :number-of-pages="5"
          :link-gen="linkGen"
          v-model="currentPage"
          :per-page="5"
          align="center"
        >
          <template v-slot:next-text>
            <i class="simple-icon-arrow-right" />
          </template>
          <template v-slot:prev-text>
            <i class="simple-icon-arrow-left" />
          </template>
          <template v-slot:first-text>
            <i class="simple-icon-control-start" />
          </template>
          <template v-slot:last-text>
            <i class="simple-icon-control-end" />
          </template>
        </b-pagination-nav>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { blogData } from "../../../data/blog";

export default {
  data() {
    return {
      blogData,
      currentPage: 1,
      pageSizes: [10, 11, 12]
    };
  },
  methods: {
    ...mapActions(["getBlocks"]),

    linkGen(pageNum) {
      return "#page/" + pageNum + "/foobar";
    },
    changePageSize(size) {
      console.log(size);
    }
  },
  computed: {
    ...mapGetters(["blocks", "paginations"])
  },
  created() {
    this.getBlocks();
  }
};
</script>
