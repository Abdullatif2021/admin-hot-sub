<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{$t('edit_block')}}</h1>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
          <b-tab @click="getBasic" :title="$t(`forms.basic_details`)" active >
            <template v-if="_isBLoad">
              <b-colxx xxs="12" xs="6" lg="12">
                <Category_basic_details :basicData="_blockCategory" :enableSubmitBtn="enableSubmitBtn" @formSubmited="basicDetailsSubmit" />
              </b-colxx>
            </template>
            <template v-else>
              <div class="loading"></div>
            </template>
          </b-tab>
          <b-tab @click="getMeta" :title="$t(`forms.meta_data`)">
            <metaData
                :list="_blockCategoryMeta"
                :meta_type_list="_blockMetaTypeList"
                :isLoad="_isLoadBlockCategoryMeta"
                :meta_success_create="_create_block_category_success"
                @create-meta="createMeta"
                @update-meta="updateMeta"
                @delete-meta="deleteMeta"
              />
          </b-tab>
        </b-tabs>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import metaData from "../../../components/shared/metaData.vue";
import Category_basic_details from "../../../components/shared/category_basic_details.vue";
import router from "../../../router";
import { adminRoot } from "../../../constants/config";

export default {
  components: {
    Category_basic_details,
    metaData
  },
  data() {
    return {
      id: null,
      basicData: null,
      enableSubmitBtn: false,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getBlockCategory({ id: this.$route.query.id })
  },
  methods: {
    ...mapActions([
      "getBlockCategory",
      "createBlockCategory",
      "updateBlockCategory",
      "getBlockCategoryMetadata",
      "createBlockCategoryMetadata",
      "updateBlockCategoryMeta",
      "deleteBlockCategoryMetadata",
      "getBlockMetaTypeList",
    ]),
    createCategory(info, img, type) {
      this.createBlockCategory({ info: info, type: type, image: img });
    },
    basicDetailsSubmit(langsData, img){
      this.enableSubmitBtn = true;
      this.updateBlockCategory({
            type: this.basicData.type,
            info: langsData,
            image: img,
            id: this.id
          });
    },
    getBasic(){
      this.getBlockCategory({ id: this.$route.query.id })
    },
    // ===================meta_data===========================
    getMeta(){
      this.getBlockCategoryMetadata({ id: this.id })
      this.getBlockMetaTypeList();
    },
    createMeta(type, info){
      this.createBlockCategoryMetadata({
              id: this.id,
              meta_type_id: type,
              info: info
            });
    },
    updateMeta(type, info, metaID){
      this.updateBlockCategoryMeta({
              id: this.id,
              metadata_id: metaID,
              meta_type_id: type,
              info: info
            });
    },
    deleteMeta(metaID){
      this.deleteBlockCategoryMetadata({
              id: this.id,
              metadata_id: metaID
            })
    }
  },
  computed: {
    ...mapGetters(["_create_block_category_success", "_successUpdateBlockCategory", "_blockMetaTypeList", "_blockCategory", "_isBLoad",  "_blockCategoryMeta", "_isLoadBlockCategoryMeta",])
  },
  watch: {
    _blockCategory: function(val) {
      this.basicData = val
    },
    _create_block_category_success: function(val) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Block Category have been created successfully",
        { duration: 3000, permanent: false }
      );
      router.push(`${adminRoot}/blockCategories`);
    },
    _successUpdateBlockCategory(newInfo, oldOne) {
      this.enableSubmitBtn = false;
      this.$notify(
        "success",
        "Operation completed successfully",
        "Block Category details have been updated successfully",
        { duration: 3000, permanent: false }
      );
    },
  }
};
</script>
