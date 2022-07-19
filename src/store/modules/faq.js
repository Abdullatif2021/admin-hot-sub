import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoadFaq: false,
  paginations: null,
  Faqs: null,
  createFaqSuccessfuly: false,
  updateFaqSuccessfuly: false,
  Error: ""
};

const getters = {
  _isLoadFaq: state => state.isLoadFaq,
  Error: state => state.Error,
  _paginations: state => state.paginations,
  _Faqs: state => state.Faqs,
  _updateFaqSuccessfuly: state => state.updateFaqSuccessfuly
};

const mutations = {
  setProssing(state, payload) {
    state.isLoadFaq = payload;
  },
  getFaqs(state, Faqs) {
    state.Faqs = Faqs;
  },
  updateFaqSuccessfuly(state) {
    state.updatedSuccessfuly = !state.updatedSuccessfuly;
  }
};

const actions = {
  getFaqs({ commit }, payload) {
    commit("setProssing", false);

    axios
      .get(`${apiUrl}/faq`)
      .then(res => {
        commit("setProssing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getFaqs", res.data.data);
        }
      });
  },
  updateFaq({ commit }, payload) {
    const id = payload.id;
    axios
      .put(
        `${apiUrl}/setting/${id}`,
        {
          value: payload.value
        },
        {}
      )
      .then(res => {
        if (res.status === 200) {
          commit("updatedSuccessfuly");
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
