import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import router from "../../router";
import { adminRoot } from "../../constants/config";
import {
  get_categoeries,
  get_category,
  create_category,
  update_category,
  delete_category,
  active_category,
  get_metadata,
  create_meta,
  update_meta,
  delete_meta,
  get_metaType,
  get_subCategories,
  get_subCategory,
  create_subCategory,
  update_subCategory,
  delete_subCategory

} from "../../plugins/services/categories"
const state = {
  paginations: null,
  categories: null,
  updated_Successfuly: null,
  Error: "",
  category: null,
  successDeleteCategory: null,
  successActiveCategory: null,
  processing: false,
  customProcessing: false,
  create_category_success: null,
  error: false,
  successUpdateCategory: null,
  Categorymetadata: null,
  successUpdateCategoryMeta: null,
  create_category_meta_success: null,
  categoryMetaTypeList: null,
  getSubCategorySuccess: null,
  updateCustomField: null,
  subCategories: null,
  successDeleteSubCategory: null,
  customFields: null,
  create_customField: null,
  successDeleteCustom: null,
  successCreateSubCategory: null,
  successUpdateSubCategory: null
};

const getters = {
  _isLoadCategories: state => state.processing,
  _isLoadCustomField: state => state.customProcessing,
  cateError: state => state.Error,
  _subCategories: state => state.subCategories,
  _isLoadSubCategory: state => state.processing,
  cate_paginations: state => state.paginations,
  _customFields: state => state.customFields,
  categories: state => state.categories,
  _createCustomField: state => state.create_customField,
  _successDeleteCustomField: state => state.successDeleteCustom,
  _category: state => state.category,
  _getSubCategorySuccess: state => state.getSubCategorySuccess,
  _updateCustomField: state => state.updateCustomField,
  _create_category_success: state => state.create_category_success,
  _updatedCategorySuccessfuly: state => state.updated_Successfuly,
  _successDeleteCategory: state => state.successDeleteCategory,
  _successDeleteSubCategory: state => state.successDeleteSubCategory,
  _successActiveCategory: state => state.successActiveCategory,
  _successUpdateCategory: state => state.successUpdateCategory,
  _successCreateSubCategory: state => state.successCreateSubCategory,
  _successUpdateSubCategory: state => state.successUpdateSubCategory,
  _categoryMetaTypeList: state => state.categoryMetaTypeList,
  _error: state => state.error,
  // block category metaData
  _CategoryMeta: state => state.Categorymetadata,
  _isLoadCategoryMeta: state => state.processing,
  _updateCategoryMetaSuccess: state => state.successUpdateCategoryMeta,
  _create_category_meta_success: state => state.create_category_meta_success
};

const mutations = {
  getCategoriesSuccess(state, categories) {
    state.categories = categories.data;
    state.paginations = categories;
  },
  getSubCategoriesSuccess(state, subCategories) {
    state.subCategories = subCategories.data;
  },
  setProcessing(state, payload) {
    state.processing = payload;
  },
  setCustomProcessing(state, payload) {
    state.customProcessing = payload;
  },
  getCategorySuccess(state, data) {
    state.category = data.data;
  },

  updatedCategorySuccessfuly(state, data) {
    state.updated_Successfuly = data;
  },
  getCategoriesError(state, error) {
    state.Error = error;
    state.categories = null;
  },
  deleteCategory(state, payload) {
    state.successDeleteCategory = payload;
  },
  activeCategory(state, payload) {
    state.successActiveCategory = payload;
  },
  create_category_success(state, payload) {
    state.create_category_success = payload;
  },
  successUpdateCategory(state, payload) {
    state.successUpdateCategory = payload;
  },

  // category metaData
  updateCategoryMetaSuccess(state, payload) {
    state.successUpdateCategoryMeta = payload;
  },
  getCategorymetadata(state, payload) {
    state.Categorymetadata = payload;
  },
  create_category_meta_success(state, payload) {
    state.create_category_meta_success = payload;
  },
  delete__category_meta_success(state, payload) {
    state.delete_category_meta_success = payload;
  },
  getCategoryMetaTypeList(state, payload) {
    state.categoryMetaTypeList = payload.data;
  },
  getCustomFields(state, data) {
    state.customFields = data;
  },
  createCustomField(state, payload) {
    state.create_customField = payload;
  },
  updateCustomField(state, payload) {
    state.updateCustomField = payload;
  },
  deleteCustomField(state, payload) {
    state.successDeleteCustom = payload;
  },
  deleteSubCategory(state, payload) {
    state.successDeleteSubCategory = payload;
  },
  createSubCategory(state, payload) {
    state.successCreateSubCategory = payload;
  },
  updateSubCategory(state, payload) {
    state.successUpdateSubCategory = payload;
  },
  getSubCategorySuccess(state, payload) {
    state.getSubCategorySuccess = payload;
  },
  error(state, payload) {
    state.error = !state.error;
  }
};

