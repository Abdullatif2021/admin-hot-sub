import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoad: false,
  Items: null,
  Error: ""
};

const getters = {
  // isLoad: state => state.isLoad,
  // Error: state => state.Error,
  Items: state => state.Items
};

const mutations = {
  getItemStarted(state) {
    state.isLoad = false;
    state.Items = [];
  },
  getItemSuccess(state, items) {
    state.isLoad = true;
    state.Items = items;
  },
  getItemError(state, error) {
    state.isLoad = false;
    state.Error = error;
    state.Items = null;
  }
};

const actions = {
  getItems({ commit }) {
    commit("getItemStarted");
    axios
      .get(`${apiUrl}/addresses`)
      .then(res => res.data)
      .then(res => {
        if (res.status) {
          commit("getItemSuccess", res.data);
        } else {
          commit("getItemError", "error:getItem");
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
