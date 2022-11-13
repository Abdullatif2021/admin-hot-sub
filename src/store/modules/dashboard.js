import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import {
    get_statistics,
    get_logs,
    get_owner_chart
} from "../../plugins/services/dashboard"
const state = {
  isLoadData: false,
  statistics: null,
  logs: null,
  logsProssing: false,
  ownerChart: null,
};

const getters = {
  _isLoadData: state => state.isLoadData,
  _statistics: state => state.statistics,
  _logs: state => state.logs,
  _logsProssing: state => state.logsProssing,
  _ownerChart: state => state.ownerChart,
};

const mutations = {
  setProssing(state, payload) {
    state.isLoadData = payload;
  },
  getStatistics(state, payload){
    state.statistics = payload;
  },
  getLogs(state, payload){
    state.logs = payload;
  },
  getLogsProssing(state, payload){
    state.logsProssing = payload;
  },
  getOwnerChart(state, payload){
    state.ownerChart = payload;
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
  getLogs({ commit, dispatch }, payload) {
    commit("getLogsProssing", false);
    const logs = get_logs();
    logs
    .then(res => {
      commit("getLogsProssing", true);
      return res;
    })
    .then(res => {
      if (res.status === 200) {
        commit("getLogs", res.data.data);
      }
    })
    .catch(err => {
      console.log(err);
    })
  },
  getOwnerChart({ commit, dispatch}, payload) {
    commit("getLogsProssing", false);
    const owner_chart = get_owner_chart({ owner_id: payload.owner_id });
    owner_chart
    .then(res => {
      commit("getLogsProssing", true);
      return res;
    })
    .then(res => {
      if (res.status === 200) {
        commit("getOwnerChart", res.data.data);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
