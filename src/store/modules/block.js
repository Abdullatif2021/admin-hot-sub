import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import {
  get_blocks,
  get_block,
  create_block,
  update_block,
  delete_block,
  get_images,
  create_image,
  delete_image,
  get_files,
  create_file,
  delete_file,
  get_meta,
  create_meta,
  update_meta,
  delete_meta,
  get_metaType,
  get_videos,
  create_video,
  delete_video,
  get_youtube,
  create_youtube,
  update_youtube,
  delete_youtube,
  get_categories,
  get_categoryType,
  get_category,
  create_category,
  update_category,
  get_categoryMeta,
  create_categoryMeta,
  update_categoryMeta,
  delete_categoryMeta
} from '../../plugins/services/block'
const state = {
  blocks: null,
  _paginations: null,
  block: null,
  blockCategories: null,
  _Error: "",
  isLoadBlock: true,
  blockImageList: null,
  successAddBlockImage: null,
  blockMetaList: null,
  updateMetaBlock: null,
  blockMetaTypeList: null,
  blockFileList: null,
  successAddBlockFile: null,
  blockVideosList: null,
  successAddBlockVideo: null,
  blockYoutubeVideosList: null,
  successAddBlockYoutubeVideo: null,
  successDeleteBlock: null,
  category_paginate: null,
  UpdateBlockCategory: null,
  processing: false,
  Block_Categories: null,
  createBlockSuccess: null,
  blockCategory: null,
  create_block_category_success: null,
  blockCategorymetadata: null,
  blockCategoryTypes: null,
  updateBlockBasicData: null,
  successUpdateBlockCategoryMeta: null,
  create_block_category_meta_success: null,
  errorAddBlockVideo: null,
  wrongYoutubeurl: null,
  blockCategoryId: null
};

const getters = {
  // general
  _blockError: state => state._Error,
  _blockPaginations: state => state._paginations,
  _blocks: state => state.blocks,
  _isBLoad: state => state.processing,
  _isBLoadAttach: state => state.processing,
  _isLoadBlockMeta: state => state.processing,
  _updateBlockBasicData: state => state.updateBlockBasicData,
  _block: state => state.block,
  _Block_Categories: state => state.Block_Categories,
  _blockCategories: state => state.blockCategories,
  _block_category_paginate: state => state.category_paginate,
  _successDeleteBlock: state => state.successDeleteBlock,
  _isLoadBlock: state => state.processing,
  _successUpdateBlockCategory: state => state.UpdateBlockCategory,
  _blockCategory: state => state.blockCategory,
  _create_block_category_success: state => state.create_block_category_success,
  _blockCategoryTypes: state => state.blockCategoryTypes,
  _createBlockSuccess: state => state.createBlockSuccess,
  // images
  _blockImageList: state => state.blockImageList,
  _successAddBlockImage: state => state.successAddBlockImage,
  // meta
  _blockMetaList: state => state.blockMetaList,
  _updateMetaBlock: state => state.updateMetaBlock,
  _blockMetaTypeList: state => state.blockMetaTypeList,
  // file
  _blockFileList: state => state.blockFileList,
  _blockCategoryId: state => state.blockCategoryId,
  _sccussCreateBlockFile: state => state.successAddBlockFile,
  // videos
  _blockVideosList: state => state.blockVideosList,
  _successAddBlockVideo: state => state.successAddBlockVideo,
  _errorAddBlockVideo: state => state.errorAddBlockVideo,
  // youtube
  _blockYoutubeVideosList: state => state.blockYoutubeVideosList,
  _successAddBlockYoutubeVideo: state => state.successAddBlockYoutubeVideo,
  _BwrongYoutubeurl: state => state.wrongYoutubeurl,
  // block category metaData
  _blockCategoryMeta: state => state.blockCategorymetadata,
  _isLoadBlockCategoryMeta: state => state.processing,
  _updateblockCategoryMetaSuccess: state =>
    state.successUpdateBlockCategoryMeta,
  _create_block_category_meta_success: state =>
    state.create_block_category_meta_success
};

