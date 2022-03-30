import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import { currentUser, isAuthGuardActive } from "../../constants/config";
import {
  setCurrentUser,
  getAccessToken,
  setAccessToken,
  getCurrentUser,
  getCurrentLanguage
} from "../../utils";
import { apiUrl, Headers, locale } from "../../constants/config";
export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : currentUser,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,

    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null;
    },
    setLogout(state) {
      state.currentUser = null;
      state.processing = false;
      state.loginError = null;
    },
    setProcessing(state, payload) {
      state.processing = payload;
      state.loginError = null;
    },
    setError(state, payload) {
      state.loginError = payload;
      state.currentUser = null;
      state.processing = false;
    },
    setForgotMailSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.forgotMailSuccess = true;
    },
    setResetPasswordSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.resetPasswordSuccess = true;
    },
    clearError(state) {
      state.loginError = null;
    }
  },
  actions: {
    login({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      axios
        .post(`${apiUrl}/auth`, {
          email: payload.email,
          password: payload.password
        })
        .then(
          res => {
            let accessToken = res.data.access_token;
            setAccessToken(accessToken);
            if (res.status) {
              axios
                .get(`${apiUrl}/auth/user`, {
                  headers: {
                    Authorization: "Bearer " + accessToken,
                    locale: localStorage.getItem("currentLanguage")
                  }
                })
                .then(res => {
                  if (res.status) {
                    setCurrentUser(res.data.data);
                    commit("setUser", res.data.data);
                  } else {
                    commit("getItemError", "error:getItem");
                  }
                });
            }
          },
          err => {
            setCurrentUser(null);
            commit("setError", err.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
    },

    changePreferLocale(locale) {
      console.log("time out is running");

      axios
        .put(
          `${apiUrl}/users/prefer_locale`,
          {
            prefer_locale: locale
          },
          {
            headers: {
              Authorization: "Bearer " + getAccessToken(),
              locale: getCurrentLanguage()
            }
          }
        )

        .then(
          () => {
            console.log("done");
          },
          _error => {}
        );
    },

    signOut({ commit }) {
      axios
        .post(
          `${apiUrl}/auth/logout`,
          {},
          {
            headers: {
              Authorization: "Bearer " + getAccessToken(),
              locale: getCurrentLanguage()
            }
          }
        )

        .then(
          () => {
            localStorage.clear();
            commit("setLogout");
          },
          _error => {}
        );
    }
  }
};
