import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoadFaq: false,
  paginations: null,
  Faqs: null,
  createFaqSuccessfuly: false,
  deleteSuccessfuly: false,
  Faq: null,
  FaqCategories: null,
  updateFaqSuccessfuly: false
};

const getters = {
  _isLoadFaq: state => state.isLoadFaq,
  _paginations: state => state.paginations,
  _Faq: state => state.Faq,
  _FaqCategories: state => state.FaqCategories,
  _Faqs: state => state.Faqs,
  _createFaqSuccessfuly: state => state.createFaqSuccessfuly,
  _deleteFaqSuccessfuly: state => state.deleteSuccessfuly,
  _updateFaqSuccessfuly: state => state.updateFaqSuccessfuly
};

const mutations = {
  setProssing(state, payload) {
    state.isLoadFaq = payload;
  },
  getFaqs(state, Faqs) {
    state.Faqs = Faqs;
  },
  getFaq(state, payload) {
    state.Faq = payload;
  },
  createFaqSuccessfuly(state) {
    state.createFaqSuccessfuly = !state.createFaqSuccessfuly;
  },
  updateFaqSuccessfuly(state) {
    state.updatedSuccessfuly = !state.updatedSuccessfuly;
  },
  deleteSuccessfuly(state, payload) {
    state.deleteSuccessfuly = !state.deleteSuccessfuly;
  },
  getFaqCategory(state, payload) {
    state.FaqCategories = payload;
  }
};

const actions = {
  getFaqs({ commit }, payload) {
    commit("setProssing", false);

    axios
      .get(`${apiUrl}/faq`, {
        params: {
          category_id: payload.category_id
        }
      })
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
  getFaq({ commit }, payload) {
    commit("setProssing", false);

    axios
      .get(`${apiUrl}/faq`, {
        params: {
          id: payload.faqId
        }
      })
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
  createFaq({ commit }, payload) {
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[question]`, el.question);
      formData.append(`${el._name}[answer]`, el.answer);
    });
    formData.append(`category_id`, payload.category_id);
    axios.post(`${apiUrl}/faq`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("createFaqSuccessfuly");
      }
    });
  },
  updateFaq({ commit }, payload) {
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[question]`, el.question);
      formData.append(`${el._name}[answer]`, el.answer);
    });
    formData.append(`category_id`, payload.select);
    axios.put(`${apiUrl}/faq`, formData, {}).then(res => {
      if (res.status === 200) {
        commit("updateFaqSuccessfuly");
      }
    });
  },
  deleteFaq({ commit, dispatch }, payload) {
    const faq_id = payload.faq_id;
    axios.delete(`${apiUrl}/faq/${faq_id}`).then(res => {
      if (res.status === 200) {
        commit("deleteSuccessfuly");
        dispatch("getFaqs");
      }
    });
  },
  // *********************************** Category ********************************************
  getFaqCategory({ commit, dispatch }, payload) {
    axios.get(`${apiUrl}/faqcategory`).then(res => {
      if (res.status === 200) {
        commit("getFaqCategory", res.data.data);
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
