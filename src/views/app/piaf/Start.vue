<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.start')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row>
          <b-colxx lg="8" xl="8" class="mb-4">
            <b-row>
              <!-- <b-colxx lg="4" class="mb-4">
                <IconCard
                  title="Offers"
                  icon="iconsminds-basket-coins"
                  :value="offers_count"
                />
              </b-colxx> -->
              <b-colxx lg="4" class="mb-4">
                <IconCard
                  title="Categories"
                  icon="simple-icon-list"
                  :value="categories_count"
                />
              </b-colxx>
              <b-colxx lg="4" class="mb-4">
                <IconCard
                  title="Items"
                  icon="simple-icon-pie-chart"
                  :value="items_count"
                />
              </b-colxx>
            </b-row>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import IconCard from "../../../components/Cards/IconCard.vue";
import axios from "axios";

export default {
  components: {
    IconCard: IconCard
  },
  data() {
    return {
      items_count: 10,
      offers_count: 5,
      categories_count: 0
    };
  },
  created() {
    this.getItems({ search: null });
    this.getCategories({ search: null });
  },
  methods: {
    getItems() {
      axios
        .get("http://back-end.hot-sub.ca/api/items")
        .then(response => {
          console.log({ response });
          this.items_count = response.data.data.total;
        })
        .catch(error => {
          console.error("There was an error fetching the offers:", error);
        });
    },
    getCategories() {
      axios
        .get("http://back-end.hot-sub.ca/api/categories")
        .then(response => {
          console.log({ response });
          this.categories_count = response.data.data.length;
        })
        .catch(error => {
          console.error("There was an error fetching the offers:", error);
        });
    }
  }
};
</script>
