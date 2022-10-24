import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import {
  get_Auctions,
  get_auction,
  create_auction,
  update_auction,
  delete_auction,
  get_bids,
  get_sides,
  get_owners,
  get_cities,
  get_areas,
  get_files,
  create_file,
  delete_file,
  get_images,
  create_image,
  delete_image,
  create_customVal,
  update_customVal,
  get_requests,
  update_request,
  delete_terms

} from "../../plugins/services/auction"
const state = {
  isLoadAuctions: true,
  paginations: null,
  auctions: null,
  created_Successfuly: null,
  updated_Successfuly: null,
  updated_un_successfuly: null,
  Error: "",
  auctionProducts: null,
  get_reviews: false,
  auction: null,
  successDeleteAuction: null,
  processing: false,
  deleteAuctionterms: null,
  bids: null,
  cities: null,
  isCustomValueCreated: false,
  updatedAuctionMainImageSuccessfuly: false,
  auctionSide: null,
  auctionOwner: null,
  areas: null,
  File_List: null,
  create_File: null,
  deleteAuctionError: null,
  updateReviewRequest: false,
  productsProcessing: false,
  delete_File: null,
  Image_List: null,
  create_Image: null,
  auctionReviewRequests: null,
  delete_Image: null,
  date_error: false,
  Bidsprocessing: false
};