const mutations = {
  //  general
  getBlocksSuccess(state, blocks) {
    state.blocks = blocks.data;
  },
  getPaginationsSuccess(state, data) {
    state._paginations = data;
  },
  setProcessing(state, payload) {
    state.processing = payload;
  },
  updateBlockBasicData(state, payload) {
    state.updateBlockBasicData = payload;
  },
  getBlockSuccess(state, block) {
    state.block = block;
  },
  getBlockError(state, error) {
    state._Error = error;
    state.blocks = null;
    state.block = null;
  },
  get_BlockCategories(state, payload) {
    state.blockCategories = payload.data;
    state.category_paginate = payload;
  },
  // image
  getBlockImageListStarted(state, payload) {
    state.blockImageList = null;
  },
  getBlockImageList(state, payload) {
    state.blockImageList = payload.data;
  },
  successAddBlockImage(state, payload) {
    state.successAddBlockImage = payload;
  },
  deleteBlock(state, payload) {
    state.successDeleteBlock = payload;
  },

  // metaData
  getBlockMetaList(state, payload) {
    state.blockMetaList = payload.data;
  },
  updateMetaBlockSuccess(state, payload) {
    state.updateMetaBlock = payload.data;
  },
  getBlockMetaTypeList(state, payload) {
    state.blockMetaTypeList = payload.data;
  },

  // files
  getBlockFileListStarted(state, payload) {
    state.blockFileList = null;
  },
  getBlockFileList(state, payload) {
    state.blockFileList = payload.data;
  },
  successAddBlockFile(state, payload) {
    state.successAddBlockFile = payload;
  },
  /* videos */
  getBlockVideosListStarted(state, payload) {
    state.blockVideosList = null;
  },
  getBlockVideosList(state, payload) {
    state.blockVideosList = payload.data;
  },
  successAddBlockVideo(state, payload) {
    state.successAddBlockVideo = payload;
  },
  errorAddBlockVideo(state, payload) {
    state.errorAddBlockVideo = payload;
  },
  /* youtube */
  getBlockYoutubeVideosListStarted(state, payload) {
    state.blockYoutubeVideosList = null;
  },
  getBlockYoutubeVideosList(state, payload) {
    state.blockYoutubeVideosList = payload.data;
  },
  successAddBlockYoutubeVideo(state, payload) {
    state.successAddBlockYoutubeVideo = payload;
  },
  successUpdateBlockCategory(state, payload) {
    state.UpdateBlockCategory = payload;
  },
  getBlockCategory(state, payload) {
    state.blockCategory = payload;
  },
  create_block_category_success(state, payload) {
    state.create_block_category_success = payload;
  },
  createBlockSuccess(state, payload) {
    state.createBlockSuccess = payload;
  },
  getBlockCategoryTypes(state, payload) {
    state.blockCategoryTypes = payload;
  },
  wrongYoutubeurl(state, payload) {
    state.wrongYoutubeurl = payload;
  },
  // category metaData
  updateblockCategoryMetaSuccess(state, payload) {
    state.successUpdateBlockCategoryMeta = payload;
  },
  getBlockCategorymetadata(state, payload) {
    state.blockCategorymetadata = payload;
  },
  create_block_category_meta_success(state, payload) {
    state.create_block_category_meta_success = payload;
  },
  delete_block_category_meta_success(state, payload) {
    state.delete_block_category_meta_success = payload;
  },
  get_Block_Categories(state, data) {
    state.Block_Categories = data.data;
  },
  blockCategoryId(state, payload) {
    state.blockCategoryId = payload;
  }
};

