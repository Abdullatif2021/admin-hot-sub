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
  getLanguages,
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
    UserAttach: null,
    AttachProcessing: false,
    resetPasswordSuccess: null,
    preferLocale: null,
    successActivateUser: null,
    updatedProfile: null,
    verfiedAtachmet: null,
    AttachCategory: null,
    verfiy_transaction: null,
    updateUser_Info: null,
    emailErr: null,
    phoneVerification: null,
    createAttachError: null,
    updateAttachSuccess: null,
    userTransactions: null,
    userDeposit: null,
    get_Countries: null,
    sendNoteSuccess: null,
    userWallet: null,
    addAttachSuccess: null,
    identityVerification: null
  },
  getters: {
    currentUser: state => state.currentUser,
    ListActions: state => state.ListActions,
    UserInfo: state => state.UserInfo,
    _getCountries: state => state.get_Countries,
    _AttachProcessing: state => state.AttachProcessing,
    _phoneVerification: state => state.phoneVerification,
    _identityVerification: state => state.identityVerification,
    _UserAttach: state => state.UserAttach,
    _verfiyTransaction: state => state.verfiy_transaction,
    _userDeposit: state => state.userDeposit,
    _userTransactions: state => state.userTransactions,
    _userWallet: state => state.userWallet,
    _createAttachError: state => state.createAttachError,
    _addAttachSuccess: state => state.addAttachSuccess,
    _AttachCategory: state => state.AttachCategory,
    _sendNoteSuccess: state => state.sendNoteSuccess,
    usersList: state => state.usersList,
    _verfiedAtachmet: state => state.verfiedAtachmet,
    _updateAttachSuccess: state => state.updateAttachSuccess,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
    _preferLocale: state => state.preferLocale,
    _successActivateUser: state => state.successActivateUser,
    _updatedProfileSuccessfuly: state => state.updatedProfile,
    _updateUserInfo: state => state.updateUser_Info,
    _emailErr: state => state.emailErr
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = true;
      state.loginError = null;
    },
    updatedProfile(state, payload) {
      state.updatedProfile = payload;
    },
    setUserInfo(state, payload) {
      state.UserInfo = payload;
    },
    setUserAttach(state, payload) {
      state.UserAttach = payload;
    },
    setUsersList(state, payload) {
      state.usersList = payload.data;
      state.ListActions = payload;
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
    setAttachProcessing(state, payload) {
      state.AttachProcessing = payload;
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
    addAttachSuccess(state, payload) {
      state.addAttachSuccess = payload;
    },
    getCountries(state, payload) {
      state.get_Countries = payload;
    },
    successActivateUser(state, payload) {
      state.successActivateUser = payload;
    },
    clearError(state) {
      state.loginError = null;
    },
    updatePreferLocale(state, payload) {
      state.preferLocale = payload;
    },
    update_UserInfo(state, payload) {
      state.updateUser_Info = payload;
    },
    getAttachCategory(state, payload) {
      state.AttachCategory = payload;
    },
    emailErr(state, payload) {
      state.emailErr = payload;
    },
    sendNoteSuccess(state, payload) {
      state.sendNoteSuccess = payload;
    },
    verfiedAtachmet(state, payload) {
      state.verfiedAtachmet = payload;
    },
    updateAttachSuccess(state, payload) {
      state.updateAttachSuccess = payload;
    },
    createAttachError(state, payload) {
      state.createAttachError = payload;
    },
    phoneVerification(state, payload) {
      state.phoneVerification = payload;
    },
    identityVerification(state, payload) {
      state.identityVerification = payload;
    },
    //  &&&&&&&&&&&&&&&&& wallet &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    userWallet(state, payload) {
      state.userWallet = payload;
    },
    userTransactions(state, payload) {
      state.userTransactions = payload;
    },
    userDeposit(state, payload) {
      state.userDeposit = payload;
    },
    verfiytransaction(state, payload) {
      state.verfiy_transaction = payload;
    }
  },
  actions: {
    login({ commit, dispatch }, payload) {
      commit("clearError");
      commit("setProcessing", true);

      axios
        .post(`${apiUrl}/auth`, {
          username: payload.email,
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
                getLanguages();
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
        });
    },
    getUsersList: async ({ commit }, payload) => {
      commit("setProcessing", payload.sorting ? payload.sorting : false);
      await axios
        .get(`${apiUrl}/users`, {
          params: {
            admin_type: payload.type,
            role: payload.role,
            order_dir: payload.dir,
            first_name: payload.search,
            order_by: payload.order_by,
            limit: payload.limit,
            page: payload.page
          }
        })
        .then(res => {
          commit("setProcessing", true);
          return res;
        })
        .then(res => {
          commit("setUsersList", res.data);
        });
    },
    createUser({ commit }, payload) {
      const type = payload.type;

      axios
        .post(`${apiUrl}/users`, payload.user)
        .then(res => {
          if (res.status === 201) {
            console.log("create");
            commit("update_UserInfo", res);
          }
          return res;
        })
        .then(res => {
          router.push(`${adminRoot}/${type}`);
        })
        .catch(err => {
          commit("emailErr", err);
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

    activateUser({ commit }, payload) {
      const id = payload.id;
      axios
        .put(
          `${apiUrl}/users/${id}`,
          {
            active: payload.active
          },
          {}
        )
        .then(res => {
          if (res.status === 200) {
            commit("successActivateUser", res);
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
          }
        );
    },
    getUserInfo({ commit }, payload) {
      commit("setProcessing", false);
      const userId = payload.id;
      axios
        .get(`${apiUrl}/users`, {
          params: {
            id: userId
          }
        })
        .then(res => {
          commit("setProcessing", true);
          return res;
        })
        .then(res => {
          commit("setUserInfo", res.data.data[0]);
        });
    },
    phoneConfirm({ commit }, payload) {
      const userId = payload.userId;
      axios
        .post(`${apiUrl}/verifyMobileByAdmin/${userId}`, {})

        .then(res => {
          commit("phoneVerification", res.data.data[0]);
        });
    },
    identityConfirm({ commit }, payload) {
      const userId = payload.userId;
      axios
        .post(`${apiUrl}/accountVerification/${userId}`, {})

        .then(res => {
          commit("identityVerification", res.data.data[0]);
        });
    },
    getUserAttach({ commit }, payload) {
      commit("setAttachProcessing", false);
      const userId = payload.id;
      axios
        .get(`${apiUrl}/user/attachments/all?user_id=${userId}`)
        .then(res => {
          commit("setAttachProcessing", true);
          return res;
        })
        .then(res => {
          commit("setUserAttach", res.data.data);
        });
    },
    verfiyAttach({ commit }, payload) {
      const id = payload.id;
      axios
        .post(`${apiUrl}/user/attachments/verfiy/${id}`)
        .then(res => {
          return res;
        })
        .then(res => {
          commit("verfiedAtachmet", res.data.data);
        });
    },
    sendAttachmentNote({ commit, dispatch }, payload) {
      const formData = new FormData();
      Object.entries(payload).forEach(entry => {
        const [key, value] = entry;
        formData.append(key, value);
      });
      axios
        .post(`${apiUrl}/user/attachments/report`, formData, {})
        .then(res => {
          commit("sendNoteSuccess", res.data.data);
        });
    },
    updateUserProfile({ commit }, payload) {
      const formData = new FormData();
      Object.entries(payload).forEach(entry => {
        const [key, value] = entry;
        formData.append(key, value);
      });
      axios
        .post(`${apiUrl}/auth`, formData, {})
        .then(res => {
          if (res.status === 200) {
            commit("updatedProfile", res);
          }
          return res;
        })
        .then(res => {
          setCurrentUser(res.data.data);
          commit("setUser", res.data.data);
        });
    },
    updateUserInfo({ commit }, payload) {
      commit("clearError");
      const id = payload.id;
      const type = payload.type;
      axios
        .put(`${apiUrl}/users/${id}`, payload.user, {})
        .then(res => {
          console.log("updateUserInfo", res);
          if (res.status === 200) {
            commit("update_UserInfo", res);
          }
          return res;
        })
        .then(res => {
          router.push(`${adminRoot}/${type}`);
        });
    },
    verfiyTransaction({ commit }, payload) {
      const id = payload.id;

      axios
        .post(
          `${apiUrl}/wallet/transactions/verfiy/${id}`,
          {
            payment_status: payload.type
          },
          {}
        )
        .then(res => {
          commit("verfiytransaction", res.data.data);
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
          }
        );
    },
    signOut({ commit }) {
      axios
        .post(`${apiUrl}/auth/logout`)
        .then(res => {
          localStorage.removeItem("accessToken");

          localStorage.removeItem("refreshToken");
          router.push("/");
          commit("setLogout");
          return res;
        })
        .then(res => {
          localStorage.removeItem("currentUser");
        });
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
    },
    getCountries({ commit }) {
      axios.get(`${apiUrl}/countries`).then(res => {
        console.log("wsefwsefsefsefsefsefsef", res);
        commit("getCountries", res.data.data);
      });
    },
    getNationalities() {
      // https://alqias-api.lilacdev.com/public/api/countries/getcountry
    },
    updateAttachment({ commit }, payload) {
      const attachment_id = payload.attachment_id;
      const userId = payload.userId;
      const formData = new FormData();
      Object.entries(payload).forEach(entry => {
        const [key, value] = entry;
        formData.append(key, value);
      });
      axios
        .post(
          `${apiUrl}/user/attachments/${attachment_id}/${userId}`,
          formData,
          {}
        )
        .then(res => {
          if (res.status === 200) {
            commit("updateAttachSuccess", res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addAttachment({ commit }, payload) {
      const userId = payload.userId;
      const formData = new FormData();
      Object.entries(payload).forEach(entry => {
        const [key, value] = entry;
        formData.append(key, value);
      });
      axios
        .post(`${apiUrl}/user/attachments/${userId}`, formData, {})
        .then(res => {
          if (res.status === 201) {
            commit("addAttachSuccess", res);
          } else {
            console.log(res);
            commit("createAttachError", res);
          }
        })
        .catch(function(error) {
          commit("createAttachError", error);
        });
    },
    getAttachCategory({ commit }, payload) {
      axios.get(`${apiUrl}/user/attachments/categories`).then(res => {
        commit("getAttachCategory", res.data.data);
      });
    },
    // ************** WALLET ****************
    getUserWallet({ commit }, payload) {
      const userId = payload.userId;
      axios
        .get(`${apiUrl}/wallet`, {
          params: {
            owner_id: userId
          }
        })
        .then(res => {
          commit("userWallet", res.data.data[0]);
        });
    },
    getUserTransactions({ commit }, payload) {
      const userId = payload.userId;
      axios
        .get(`${apiUrl}/wallet/transactions`, {
          params: {
            user_id: userId,
            payment_status: payload.payment_status,
            payment_method: payload.payment_method,
            type: payload.type
          }
        })

        .then(res => {
          commit("userTransactions", res.data.data);
        });
    },
    getUserDeposits({ commit }, payload) {
      const userId = payload.userId;
      axios
        .get(`${apiUrl}/deposit`, {
          params: {
            user_id: userId
          }
        })

        .then(res => {
          commit("userDeposit", res.data.data);
        });
    }
  }
};
