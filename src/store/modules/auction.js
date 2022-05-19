import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import router from "../../router";
import { adminRoot } from "../../constants/config";

const state = {
  isLoadAuctions: true,
  paginations: null,
  auctions: null,
  updated_Successfuly: null,
  Error: "",
  auction: null,
  successDeleteAuction: null
};

const getters = {
  isLoadAuctions: state => state.isLoadAuctions,
  auctionError: state => state.Error,
  auction_paginations: state => state.paginations,
  auctions: state => state.auctions,
  auction: state => state.auction,

  _updatedAuctionSuccessfuly: state => state.updated_Successfuly,
  _successDeleteAuction: state => state.successDeleteAuction
};

const mutations = {
  getAuctionsStarted(state) {
    state.isLoadAuctions = true;
    state.auctions = [];
  },
  getAuctionsSuccess(state, auctions) {
    state.isLoadAuctions = false;
    state.auctions = auctions.data;
    state.paginations = auctions;
  },
  getAuctionSuccess(state, data) {
    state.auction = data.data;
  },
  updatedAuctionSuccessfuly(state, data) {
    state.updated_Successfuly = data;
  },
  getAuctionsError(state, error) {
    state.isLoadAuctions = false;
    state.Error = error;
    state.auctions = null;
  },
  deleteAuction(state, payload) {
    state.successDeleteAuction = payload;
  }
};

const actions = {
  getAuctions({ commit }, payload) {
    commit("getAuctionsStarted");

    axios
      .get(`${apiUrl}/auctions`, {
        params: {
          order_dir: payload.dir,
          title: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page
        }
      })
      .then(res => {
        if (res.status) {
          console.log(res);
          commit("getAuctionsSuccess", res.data);
        } else {
          commit("getAuctionsError", "error:getAuctions");
        }
      });
  },
  getAuction({ commit, dispatch }, payload) {
    const id = payload.id;
    axios.get(`${apiUrl}/auctions/${id}`).then(res => {
      commit("getAuctionSuccess", res.data);
    });
  },
  createAuction({ commit, dispatch }, payload) {
    const formData = new FormData();

    formData.append("ar[title]", payload.info.ar_title);
    formData.append("ar[terms_conditions]", payload.info.ar_description);
    formData.append("en[title]", payload.info.en_title);
    formData.append("en[terms_conditions]", payload.info.en_description);

    formData.append("minimum_price", payload.info.minimum_price);
    formData.append("opening_price", payload.info.opening_price);
    formData.append("start_date", payload.start_date);
    formData.append("end_date", payload.end_date);

    formData.append("longitude", payload.info.longitude);
    formData.append("latitude", payload.info.latitude);

    axios.post(`${apiUrl}/auctions`, formData, {}).then(res => {
      if (res.status === 201) {
        console.log("hi from create");
        router.push(`${adminRoot}/auctions`);
        commit("updatedAuctionSuccessfuly", res);
      }
    });
  },
  updateAuction({ commit, dispatch }, payload) {
    const id = payload.id;
    // const formData = new FormData();
    // formData.append("", );
    // formData.append("", );
    // formData.append(, );
    // formData.append(, );
    // formData.append("category_id", );
    // formData.append("", ;
    // formData.append("", );
    // formData.append("start_date", payload.start_date);
    // formData.append("end_date", payload.end_date);

    // formData.append("longitude", payload.info.longitude);
    // formData.append("latitude", payload.info.latitude);

    axios
      .put(
        `${apiUrl}/auctions/${id}`,
        {
          "ar[title]": payload.info.ar_title,
          "ar[terms_conditions]": payload.info.ar_description,
          "en[title]": payload.info.en_title,
          "en[terms_conditions]": payload.info.en_description,
          category_id: payload.info.categoryId,
          minimum_price: payload.info.minimum_price,
          opening_price: payload.info.opening_price,
          start_date: payload.start_date,
          end_date: payload.end_date,
          longitude: 25.19171507935199,
          latitude: 44.15821996441933
        },
        {}
      )
      .then(res => {
        if (res.status === 200) {
          console.log("updatedAuctionSuccessfuly");
          commit("updatedAuctionSuccessfuly", res);
          router.push(`${adminRoot}/auctions`);
        }
      });
  },

  deleteAuction({ commit, dispatch }, payload) {
    const id = payload.Id;
    axios.delete(`${apiUrl}/auctions/${id}`).then(res => {
      if (res.status === 200) {
        commit("deleteAuction", res);
      }
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