const actions = {
  // -------------------- general block ---------------------
  getBlocksList ({ commit }, payload) {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    const blocks = get_blocks({
      order_dir: payload.dir,
      keyword: payload.search,
      order_by: payload.order_by,
      limit: payload.limit,
      block_category_id: payload.block_category_id,
      page: payload.page
    })
      blocks.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getBlocksSuccess", res.data);
          commit("getPaginationsSuccess", res.data);
        }
      })
      .catch(error => {
        commit("getBlockError", error);
      });
  },

  getBlock({ commit }, payload) {
    const blockId = payload.id;
    const block = get_block(blockId)
    block
      .then(res => res.data)
      .then(res => {
        if (res.status) {
          commit("getBlockSuccess", res.data);
        }
      })
      .catch(error => {
        commit("getBlockError", error);
      });
  },
  createBlock({ commit, dispatch }, payload) {
    const formData = new FormData();
    
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    Object.entries(payload.data).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    
    if (payload.file !== null) {
      formData.append("file", payload.file);
    }
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    const createBlock = create_block(formData)
    createBlock.then(res => {
      if (res.status === 201) {
        commit("createBlockSuccess", res);
      }
    });
  },
  updateBlockData({ commit, dispatch }, payload) {
    const id = payload.id;

    const formData = new FormData();
    Object.entries(payload.data).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    if (payload.file !== null) {
      formData.append("file", payload.file);
    }
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    formData.append("_method", "PUT");
    const updateBlock = update_block({id, formData});
    updateBlock.then(res => {
      if (res.status === 200) {
        dispatch("getBlock", { id });
        commit("updateBlockBasicData", res);
      }
    });
  },
  deleteBlock({ commit, dispatch }, payload) {
    const id = payload.blockId;
    const deleteBlock = delete_block(id)
    deleteBlock.then(res => {
      if (res.status === 200) {
        commit("deleteBlock", res);
      }
    });
  },

  // -------------------------- block images ------------------------------
  getBlockImageList({ commit }, payload) {
    commit("getBlockImageListStarted");
    const id = payload.id;
    const images = get_images(id)
    images.then(res => {
      commit("getBlockImageList", res.data);
    });
  },
  createBlockImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.image) {
      formData.append("path", payload.image);
    }
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    const createBlock = create_image({id, formData})
    createBlock.then(res => {
      if (res.status === 201) {
        commit("successAddBlockImage", res.data.data);
        dispatch("getBlockImageList", { id });
      }
    });
  },
  deleteBlockImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.attachment_id;
    const deleteImage = delete_image({id, attachment_id})
    deleteImage.then(res => {
      if (res.status === 200) {
        dispatch("getBlockImageList", { id });
      }
    });
  },

  // --------------------files---------------------------
  getBlockFileList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const files = get_files(id)
    files.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockFileList", res.data);
      });
  },
  createBlockFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.file) {
      formData.append("path", payload.file);
    }
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    const createFile = create_file({id, formData});
    createFile.then(res => {
      if (res.status === 201) {
        commit("successAddBlockFile", res.data.data);
        dispatch("getBlockFileList", { id });
      }
    });
  },
  deleteBlockFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.file_id;
    const deleteFile = delete_file({id, attachment_id})
    deleteFile.then(res => {
      if (res.status === 200) {
        dispatch("getBlockFileList", { id });
      }
    });
  },

  // ------------------------- meta data --------------------
  getBlockMetaList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const metaData = get_meta(id)
   
      metaData.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockMetaList", res.data);
      });
  },

  createBlockMeta({ commit, dispatch }, payload) {
    const id = payload.blockId;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    const createMeta = create_meta({id, formData});
    createMeta.then(res => {
      if (res.status === 201 || res.status === 200) {
        dispatch("getBlockMetaList", { id });
        commit("updateMetaBlockSuccess", res);
      }
    });
  },
  updateBlockMeta({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.blockId;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    formData.append("_method", "PUT");
    const updateMeta = update_meta({id,metadata_id, formData})
    
      updateMeta.then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getBlockMetaList", { id });
          commit("updateMetaBlockSuccess", res);
        }
      });
  },
  deleteBlockMeta({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.blockId;
    const deleteMeta = delete_meta({id, metadata_id});
    deleteMeta.then(res => {
      dispatch("getBlockMetaList", { id });
    });
  },
  getBlockMetaTypeList({ commit }, payload) {
    const metaType = get_metaType();
    metaType.then(res => {
      commit("getBlockMetaTypeList", res.data);
    });
  },

  // ********************* blocks videos ***************************
  getBlockVideosList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const videos = get_videos(id);
   
      videos.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockVideosList", res.data);
      });
  },
  createBlockVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.video) {
      formData.append("path", payload.video);
    }
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    const createvideo = create_video({id, formData});
    
      createvideo.then(res => {
        if (res.status === 201) {
          commit("successAddBlockVideo", res.data.data);
          dispatch("getBlockVideosList", { id });
        }
      })
      .catch(err => {
        commit("errorAddBlockVideo", err);
      });
  },
  deleteBlockVideo({ commit, dispatch }, payload) {
    const id = payload.blockId;
    const attachment_id = payload.file_id;
    const deleteVideo = delete_video({id, attachment_id}) 
    deleteVideo.then(res => {
      if (res.status === 200) {
        dispatch("getBlockVideosList", { id });
      }
    });
  },

  // ############### youtube ##################
  getBlockYoutubeVideoList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const youtubes = get_youtube(id)
    
      youtubes.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockYoutubeVideosList", res.data);
      });
  },
  createBlockYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("path", payload.path);
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    const createYouTube = create_youtube({id, formData});
   
      createYouTube.then(res => {
        if (res.status === 201) {
          commit("successAddBlockYoutubeVideo", res.data.data);
          dispatch("getBlockYoutubeVideoList", { id });
        }
      })
      .catch(err => {
        commit("wrongYoutubeurl", err);
      });
  },
  updateBlockYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.attachment_id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    formData.append("_method", "PUT");
    formData.append("path", payload.path);
    const updateYouTube = update_youtube({id, attachment_id, formData})
    
      updateYouTube.then(res => {
        if (res.status === 201 || res.status === 200) {
          commit("successAddBlockYoutubeVideo", res.data.data);
          dispatch("getBlockYoutubeVideoList", { id });
        }
      });
  },
  deleteBlockYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.blockId;
    const attachment_id = payload.youtube_id;
    const deleteYoutube = delete_youtube({id, attachment_id})
    
    deleteYoutube.then(res => {
        if (res.status === 200) {
          dispatch("getBlockYoutubeVideoList", { id });
        }
      });
  },
  // ++++++++++++++++++++ Block Categories Managment +++++++++++++++++++++++
  getBlockCategories ({ commit }, payload)  {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    const blockCategories = get_categories({
      order_dir: payload.dir,
      keyword: payload.search,
      order_by: payload.order_by,
      limit: payload.limit,
      page: payload.page
    })
    
    blockCategories
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("get_BlockCategories", res.data);
      });
  },
  getBlock_Categories({ commit }, payload) {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    localStorage.removeItem("blockCategories");
    const blockCategories = get_categories({
      order_dir: payload.dir,
      keyword: payload.search,
      order_by: payload.order_by,
      limit: payload.limit,
      page: payload.page
    })
    
    blockCategories
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("get_Block_Categories", res.data);
        localStorage.setItem("blockCategories", JSON.stringify(res.data.data));
      });
  },
  getBlockCategory ({ commit }, payload) {
    const id = payload.id;
    commit("setProcessing", false);

      const category = get_category(id);
      
      category.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockCategory", res.data.data);
      });
  },
  createBlockCategory ({ commit }, payload) {
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    formData.append(`type`, payload.type);
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    const createCategory = create_category(formData);
    createCategory.then(res => {
      commit("create_block_category_success", res.data.data);
    });
  },
  updateBlockCategory ({ commit }, payload) {
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el._name}[name]`, el.name);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    formData.append(`type`, payload.type);
    // Object.entries(payload.info).forEach(entry => {
    //   const [key, value] = entry;
    //   if (value != null) {
    //     formData.append(key, value);
    //   }
    // });
    formData.append("_method", "PUT");
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    console.log(formData);
    const updateCategory = update_category({id, formData});
    updateCategory
      .then(res => {
        commit("successUpdateBlockCategory", res.data.data);
      });
  },
  getBlockCategoryTypes ({ commit }, payload) {
    commit("setProcessing", false);

   const types = get_categoryType()
      
      types.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getBlockCategoryTypes", res.data.data);
        }
      });
  },
  // $$$$$$$$$$$$ category metadata $$$$$$$$$$
  getBlockCategoryMetadata ({ commit }, payload) {
    const id = payload.id;
    commit("setProcessing", false);

    const metaCategory = get_categoryMeta(id)
      
      metaCategory.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockCategorymetadata", res.data.data);
      });
  },
  createBlockCategoryMetadata({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    const createCateMeta = create_categoryMeta({id, formData})
    
      createCateMeta.then(res => {
        if (res.status === 201 || res.status === 200) {
          dispatch("getBlockCategoryMetadata", { id });
          commit("create_block_category_meta_success", res);
        }
      });
  },
  updateBlockCategoryMeta({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    formData.append("_method", "PUT");
    const updateCateMeta = update_categoryMeta({id, metadata_id, formData})
    
     
    updateCateMeta.then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getBlockCategoryMetadata", { id });
          commit("updateblockCategoryMetaSuccess", res);
          commit("create_block_category_meta_success", res);
        }
      });
  },
  deleteBlockCategoryMetadata ({ commit, dispatch },payload){
    const id = payload.id;
    const metadata_id = payload.metadata_id;
    const deleteCateMeta = delete_categoryMeta({id, metadata_id})
    deleteCateMeta
      .then(res => {
        dispatch("getBlockCategoryMetadata", { id });
      });
  },

  setCategoryId({ commit, dispatch }, payload) {
    commit("blockCategoryId", payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
