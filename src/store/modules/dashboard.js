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
  isLoadChart: false
};

const getters = {
  _isLoadData: state => state.isLoadData,
  _statistics: state => state.statistics,
  _logs: state => state.logs,
  _logsProssing: state => state.logsProssing,
  _ownerChart: state => state.ownerChart,
  _isLoadChart: state => state.isLoadChart,
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
  },
  chartLoading(state, payload){
    state.isLoadChart = payload;
  }
};

const actions = {
  getStatistics({ commit }, {owner_id, auction_id, start_date, end_date, date}) {
    commit("setProssing", false);
      const state = get_statistics({ 
        owner_id,
        auction_id,
        start_date,
        end_date,
        date,
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
    commit("chartLoading", false);
    const owner_chart = get_owner_chart({ owner_id: payload.owner_id });
    owner_chart
    
    .then(res => {
      if (res.status === 200) {
        commit("getOwnerChart", res.data.data);
      }
    })
    .then(res => {
      commit("chartLoading", true);
      return res;
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