const getters = {
  isLoadAuctions: state => state.isLoadAuctions,
  auctionError: state => state.Error,
  _isLoadAuctionBids: state => state.Bidsprocessing,
  auction_paginations: state => state.paginations,
  _auctionReviewRequests: state => state.auctionReviewRequests,
  auctions: state => state.auctions,
  _bids: state => state.bids,
  _productsProcessing: state => state.productsProcessing,
  _cities: state => state.cities,
  _auctionProducts: state => state.auctionProducts,
  _get_reviews: state => state.get_reviews,
  _File_List: state => state.File_List,
  _updateReviewRequest: state => state.updateReviewRequest,
  _isCustomValueCreated: state => state.isCustomValueCreated,
  _updatedAuctionMainImageSuccessfuly: state => state.updatedAuctionMainImageSuccessfuly,
  _createAuctionFile: state => state.create_File,
  _deleteAuctionFile: state => state.delete_File,
  _updatedAuctionUnSuccessfuly: state => state.updated_un_successfuly,
  _Image_List: state => state.Image_List,
  _createAuctionImage: state => state.create_Image,
  _deleteAuctionImage: state => state.delete_Image,
  _areas: state => state.areas,
  _auctionSide: state => state.auctionSide,
  _deleteAuctionterms: state => state.deleteAuctionterms,
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
  setBidsProcessing(state, payload) {
    state.Bidsprocessing = payload;
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
  getAuctionProductsSuccess(state, payload){
    state.auctionProducts = payload;
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
  deleteAuctionterms(state, payload){
    state.deleteAuctionterms = payload;
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
  updatedAuctionUnSuccessfuly(state, payload){
    state.updated_un_successfuly = payload;
  },
  getAuctionImageList(state, payload) {
    state.Image_List = payload;
  },
  setProductProcessing(state, payload) {
    state.productsProcessing = payload;
  },
  updatedAuctionMainImageSuccessfuly(state, payload) {
    state.updatedAuctionMainImageSuccessfuly = payload;
  },
  deleteAuctionError(state, payload) {
    state.deleteAuctionError = payload;
  },
  getAuctionBidsSuccess(state, payload){
    state.bids = payload;
  },
  get_reviews(state, payload){
    state.get_reviews =  payload
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
  getAuctions({ commit }, payload) {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    const auctions  = get_Auctions({ order_dir: payload.dir,
      keyword: payload.search,
      order_by: payload.order_by,
      limit: payload.limit,
      page: payload.page,
      auction_type: payload.auctionType})
    auctions.then(res => {
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
  getAuctionProducts({ commit }, payload) {
    commit("setProductProcessing", payload.sorting ? payload.sorting : false);
    const auctions  = get_Auctions({ 
      parent_id: 6})
    auctions.then(res => {
            commit("setProductProcessing", true);
            return res;
          })
          .then(res => {
            if (res.status === 200) {
              commit("getAuctionProductsSuccess", res.data.data);
            } else {
              commit("getAuctionsError", "error:getAuctions");
            }
          });
      
   
  },
  getAuction({ commit, dispatch }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const auction = get_auction(id)
  
      auction.then(res => {
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
        if (el.brochure) {
          formData.append(`${el._name}[brochure]`, el.brochure);
        }
        if (el.terms_conditions) {
          formData.append(`${el._name}[terms_conditions]`, el.terms_conditions);
        }
      }
    });
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    Object.entries(payload.location).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    Object.entries(payload.biding).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    if (payload.image != null) {
      formData.append("image", payload.image);
    }
    if(payload.parent_id){
      formData.append("parent_id", payload.parent_id);
    }

    commit("setProcessing", false);
    const createAuction = create_auction(formData);
    // axios
    //   .post(`${apiUrl}/auctions`, formData, {})
    createAuction.then(res => {
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
  createAuctionGroup({ commit, dispatch }, payload) {
    const formData = new FormData();
    payload.langs.forEach(el => {
      formData.append(`${el._name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
        if (el.brochure) {
          formData.append(`${el._name}[brochure]`, el.brochure);
        }
        if (el.terms_conditions) {
          formData.append(`${el._name}[terms_conditions]`, el.terms_conditions);
        }
      }
    });
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    Object.entries(payload.location).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    // Object.entries(payload.biding).forEach(entry => {
    //   const [key, value] = entry;
    //   if (value != null) {
    //     formData.append(key, value);
    //   }
    // });
    if (payload.image != null) {
      formData.append("image", payload.image);
    }

    commit("setProcessing", false);
    const createAuction = create_auction(formData);
    // axios
    //   .post(`${apiUrl}/auctions`, formData, {})
    createAuction.then(res => {
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
    if (payload.langs) {
      payload.langs.forEach(el => {
        formData.append(`${el._name}[title]`, el.title);
        if (el.description) {
          formData.append(`${el._name}[description]`, el.description);
        }
        if (el.brochure) {
          formData.append(`${el._name}[brochure]`, el.brochure);
        }
        if (el.terms_conditions) {
          formData.append(`${el._name}[terms_conditions]`, el.terms_conditions);
        }
      });
    }
    if (payload.info) {
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
  }
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
    const update = update_auction({id, formData});
    update.then(res => {
      if (res.status === 200) {
        commit("updatedAuctionSuccessfuly", res);
      }
    }).catch(error => {
      commit("dateError");
    });
  },
  updateAuctionMainImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("image", payload.img);
    formData.append("_method", "PUT");
    const update_image = update_auction({id, formData});
    update_image.then(res => {
      if (res.status === 200) {
        commit("updatedAuctionMainImageSuccessfuly", res.data.data);
      }
    });
  },
  updateAuctionStatus({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("active", payload.active);
    formData.append("_method", "PUT");
    const update_status =  update_auction({id, formData});
    update_status.then(res => {
      if (res.data.status === 200) {
        commit("updatedAuctionSuccessfuly", res);
      }else {
        commit("updatedAuctionUnSuccessfuly", res);
      }
    });
  },
  deleteTermsBrochure({ commit }, payload) {
    const id = payload.id;
    const type = payload.type;
    const deleteTerms = delete_terms({type, id})
    deleteTerms
      .then(res => {
        if (res.status === 200) {
          commit("deleteAuctionterms", res.data.data);
        }
      })
      .catch(err => {});
  },
  getAuctionBids({ commit }, payload){
    commit("setBidsProcessing", false);

    const auction_id = payload.auction_id;
    const bids = get_bids({
        auction_id: auction_id,
        order_dir: payload.dir,
        keyword: payload.search,
        order_by: payload.order_by,
        limit: payload.limit,
        page: payload.page,
    })
   bids.then(res => {
        commit("setBidsProcessing", true);
        return res;
      })
      .then(res => {
        commit("getAuctionBidsSuccess", res.data);
      });
  },
  deleteAuction({ commit, dispatch }, payload) {
    const id = payload.Id;
    const delete_Auction = delete_auction(id);
    
    delete_Auction.then(res => {
      if (res.data.status === 200) {
        commit("deleteAuction", res);
      } else if (res.data.status === 400) {
        commit("deleteAuctionError", res);
      }
    });
  },
  getAuctionSide({ commit, dispatch }, payload) {
    const sides =  get_sides();
    sides.then(res => {
      if (res.status === 200) {
        commit("getAuctionSide", res.data.data);
      }
    });
  },
  getAuctionOwner({ commit, dispatch }, payload) {
    const owners = get_owners();
    owners.then(res => {
      if (res.status === 200) {
        commit("getAuctionOwner", res.data.data);
      }
    });
  },

  // &&&&&&&&&&&&&&&&&& LOCATION &&&&&&&&&&&&&
  getCities({ commit, dispatch }, payload) {
    const area_id = payload.area_id;
    const cities = get_cities({ area_id: area_id });
   cities
      .then(res => {
        if (res.status === 200) {
          commit("getCities", res.data.data);
        }
      })
      .catch(err => {});
  },
  getAreas({ commit, dispatch }, payload) {
    const country_id = payload.country_id;
    const areas = get_areas({country_id: country_id})
    areas
      .then(res => {
        if (res.status === 200) {
          commit("getAreas", res.data.data);
        }
      })
      .catch(err => {});
  },
  // &&&&&&&&&&&&&&&&&& FILES &&&&&&&&&&&&&
  getAuctionFiles({ commit, dispatch }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    const files = get_files(id)
   files
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
      formData.append(`${el._name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    const createFile = create_file({id, formData})
    createFile
      .then(res => {
        if (res.status === 201) {
          commit("createAuctionFile", res.data.data);
          // dispatch("getAuctionFiles", { id });
        }
      })
      .catch(err => {});
  },
  deleteAuctionFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const fileId = payload.fileId;
    const deleteFile = delete_file({id, fileId});
    deleteFile.then(res => {
        if (res.status === 200) {
          commit("deleteAuctionFile", res.data.data);
        }
      })
      .catch(err => {});
  },
  // &&&&&&&&&&&&&&&&&& IMAGES &&&&&&&&&&&&&
  getAuctionImages({ commit, dispatch }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    const images = get_images(id);
    images
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
      formData.append(`${el._name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    const createImage = create_image({id, formData});
    createImage.then(res => {
        if (res.status === 201) {
          commit("createAuctionImage", res.data.data);
          // dispatch("getAuctionImages", { id });
        }
      })
      .catch(err => {});
  },
  deleteAuctionImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const imgId = payload.imgId;
    const deleteImage = delete_image({id, imgId});
    deleteImage.then(res => {
        if (res.status === 200) {
          commit("deleteAuctionImage", res.data.data);
        }
      })
      .catch(err => {});
  },
  // &&&&&&&&&&&&&&&&&& CUSTOM VALUE &&&&&&&&&&&&&
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
    const createCustomVal = create_customVal({id, formData})

   createCustomVal
      .then(res => {
        if (res.status === 200) {
          commit("createAuctionCustomValue", res.data.data);
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
 const updateCustomval = update_customVal({custom_id, value_id, formData})
 updateCustomval.then(res => {
        if (res.status === 200) {
          commit("createAuctionCustomValue", res.data.data);
          // dispatch("getAuctionImages", { id });
        }
      })
      .catch(err => {});
  },
   // &&&&&&&&&&&&&&&&&& REVIEW REQUEST &&&&&&&&&&&&&
  getReviewRequests({ commit }, payload) {
    commit('get_reviews', false)
    const auction_id = payload.auction_id;
    const requests  = get_requests({auction_id}) 

    requests
      .then(res => {
        commit('get_reviews', true)
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
    const updateRequest = update_request({request_id, formData}) 
   
      updateRequest.then(res => {
        if (res.status === 200) {
          commit("updateReviewRequest");
        }
      })
      .catch(err => {});
  },
 
};

export default {
  state,
  getters,
  mutations,
  actions
};
