import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import router from "../../router";
import { adminRoot } from "../../constants/config";

const state = {
  isLoadAuctions: true,
  paginations: null,
  auctions: null,
  created_Successfuly: null,
  updated_Successfuly: null,
  Error: "",
  auction: null,
  successDeleteAuction: null,
  processing: false,
  cities: null,
  isCustomValueCreated: false,
  auctionSide: null,
  auctionOwner: null,
  areas: null,
  File_List: null,
  create_File: null,
  deleteAuctionError: null,
  updateReviewRequest: false,
  delete_File: null,
  Image_List: null,
  create_Image: null,
  auctionReviewRequests: null,
  delete_Image: null,
  date_error: false
};

const getters = {
  isLoadAuctions: state => state.isLoadAuctions,
  auctionError: state => state.Error,
  auction_paginations: state => state.paginations,
  _auctionReviewRequests: state => state.auctionReviewRequests,
  auctions: state => state.auctions,
  _cities: state => state.cities,
  _File_List: state => state.File_List,
  _updateReviewRequest: state => state.updateReviewRequest,
  _isCustomValueCreated: state => state.isCustomValueCreated,
  _createAuctionFile: state => state.create_File,
  _deleteAuctionFile: state => state.delete_File,
  _Image_List: state => state.Image_List,
  _createAuctionImage: state => state.create_Image,
  _deleteAuctionImage: state => state.delete_Image,
  _areas: state => state.areas,
  _auctionSide: state => state.auctionSide,
  _deleteAuctionError: state => state.deleteAuctionError,
  _auctionOwner: state => state.auctionOwner,
  auction: state => state.auction,
  _isLoadAuctions: state => state.processing,
  _updatedAuctionSuccessfuly: state => state.updated_Successfuly,
  _createAuctionSuccessfuly: state => state.created_Successfuly,
  _successDeleteAuction: state => state.successDeleteAuction,
  _dateError: state => state.date_error
};

const mutations = {
  getAuctionsSuccess(state, auctions) {
    state.auctions = auctions.data;
    state.paginations = auctions;
  },
  setProcessing(state, payload) {
    state.processing = payload;
  },
  getAuctionSuccess(state, data) {
    state.auction = data.data;
  },
  updatedAuctionSuccessfuly(state, data) {
    state.updated_Successfuly = data;
  },
  createAuctionSuccessfuly(state, data) {
    state.created_Successfuly = data;
  },
  getAuctionsError(state, error) {
    state.Error = error;
    state.auctions = null;
  },
  deleteAuction(state, payload) {
    state.successDeleteAuction = payload;
  },
  getCities(state, payload) {
    state.cities = payload;
  },
  getAreas(state, payload) {
    state.areas = payload;
  },
  getAuctionSide(state, payload) {
    state.auctionSide = payload;
  },
  getAuctionOwner(state, payload) {
    state.auctionOwner = payload;
  },
  getAuctionFileList(state, payload) {
    state.File_List = payload;
  },
  createAuctionCustomValue(state, payload) {
    state.isCustomValueCreated = !state.isCustomValueCreated;
  },
  createAuctionFile(state, payload) {
    state.create_File = payload;
  },
  deleteAuctionFile(state, payload) {
    state.delete_File = payload;
  },
  getAuctionImageList(state, payload) {
    state.Image_List = payload;
  },
  deleteAuctionError(state, payload) {
    state.deleteAuctionError = payload;
  },
  createAuctionImage(state, payload) {
    state.create_Image = payload;
  },
  deleteAuctionImage(state, payload) {
    state.delete_Image = payload;
  },
  dateError(state, payload) {
    state.date_error = !state.date_error;
  },
  getAuctionReviewRequests(state, payload) {
    state.auctionReviewRequests = payload;
  },
  updateReviewRequest(state, payload) {
    state.updateReviewRequest = !state.updateReviewRequest;
  }
};

