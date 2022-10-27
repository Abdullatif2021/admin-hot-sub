import Vue from "vue";
import Vuex from "vuex";

import app from "../main";
import menu from "./modules/menu";
import auction from "./modules/auction";
import categories from "./modules/categories";
import block from "./modules/block";
import user from "./modules/user";
import pages from "./modules/pages";
import dashboard from "./modules/dashboard";
import faq from "./modules/faq";
import settings from "./modules/settings";
import { setCurrentLanguage } from "../utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {}, 
  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload;
      setCurrentLanguage(payload);
    }
  },
  actions: {
    setLang({ commit }, payload) {
      commit("changeLang", payload.locale);
    }
  },
  modules: {
    menu,
    user,
    block,
    auction,
    categories,
    faq,
    settings,
    dashboard,
    pages
  }
});
