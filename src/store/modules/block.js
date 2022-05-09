import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoad: false,
  blocks: null,
  _paginations: null,
  block: null,
  blockCategories: null,
  _Error: ""
};

const getters = {
  isLoad: state => state.isLoad,
  _Error: state => state._Error,
  _paginations: state => state._paginations,
  blocks: state => state.blocks,
  block: state => state.block,
  _blockCategories: state => state.blockCategories
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
    state._paginations = data;
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
    state._Error = error;
    state.blocks = null;
    state.block = null;
  },
  _getBlockCategories(state, payload) {
    state.blockCategories = payload;
  }
};

const actions = {
  getBlocks({ commit }, payload) {
    commit("getBlocksStarted");
    axios
      .get(`${apiUrl}/blocks`, {
        params: {
          order_dir: payload.dir,
          name: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          block_category_id: payload.block_category_id,
          page: payload.page
        }
      })
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
  getBlockCategories({ commit }, payload) {
    axios.get(`${apiUrl}/blocks/categories`).then(res => {
      console.log("hi from categories", res);
      commit("_getBlockCategories", res.data.data);
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
