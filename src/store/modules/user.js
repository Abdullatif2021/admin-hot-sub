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
import {
  login_user,
  get_user,
  get_users,
  create_user,
  update_user,
  delete_user,
  change_locale,
  active_user,
  reset_password,
  get_userInfo,
  phone_confirm,
  verfiy_ident,
  get_userAttach,
  verfiy_attach,
  send_note,
  update_info,
  verfiy_transaction,
  forgot_password,
  sign_out,
  refresh_token,
  get_countries,
  get_nationalities,
  update_attach,
  add_attach,
  get_attachCategory,
  get_userWallet,
  get_userTransaction,
  get_userDeposit
} from "../../plugins/services/user"



export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : currentUser,
    loginError: null,
    processing: false,
    loginProcessing: false,
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
    _loginProcessing: state => state.loginProcessing,
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
    setLoginProcessing(state, payload) {
      state.loginProcessing = payload;
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
      state.successActivateUser = payload.data.data;
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
      commit("setLoginProcessing", true);
      const login = login_user({
        username: payload.email,
        password: payload.password
      })
      login
        .then(res => {
          let refreshToken = res.data.data.refresh_token;
          let accessToken = res.data.data.access_token;
          setTokens(accessToken, refreshToken);

          if (res.status) {
            const user = get_user();
            user.then(res => {
              console.log('resssssssssss',res)
              if (res.status) {
                setCurrentUser(res.data.data);
                commit("setUser", res.data.data);
                dispatch("setLang", { locale: res.data.data.prefer_locale });
                res.data.data.prefer_locale === "ar"
                  ? setDirection("rtl")
                  : setDirection("ltr");

                commit("setLoginProcessing", false);
              } else {
                commit("getItemError", "error:getItem");
              }
            });
          }
        })
        .catch(error => {
          setCurrentUser(null);
          commit("setLoginProcessing", false);

          commit("setError", error.message);
        });
    },
    getUsersList ({ commit }, payload) {
      commit("setProcessing", payload.sorting ? payload.sorting : false);
      const userList = get_users({
        admin_type: payload.type,
        role: payload.role,
        order_dir: payload.dir,
        keyword: payload.search,
        order_by: payload.order_by,
        limit: payload.limit,
        page: payload.page
      })
    
        userList.then(res => {
          commit("setProcessing", true);
          return res;
        })
        .then(res => {
          commit("setUsersList", res.data);
        });
    },
    createUser({ commit }, payload) {
      const type = payload.type;
      const createUser = create_user(payload.user)
      
        createUser.then(res => {
          if (res.status === 201) {
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
      const locale =  change_locale({prefer_locale: payload.locale})
      locale.then(res => {
          if (res.status === 200) {
            commit("updatePreferLocale", res);
          }
        });
    },
    activateUser({ commit }, payload) {
      const id = payload.id;
      const active = payload.active;
      const activate = active_user({id, active})
        activate.then(res => {
          if (res.status === 200) {
            commit("successActivateUser", res);
          }
        });
    },
    resetPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      const resetPassword = reset_password({
        token: payload.token,
        email: payload.email,
        password: payload.newPassword,
        password_confirmation: payload.password_confirmation
      })
  
        resetPassword
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
      const userInfo = get_userInfo({
        id: userId
      })
        userInfo
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
      const phoneConfirm = phone_confirm(userId)
        phoneConfirm.then(res => {
          commit("phoneVerification", res.data);
        });
    },
    identityConfirm({ commit }, payload) {
      const userId = payload.userId;
      const identityVerification = verfiy_ident(userId)
      identityVerification.then(res => {
          commit("identityVerification", res.data);
        });
    },
    getUserAttach({ commit }, payload) {
      commit("setAttachProcessing", false);
      const userId = payload.id;
      const getUserAttach = get_userAttach(userId)
      getUserAttach.then(res => {
          commit("setAttachProcessing", true);
          return res;
        })
        .then(res => {
          commit("setUserAttach", res.data.data);
        });
    },
    verfiyAttach({ commit }, payload) {
      const id = payload.id;
      const verfiyAttach = verfiy_attach(id);
        verfiyAttach.then(res => {
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
        if (value != null) {
          formData.append(key, value);
        }
      });
      const attachNote = send_note(formData)
      attachNote.then(res => {
          if (res.status === 200) {
            commit("sendNoteSuccess", res.data.data);
          }
        });
    },
    updateUserProfile({ commit }, payload) {
      const formData = new FormData();
      Object.entries(payload).forEach(entry => {
        const [key, value] = entry;
        if (value != null) {
          formData.append(key, value);
        }
      });
      const updateUser = update_user(formData)
      updateUser
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
      const user = payload.user
      const type = payload.type;
      const updateInfo = update_info({id, user})
      
        updateInfo.then(res => {
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
      const type = payload.type;
      const verfiyTransaction = verfiy_transaction({id,type})
      verfiyTransaction.then(res => {
          commit("verfiytransaction", res.data.data);
        });
    },
    forgotPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      const email = payload.email
      const forgetPassword = forgot_password(email)
      forgetPassword.then(
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
      const signOut = sign_out();

      
        signOut.then(res => {
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
      const refresh = refresh_token(localStorage.getItem("refreshToken"))
      
        refresh.then(
        
          res => {
            let refreshToken = res.data.data.refresh_token;
            let accessToken = res.data.data.access_token;
            setTokens(accessToken, refreshToken);
          },
          _error => {
            router.push("/");
            localStorage.clear();
          }
        );
    },
    getCountries({ commit }) {
      const countries = get_countries()
      countries.then(res => {
        commit("getCountries", res.data.data);
      });
    },
    getNationalities() {
      const nationalities = get_nationalities()
      // https://alqias-api.lilacdev.com/public/api/countries/getcountry
    },
    updateAttachment({ commit }, payload) {
      const attachment_id = payload.attachment_id;
      const userId = payload.userId;
      const formData = new FormData();
      Object.entries(payload).forEach(entry => {
        const [key, value] = entry;
        if (value != null) {
          formData.append(key, value);
        }
      });
      const updateAttachment = update_attach({attachment_id, formData})
      updateAttachment.then(res => {
          if (res.status === 200) {
            commit("updateAttachSuccess", res);
          }
        })
        .catch(err => {});
    },
    addAttachment({ commit }, payload) {
      const userId = payload.userId;
      const formData = new FormData();
      Object.entries(payload).forEach(entry => {
        const [key, value] = entry;
        if (value != null) {
          formData.append(key, value);
        }
      });
      const addAttachment = add_attach({userId, formData})
      addAttachment.then(res => {
          if (res.status === 201) {
            commit("addAttachSuccess", res);
          } else {
            commit("createAttachError", res);
          }
        })
        .catch(function(error) {
          commit("createAttachError", error);
        });
    },
    getAttachCategory({ commit }, payload) {
      const getAttachCategory = get_attachCategory()
      getAttachCategory.then(res => {
        commit("getAttachCategory", res.data.data);
      });
    },
    // ************** WALLET ****************
    getUserWallet({ commit }, payload) {
      const userId = payload.userId;
      const userWallet = get_userWallet(userId)
      userWallet.then(res => {
          commit("userWallet", res.data.data[0]);
        });
    },
    getUserTransactions({ commit }, payload) {
      const userId = payload.userId;
      const userTransactions = get_userTransaction({
        user_id: userId,
        payment_status: payload.payment_status,
        payment_method: payload.payment_method,
        type: payload.type
      })  
     

        userTransactions.then(res => {
          commit("userTransactions", res.data.data);
        });
    },
    getUserDeposits({ commit }, payload) {
      const userId = payload.userId;
      const userDeposit = get_userDeposit(userId)
      

        .then(res => {
          commit("userDeposit", res.data.data);
        });
    }
    //  *************** owners **************
    
  }
};
