import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoad: false,
  blocks: null,
  paginations: null,
  block: null,
  Error: ""
};

const getters = {
  isLoad: state => state.isLoad,
  Error: state => state.Error,
  paginations: state => state.paginations,
  blocks: state => state.blocks,
  block: state => state.block
};

const mutations = {
  getBlocksStarted(state) {
    state.isLoad = false;
    state.blocks = [];
  },
  getBlocksSuccess(state, blocks) {
    state.isLoad = true;
    state.blocks = blocks;
  },
  getPaginationsSuccess(state, data) {
    state.isLoad = true;
    state.paginations = data;
  },
  getBlockStarted(state) {
    state.isLoad = false;
    state.block = null;
  },
  getBlockSuccess(state, block) {
    state.isLoad = true;
    state.block = block;
  },
  getBlockError(state, error) {
    state.isLoad = false;
    state.Error = error;
    state.blocks = null;
    state.block = null;
  }
};

const actions = {
  getBlocks({ commit }, payload) {
    commit("getBlocksStarted");
    axios
      .get(`${apiUrl}/blocks?limit=15`)
      .then(res => res.data)
      .then(res => {
        if (res.status) {
          commit("getPaginationsSuccess", res);
          commit("getBlocksSuccess", res.data);
        } else {
          commit("getBlockError", "error:getBlocks");
        }
      });
  },
  getBlock({ commit }, payload) {
    commit("getBlockStarted");
    const blockId = payload;
    axios
      .get(`${apiUrl}/blocks/${blockId}/slug`)
      .then(res => res.data)
      .then(res => {
        if (res.status) {
          commit("getBlockSuccess", res.data);
        } else {
          commit("getBlockError", "error:getBlock");
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