const actions = {
  getCategories ({ commit }, payload) {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    const categories = get_categoeries({ category: 1,
      order_dir: payload.dir,
      keyword: payload.search,
      order_by: payload.order_by,
      limit: payload.limit,
      page: payload.page
    })
    categories
      .then(res => {
        commit("setProcessing", true);
        return res;
      })

      .then(res => {
        if (res.status === 200) {
          commit("getCategoriesSuccess", res.data);
        }
      });
  },
  getCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    const category = get_category(id);
    category
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getCategorySuccess", res.data);
      });
  },
  createCategory({ commit, dispatch }, payload) {
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    if (payload.image !== null) {
      formData.append("image", payload.image);   
    }
    if (payload.icon) {
      formData.append(`icon`, payload.icon);
    }
    const createCategory = create_category(formData)
    createCategory.then(res => {
      if (res.status === 201) {
        commit("create_category_success", res);
      }
    });
  },
  updateCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    formData.append("_method", "PUT");
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    const updateCategory = update_category({id, formData})
    updateCategory.then(res => {
      if (res.status === 200) {
        commit("successUpdateCategory", res.data.data);
      }
    });
  },
  deleteCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    const deleteCategory = delete_category(id)
    deleteCategory.then(res => {
      if (res.status === 200) {
        commit("deleteCategory", res);
      }
    });
  },
  categoryActivate({ commit, dispatch }, payload) {
    const id = payload.id;
    const active = payload.active;

  
    const categoryActivate = active_category({id, active})
 
      categoryActivate.then(res => {
        if (res.status === 200) {
          commit("activeCategory", res);
        }
      });
  },
  // $$$$$$$$$$$$ category metadata $$$$$$$$$$
  getCategoryMetadata ({ commit }, payload) {
    const id = payload.id;
    commit("setProcessing", false);
    const getMeta = get_metadata(id)
    
      
      getMeta.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getCategorymetadata", res.data.data);
      });
  },
  createCategoryMetadata({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    const createMeta = create_meta({id, formData});
   
      createMeta.then(res => {
        if (res.status === 201 || res.status === 200) {
          dispatch("getCategoryMetadata", { id });
          commit("create_category_meta_success", res);
        }
      });
  },
  updateCategoryMetadata({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    formData.append("_method", "PUT");
    const updateMeta = update_meta({id, metadata_id, formData}) 
  
      updateMeta.then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getCategoryMetadata", { id });
          commit("updateCategoryMetaSuccess", res);
        }
      });
  },
  deleteCategoryMetadata: async ({ commit, dispatch }, payload) => {
    const id = payload.id;
    const metadata_id = payload.metadata_id;
    const deleteMeta = delete_meta({id, metadata_id})
   
      
    deleteMeta.then(res => {
        dispatch("getCategoryMetadata", { id });
      });
  },
  getCategoryMetaTypeList({ commit }, payload) {
    const metaType = get_metaType();
    metaType.then(res => {
      commit("getCategoryMetaTypeList", res.data);
    });
  },
  // %%%%%%%%%%%%%%%%% Sub Category &&&&&&&&&&&&&&&&&&&&&&
  getSubCategories: async ({ commit }, payload) => {
    commit("setProcessing", false);
      const subCategories = get_subCategories({ parent_id: payload.id})
 
      subCategories.then(res => {
        commit("setProcessing", true);
        return res;
      })

      .then(res => {
        if (res.status === 200) {
          commit("getSubCategoriesSuccess", res.data);
        }
      });
  },
  getSubCategory({ commit, dispatch }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    const subCategory = get_subCategory(id)
   
      subCategory.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getSubCategorySuccess", res.data.data);
      });
  },
  createSubCategory: async ({ commit, dispatch }, payload) => {
    commit("setProcessing", false);
    const formData = new FormData();
    const id = payload.id;
    formData.append(`parent_id`, payload.id);
    if (payload.image) {
      formData.append(`image`, payload.image);
    }
    if (payload.icon) {
      formData.append(`icon`, payload.icon);
    }
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    const createSubCategory = create_subCategory(formData);
      
      createSubCategory.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("createSubCategory", res.data.data);
        dispatch("getSubCategories", { id });
      });
  },
  updateSubCategory: async ({ commit, dispatch }, payload) => {
    commit("setProcessing", false);
    const formData = new FormData();
    const sub_id = payload.sub_id;
    const id = payload.id;

    formData.append("_method", "PUT");
    formData.append(`parent_id`, payload.id);
    if (payload.image) {
      formData.append(`image`, payload.image);
    }
    if (payload.icon) {
      formData.append(`icon`, payload.icon);
    }
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    const updateSubCategory = update_subCategory({sub_id, formData})
    
    updateSubCategory
    .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("updateSubCategory", res.data.data);
        dispatch("getSubCategories", { id });
      })
      .catch(res => {
        commit("error");
      });
  },
  deleteSubCategory: async ({ commit, dispatch }, payload) => {
    const id = payload.categoryId;
    const sub_id = payload.sub_id;
    const deleteSubCategory = delete_subCategory({ sub_id , parent_id: payload.categoryId});

      deleteSubCategory.then(res => {
        if (res.status === 200) {
          commit("deleteSubCategory", res.data);
          dispatch("getSubCategories", { id });
        }
      })
      .catch(err => {});
  },
  //  %%%%%%%%%%%%% Custom Feild &&&&&&&&&&&&&&&&&&&&&&&&
  getCustomFieldList({ commit, dispatch }, payload) {
    commit("setCustomProcessing", false);

    const id = payload.id;
    axios
      .get(`${apiUrl}/categories/custom_fields/${id}`)
      .then(res => {
        commit("setCustomProcessing", true);
        return res;
      })
      .then(res => {
        commit("getCustomFields", res.data.data);
      });
  },
  getCustomField({ commit, dispatch }, payload) {},
  createCustomField({ commit, dispatch }, payload) {
    const id = payload.categoryId;
    const formData = new FormData();

    formData.append("type", payload.type);
    payload.info.forEach(el => {
      formData.append(`${el.name}[name]`, el.key);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    axios
      .post(`${apiUrl}/categories/custom_fields/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("createCustomField", res.data.data);
          dispatch("getCustomFieldList", { id: id });
        }
      })
      .catch(err => {});
  },
  updateCustomField({ commit, dispatch }, payload) {
    const id = payload.categoryId;
    const formData = new FormData();
    const custom_id = payload.custom_id;
    formData.append("type", payload.type);
    formData.append("_method", "PUT");

    payload.info.forEach(el => {
      formData.append(`${el.name}[name]`, el.key);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    axios
      .post(
        `${apiUrl}/categories/custom_fields/${id}/${custom_id}`,
        formData,
        {}
      )
      .then(res => {
        if (res.status === 200) {
          commit("updateCustomField", res.data.data);
          dispatch("getCustomFieldList", { id: id });
        }
      })
      .catch(err => {});
  },
  deleteCustomField({ commit, dispatch }, payload) {
    const id = payload.categoryId;
    const custom_id = payload.custom_id;
    axios
      .delete(`${apiUrl}/categories/custom_fields/${id}/${custom_id}`)
      .then(res => {
        if (res.status === 200) {
          commit("deleteCustomField", res);
          dispatch("getCustomFieldList", { id });
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
