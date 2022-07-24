import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoadFaq: false,
  paginations: null,
  Faqs: null,
  createFaqSuccessfuly: false,
  deleteSuccessfuly: false,
  deleteFaqCategorySuccess: false,
  faqCategory: null,
  Faq: null,
  categoryProssing: true,
  FaqCategories: null,
  updateFaqCategory: false,
  createFaqCategory: false,
  isNavigationON: false,
  updateFaqSuccessfuly: false
};

const getters = {
  _isLoadFaq: state => state.isLoadFaq,
  _paginations: state => state.paginations,
  _deleteFaqCategorySuccess: state => state.deleteFaqCategorySuccess,
  _Faq: state => state.Faq,
  _categoryProssing: state => state.categoryProssing,
  _isNavigationON: state => state.isNavigationON,
  _FaqCategories: state => state.FaqCategories,
  _faqCategory: state => state.faqCategory,
  _Faqs: state => state.Faqs,
  _updateFaqCategory: state => state.updateFaqCategory,
  _createFaqCategory: state => state.createFaqCategory,
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
    state.updateFaqSuccessfuly = !state.updateFaqSuccessfuly;
  },
  deleteSuccessfuly(state, payload) {
    state.deleteSuccessfuly = !state.deleteSuccessfuly;
  },
  setCategoryProssing(state, payload) {
    state.categoryProssing = payload;
  },
  getFaqCategories(state, payload) {
    state.FaqCategories = payload;
  },
  deleteFaqCategory(state, payload) {
    state.deleteFaqCategorySuccess = !state.deleteFaqCategorySuccess;
  },
  isNavigationON(state, payload) {
    state.isNavigationON = !state.isNavigationON;
  },
  getFaqCategory(state, payload) {
    state.faqCategory = payload;
  },
  updateFaqCategorySuccessfuly(state, payload) {
    state.updateFaqCategory = !state.updateFaqCategory;
  },
  createFaqCategorySuccessfuly(state, payload) {
    state.createFaqCategory = !state.createFaqCategory;
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
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[question]`, el.question);
      formData.append(`${el._name}[answer]`, el.answer);
    });
    formData.append(`category_id`, payload.category_id);
    formData.append(`_method`, "PUT");

    axios.post(`${apiUrl}/faq/${id}`, formData, {}).then(res => {
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
      }
    });
  },
  // *********************************** Category ********************************************
  getFaqCategories({ commit, dispatch }, payload) {
    commit("setProssing", false);

    axios
      .get(`${apiUrl}/faqcategory`, {
        params: {
          keyword: payload.search
        }
      })
      .then(res => {
        commit("setProssing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getFaqCategories", res.data.data);
        }
      });
  },
  getFaqCategory({ commit, dispatch }, payload) {
    commit("setCategoryProssing", false);
    const category_id = payload.category_id;
    axios
      .get(`${apiUrl}/faqcategory/${category_id}`)
      .then(res => {
        commit("setCategoryProssing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getFaqCategory", res.data.data);
        }
      });
  },
  createFaqCategory({ commit, dispatch }, payload) {
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
    });
    axios.post(`${apiUrl}/faqcategory`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("createFaqCategorySuccessfuly");
      }
    });
  },
  updateFaqCategory({ commit, dispatch }, payload) {
    const category_id = payload.category_id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
    });
    formData.append(`_method`, "PUT");
    axios
      .post(`${apiUrl}/faqcategory/${category_id}`, formData, {})
      .then(res => {
        if (res.status === 200) {
          commit("updateFaqCategorySuccessfuly");
        }
      });
  },
  deleteFaqCategory({ commit, dispatch }, payload) {
    const category_id = payload.category_id;
    axios.delete(`${apiUrl}/faqcategory/${category_id}`).then(res => {
      if (res.status === 200) {
        commit("deleteFaqCategory");
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
