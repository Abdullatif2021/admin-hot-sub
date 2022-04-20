import axios from "../../plugins/axios";
import firebase from "firebase/app";
import "firebase/auth";
import { currentUser, isAuthGuardActive } from "../../constants/config";
import router from "../../router";
import {
  setCurrentUser,
  getAccessToken,
  setTokens,
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
    usersList: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,
    usersList: state => state.usersList,
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
    setUsersList(state, payload) {
      state.usersList = payload;
      state.processing = false;
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
            let refreshToken = res.data.refresh_token;
            let accessToken = res.data.access_token;
            setTokens(accessToken, refreshToken);

            if (res.status) {
              axios.get(`${apiUrl}/auth/user`).then(res => {
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
    getUsersList({ commit }, payload) {
      commit("setProcessing", true);
      axios
        .get(`${apiUrl}/users`, {
          params: {
            role: payload.role,
            order_dir: payload.dir
          }
        })
        .then(res => {
          commit("setUsersList", res.data.data);
        });
    },
    // changePreferLocale(locale) {
    //   console.log("time out is running");

    //   axios
    //     .put(`${apiUrl}/users/prefer_locale`, {
    //       prefer_locale: locale
    //     }).then(() => {
    //         console.log("done");
    //       },
    //       _error => {}
    //     );
    // },
    resetPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      axios
        .post(`${apiUrl}/auth/password/forgot`, {
          token: payload.token,
          email: payload.email,
          password: payload.newPassword,
          password_confirmation: payload.password_confirmation
        })
        .then(
          res => {
            console.log(res);
            commit("clearError");
            commit("setResetPasswordSuccess");
          },
          err => {
            commit("setError", err.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
    },
    updateUserInfo(user) {
      formData.append("peeath", this.user);

      axios.put(`${apiUrl}/auth`, {}).then(res => {
        console.log(res);
      });
    },
    forgotPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      axios
        .post(`${apiUrl}/auth/password/forgot`, {
          email: payload.email
        })
        .then(
          res => {
            console.log(res);
            commit("clearError");
            commit("setForgotMailSuccess");
          },
          err => {
            commit("setError", err.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
    },
    signOut({ commit }) {
      axios.post(`${apiUrl}/auth/logout`).then(
        res => {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("currentUser");
          sessionStorage.removeItem("refreshToken");
          router.push("/");
          commit("setLogout");
        },
        _error => {
          console.log("i am error");
        }
      );
    },
    refreshToken() {
      axios
        .post(`${apiUrl}/auth/refresh_token`, {
          refresh_token: sessionStorage.getItem("refreshToken")
        })
        .then(
          res => {
            let refreshToken = res.data.refresh_token;
            let accessToken = res.data.access_token;
            setTokens(accessToken, refreshToken);
          },
          _error => {
            router.push("/");
            sessionStorage.clear();
          }
        );
    }
  }
};
