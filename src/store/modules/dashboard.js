import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import {
    get_statistics

} from "../../plugins/services/dashboard"
const state = {
  isLoadData: false,
  statistics: null,
};

const getters = {
  _isLoadData: state => state.isLoadData,
  _statistics: state => state.statistics
};

const mutations = {
  setProssing(state, payload) {
    state.isLoadData = payload;
  },
  getStatistics(state, payload){
    state.statistics = payload;
  }
  
};

const actions = {
  getStatistics({ commit }, payload) {
    commit("setProssing", false);
      const state = get_statistics({ auction_id: payload.auction_id,
        start_date: payload.start_date,
        end_date: payload.end_date,
        date: payload.date,
       });
      state
      .then(res => {
        commit("setProssing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getStatistics", res.data.data);
        }
      });
  },
  getFaq({ commit }, payload) {
    commit("setProssing", false);
    const faq = get_faq({id: payload.faqId})
    faq
      .then(res => {
        commit("setProssing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getFaq", res.data.data);
        }
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
