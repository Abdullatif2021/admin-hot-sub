import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoadPages: true,
  pagesPaginations: null,
  Pages: null,
  updatedSuccessfuly: false,
  Error: "",
  // //////////////////////////////////////////////////////////////////
  page: null
};

const getters = {
  isLoadPages: state => state.isLoadPages,
  PagesError: state => state.Error,
  pagesPaginations: state => state.paginations,
  Pages: state => state.Pages,
  //   updatedSuccessfuly: state => state.updatedSuccessfuly

  page: state => state.page
};

const mutations = {
  getPagesListStarted(state) {
    state.isLoadPages = true;
    state.Pages = [];
  },
  getPagesSuccess(state, payload) {
    state.isLoadPages = false;
    state.Pages = payload.data;
    state.pagesPaginations = payload;
  },
  getPageStarted(state) {
    state.page = null;
  },
  getPageSuccess(state, payload) {
    state.page = payload.data;
  },
  updatedSuccessfuly(state) {
    state.updatedSuccessfuly = true;
  },
  getPagesError(state, error) {
    state.isLoadPages = false;
    state.PagesError = error;
    state.Pages = null;
  }
};

const actions = {
  getPagesList({ commit }, payload) {
    commit("getPagesListStarted");

    axios
      .get(`${apiUrl}/pages`, {
        params: {
          type: payload.role,
          order_dir: payload.dir,
          name: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page
        }
      })
      .then(res => {
        if (res.status) {
          commit("getPagesSuccess", res.data);
        } else {
          commit("getPagesError", "error:getPages");
        }
      });
  },
  getPage({ commit }, payload) {
    commit("getPageStarted");
    const id = payload.id;
    axios.get(`${apiUrl}/pages/${id}`).then(res => {
      console.log(res);
      commit("getPageSuccess", res.data);
    });
  },
  updatePageData({ commit }, payload) {}
};

export default {
  state,
  getters,
  mutations,
  actions
};