const actions = {
  getAuctions: async ({ commit }, payload) => {
    commit("setProcessing", payload.sorting ? payload.sorting : false);

    await axios
      .get(`${apiUrl}/auctions`, {
        params: {
          order_dir: payload.dir,
          keyword: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page,
          auction_type: payload.auctionType
        }
      })
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getAuctionsSuccess", res.data);
        } else {
          commit("getAuctionsError", "error:getAuctions");
        }
      });
  },
  getAuction({ commit, dispatch }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    axios
      .get(`${apiUrl}/auctions/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getAuctionSuccess", res.data);
      });
  },
  createAuction({ commit, dispatch }, payload) {
    const formData = new FormData();
    payload.langs.forEach(el => {
      formData.append(`${el._name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });

    if (payload.brochure != null) {
      formData.append("brochure", payload.brochure);
    }
    if (payload.image != null) {
      formData.append("image", payload.image);
    }
    if (payload.terms_conditions != null) {
      formData.append("terms_conditions", payload.terms_conditions);
    }
    commit("setProcessing", false);
    axios
      .post(`${apiUrl}/auctions`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("createAuctionSuccessfuly", res);
          dispatch("getCustomFieldList", { id: res.data.data.category_id });
        } else {
        }
      })
      .catch(error => {
        commit("dateError");
      });
  },
  updateAuction({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    payload.langs.forEach(el => {
      formData.append(`${el._name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    if (payload.brochure != null) {
      formData.append("brochure", payload.brochure);
    }
    if (payload.image != null) {
      formData.append("image", payload.image);
    }
    if (payload.terms_conditions != null) {
      formData.append("terms_conditions", payload.terms_conditions);
    }

    formData.append("_method", "PUT");
    axios.post(`${apiUrl}/auctions/${id}`, formData, {}).then(res => {
      if (res.status === 200) {
        commit("updatedAuctionSuccessfuly", res);
      }
    });
  },
  updateAuctionStatus({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("active", payload.active);
    formData.append("_method", "PUT");
    axios.post(`${apiUrl}/auctions/${id}`, formData, {}).then(res => {
      if (res.status === 200) {
        commit("updatedAuctionSuccessfuly", res);
      }
    });
  },
  deleteAuction({ commit, dispatch }, payload) {
    const id = payload.Id;
    axios.delete(`${apiUrl}/auctions/${id}`).then(res => {
      if (res.data.status === 200) {
        commit("deleteAuction", res);
      } else if (res.data.status === 400) {
        commit("deleteAuctionError", res);
      }
    });
  },
  getAuctionSide({ commit, dispatch }, payload) {
    axios.get(`${apiUrl}/auctions/sides`).then(res => {
      if (res.status === 200) {
        commit("getAuctionSide", res.data.data);
      }
    });
  },
  getAuctionOwner({ commit, dispatch }, payload) {
    axios.get(`${apiUrl}/auctions/owners`).then(res => {
      if (res.status === 200) {
        commit("getAuctionOwner", res.data.data);
      }
    });
  },

  getCities({ commit, dispatch }, payload) {
    const area_id = payload.area_id;
    axios
      .get(`${apiUrl}/cities`, {
        params: {
          area_id: area_id
        }
      })
      .then(res => {
        if (res.status === 200) {
          commit("getCities", res.data.data);
        }
      })
      .catch(err => {});
  },
  getAreas({ commit, dispatch }, payload) {
    const country_id = payload.country_id;
    axios
      .get(`${apiUrl}/areas`, {
        params: {
          country_id: country_id
        }
      })
      .then(res => {
        if (res.status === 200) {
          commit("getAreas", res.data.data);
        }
      })
      .catch(err => {});
  },
  getAuctionFiles({ commit, dispatch }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    axios
      .get(`${apiUrl}/auctions/files/${id}`)
      .then(res => {
        commit("setProcessing", true);
        // commit("getAuctionFileList", res.data.data);
        return res;
      })
      .then(res => {
        commit("getAuctionFileList", res.data.data);
      })
      .catch(err => {});
  },
  createAuctionFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("path", payload.path);
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    axios
      .post(`${apiUrl}/auctions/files/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("createAuctionFile", res.data.data);
          dispatch("getAuctionFiles", { id });
        }
      })
      .catch(err => {});
  },
  deleteAuctionFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const fileId = payload.fileId;
    axios
      .delete(`${apiUrl}/auctions/files/${id}/${fileId}`)
      .then(res => {
        if (res.status === 200) {
          commit("deleteAuctionFile", res.data.data);
          dispatch("getAuctionFiles", { id });
        }
      })
      .catch(err => {});
  },
  // &&&&&&&&&&&&&&&&&& IMAGES &&&&&&&&&&&&&
  getAuctionImages({ commit, dispatch }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    axios
      .get(`${apiUrl}/auctions/images/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getAuctionImageList", res.data.data);
      })
      .catch(err => {});
  },
  createAuctionImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("path", payload.path);
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    axios
      .post(`${apiUrl}/auctions/images/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("createAuctionImage", res.data.data);
          dispatch("getAuctionImages", { id });
        }
      })
      .catch(err => {});
  },
  deleteAuctionImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const imgId = payload.imgId;
    axios
      .delete(`${apiUrl}/auctions/images/${id}/${imgId}`)
      .then(res => {
        if (res.status === 200) {
          commit("deleteAuctionImage", res.data.data);
          dispatch("getAuctionImages", { id });
        }
      })
      .catch(err => {});
  },
  createCustomValue({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    const langs = localStorage.getItem("Languages");

    JSON.parse(langs).forEach(el => {
      formData.append(`${el.name}[value]`, payload.info.value);
    });
    if (payload.info.unit) {
      JSON.parse(langs).forEach(el => {
        formData.append(`${el.name}[unit]`, payload.info.unit);
      });
    }

    formData.append(`auction_id`, payload.auction_id);
    axios
      .post(`${apiUrl}/categories/additional/${id}`, formData, {})
      .then(res => {
        if (res.status === 200) {
          commit("createAuctionCustomValue", res.data.data);
          // dispatch("getAuctionImages", { id });
          console.log("hi from valueeeeeeeeee");
        }
      })
      .catch(err => {});
  },
  updateCustomValue({ commit, dispatch }, payload) {
    const custom_id = payload.custom_id;
    const value_id = payload.value_id;

    const formData = new FormData();
    formData.append(`_method`, "PUT");
    const langs = localStorage.getItem("Languages");
    JSON.parse(langs).forEach(el => {
      formData.append(
        `${el.name}[value]`,
        payload.info.values[0].locales.en.value
      );
    });
    if (payload.info.unit) {
      JSON.parse(langs).forEach(el => {
        formData.append(
          `${el.name}[unit]`,
          payload.info.values[0].locales.en.unit
        );
      });
    }
    axios
      .post(
        `${apiUrl}/categories/additional/${custom_id}/${value_id}`,
        formData,
        {}
      )
      .then(res => {
        if (res.status === 200) {
          commit("createAuctionCustomValue", res.data.data);
          // dispatch("getAuctionImages", { id });
          console.log("hi from valueeeeeeeeee");
        }
      })
      .catch(err => {});
  },
  getReviewRequests({ commit }, payload) {
    commit("setProcessing", false);
    const auction_id = payload.auction_id;
    axios
      .get(`${apiUrl}/auctions/preview`, {
        params: {
          auction_id: auction_id
        }
      })
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getAuctionReviewRequests", res.data.data);
      })
      .catch(err => {});
  },
  updateReviewRequest({ commit }, payload) {
    const request_id = payload.request_id;
    const formData = new FormData();
    formData.append(`_method`, "PUT");
    formData.append(`status`, payload.val);
    axios
      .post(`${apiUrl}/auctions/preview/${request_id}`, formData, {})
      .then(res => {
        if (res.status === 200) {
          commit("updateReviewRequest");
        }
      })
      .catch(err => {});
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
