import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import {get_settings, update_setting} from "../../plugins/services/settings"
const state = {
  isLoadSettings: true,
  paginations: null,
  settings: null,
  updatedSuccessfuly: false,
  Error: ""
};

const getters = {
  isLoadSettings: state => state.isLoadSettings,
  Error: state => state.Error,
  paginations: state => state.paginations,
  settings: state => state.settings,
  updatedSuccessfuly: state => state.updatedSuccessfuly
};

const mutations = {
  getSettingsStarted(state) {
    state.isLoadSettings = true;
    state.settings = [];
  },
  getSettingsSuccess(state, settings) {
    state.isLoadSettings = false;
    state.settings = settings;
  },
  updatedSuccessfuly(state) {
    state.updatedSuccessfuly = !state.updatedSuccessfuly;
  },
  getsettingsError(state, error) {
    state.isLoadSettings = false;
    state.Error = error;
    state.settings = null;
  }
};

const actions = {
  getSettings({ commit }, payload) {
    commit("getSettingsStarted");
    const settings = get_settings()
    
      settings.then(res => res.data)
      .then(res => {
        if (res.status) {
          commit("getSettingsSuccess", res.data);
        } else {
          commit("getSettingsError", "error:getSettings");
        }
      });
  },
  updateSettings({ commit }, payload) {
    const id = payload.id;
    const value = payload.value;
    const update = update_setting({id, value})
    update.then(res => {
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
