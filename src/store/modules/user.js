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
  getCurrentLanguage,
  setDirection
} from "../../utils";
import { adminRoot } from "../../constants/config";
import { apiUrl, Headers, locale } from "../../constants/config";
export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : currentUser,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    usersList: null,
    ListActions: null,
    UserInfo: null,
    resetPasswordSuccess: null,
    preferLocale: null,
    successDeleteUser: null,
    updatedProfile: null
  },
  getters: {
    currentUser: state => state.currentUser,
    ListActions: state => state.ListActions,
    UserInfo: state => state.UserInfo,
    usersList: state => state.usersList,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
    _preferLocale: state => state.preferLocale,
    _successDeleteUser: state => state.successDeleteUser,
    _updatedProfileSuccessfuly: state => state.updatedProfile
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null;
    },
    updatedProfile(state, payload) {
      state.updatedProfile = payload;
    },
    setUserInfo(state, payload) {
      state.UserInfo = payload;
      state.processing = false;
    },
    setUsersList(state, payload) {
      state.usersList = payload.data;
      state.ListActions = payload;
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
    successDeleteUser(state, payload) {
      state.successDeleteUser = payload;
    },
    clearError(state) {
      state.loginError = null;
    },
    updatePreferLocale(state, payload) {
      state.preferLocale = payload;
    }
  },
  actions: {
    login({ commit, dispatch }, payload) {
      commit("clearError");
      commit("setProcessing", true);

      axios
        .post(`${apiUrl}/auth`, {
          email: payload.email,
          password: payload.password
        })
        .then(res => {
          let refreshToken = res.data.refresh_token;
          let accessToken = res.data.access_token;
          setTokens(accessToken, refreshToken);

          if (res.status) {
            axios.get(`${apiUrl}/auth/user`).then(res => {
              if (res.status) {
                setCurrentUser(res.data.data);
                commit("setUser", res.data.data);
                dispatch("setLang", { locale: res.data.data.prefer_locale });
                res.data.data.prefer_locale === "ar"
                  ? setDirection("rtl")
                  : setDirection("ltr");

                commit("setProcessing", false);
              } else {
                commit("getItemError", "error:getItem");
              }
            });
          }
        })
        .catch(error => {
          console.log("hi from catch", error);
          setCurrentUser(null);
          commit("setProcessing", false);

          commit("setError", error.message);
          setTimeout(() => {
            commit("clearError");
          }, 3000);
        });
    },
    getUsersList({ commit }, payload) {
      commit("setProcessing", true);
      axios
        .get(`${apiUrl}/users`, {
          params: {
            role: payload.role,
            order_dir: payload.dir,
            first_name: payload.search,
            order_by: payload.order_by,
            limit: payload.limit,
            page: payload.page
          }
        })
        .then(res => {
          commit("setUsersList", res.data);
        });
    },
    createUser({ commit }, payload) {
      axios
        .post(`${apiUrl}/users`, {
          first_name: payload.info.firstname,
          last_name: payload.info.lastname,
          phone_number: payload.info.phonenumber,
          email: payload.info.email,
          role: payload.role,
          password: payload.pass
        })
        .then(res => {
          if (res.status === 201) {
            router.push(`${adminRoot}/users`);
          }
        });
    },
    changePreferLocale({ commit }, payload) {
      axios
        .put(`${apiUrl}/users/prefer_locale`, {
          prefer_locale: payload.locale
        })
        .then(res => {
          if (res.status === 200) {
            commit("updatePreferLocale", res);
          }
        });
    },
    deleteUser({ commit }, payload) {
      const id = payload.userId;
      axios.delete(`${apiUrl}/users/${id}`).then(res => {
        if (res.status === 200) {
          commit("successDeleteUser", res);
        }
      });
    },
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
    getUserInfo({ commit }, payload) {
      const userId = payload.id;
      commit("clearError");
      commit("setProcessing", true);
      commit("setUserInfo", null);
      axios
        .get(`${apiUrl}/users`, {
          params: {
            id: userId
          }
        })
        .then(res => {
          commit("setUserInfo", res.data.data[0]);
        });
    },
    updateUserProfile({ commit }, payload) {
      const formData = new FormData();
      if (payload.file) {
        formData.append("image", payload.file);
      }
      formData.append("first_name", payload.user.first_name);
      formData.append("last_name", payload.user.last_name);
      formData.append("email", payload.user.email);
      formData.append("phone_number", payload.user.phone_number);
      formData.append("dob", payload.dob);
      formData.append("gender", payload.user.gender);
      formData.append("_method", "PUT");
      axios.post(`${apiUrl}/auth`, formData, {}).then(res => {
        if (res.status === 200) {
          setCurrentUser(res.data.data);
          commit("setUser", res.data.data);
          commit("updatedProfile", res);
        }
      });
    },
    updateUserInfo({ commit }, payload) {
      commit("clearError");
      const id = payload.id;
      axios
        .put(
          `${apiUrl}/users/${id}`,
          {
            first_name: payload.info.firstname,
            last_name: payload.info.lastname,
            phone_number: payload.info.phonenumber,
            email: payload.info.email,
            role: payload.role,
            active: payload.info.active
          },
          {}
        )
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            router.push(`${adminRoot}/users`);
          }
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
          localStorage.removeItem("accessToken");
          setTimeout(() => {
            console.log("timed out");
            localStorage.removeItem("currentUser");
          }, 1000);
          localStorage.removeItem("refreshToken");
          router.push("/");
          commit("setLogout");
        },
        _error => {}
      );
    },
    refreshToken() {
      axios
        .post(`${apiUrl}/auth/refresh_token`, {
          refresh_token: localStorage.getItem("refreshToken")
        })
        .then(
          res => {
            // response.status === 401
            let refreshToken = res.data.refresh_token;
            let accessToken = res.data.access_token;
            setTokens(accessToken, refreshToken);
          },
          _error => {
            console.log(_error);
            router.push("/");
            localStorage.clear();
          }
        );
    }
  }
};
