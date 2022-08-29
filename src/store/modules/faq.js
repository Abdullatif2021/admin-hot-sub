import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import {
  get_faqs,
  get_faq,
  create_faq,
  update_faq,
  delete_faq,
  get_faqCategories,
  get_faqCategory,
  create_faqCategory,
  update_faqCategory,
  delete_faqCategory
} from "../../plugins/services/faq"
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
      const faqs = get_faqs({
        category_id: payload.category_id
      });
      faqs
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
  createFaq({ commit }, payload) {
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[question]`, el.question);
      formData.append(`${el._name}[answer]`, el.answer);
    });
    formData.append(`category_id`, payload.category_id);
    const createFaq = create_faq(formData)
    createFaq.then(res => {
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
    const updateFaq = update_faq({id, formData})
    updateFaq.then(res => {
      if (res.status === 200) {
        commit("updateFaqSuccessfuly");
      }
    });
  },
  deleteFaq({ commit, dispatch }, payload) {
    const faq_id = payload.faq_id;
    const deleteFaq = delete_faq(faq_id) 
    deleteFaq.then(res => {
      if (res.status === 200) {
        commit("deleteSuccessfuly");
      }
    });
  },
  // *********************************** Category ********************************************
  getFaqCategories({ commit, dispatch }, payload) {
    commit("setProssing", false);
    const getFaqCategories = get_faqCategories({
      keyword: payload.search
    })
   getFaqCategories
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
    const faqCategory = get_faqCategory(category_id);
   
      
      faqCategory.then(res => {
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
    const createFaqCategory = create_faqCategory(formData);
   createFaqCategory.then(res => {
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
    const updateFaqCategory = update_faqCategory({category_id, formData})
    
      
      updateFaqCategory.then(res => {
        if (res.status === 200) {
          commit("updateFaqCategorySuccessfuly");
        }
      });
  },
  deleteFaqCategory({ commit, dispatch }, payload) {
    const category_id = payload.category_id;
    const deleteFaqCategory = delete_faqCategory(category_id)
    deleteFaqCategory.then(res => {
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
