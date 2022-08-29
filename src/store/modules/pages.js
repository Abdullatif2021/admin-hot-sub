import axios from "../../plugins/axios";
import { apiUrl, adminRoot } from "../../constants/config";
import router from "../../router";
import {
  get_pages,
  get_page,
  create_page,
  update_page,
  delete_page,
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
 
 
} from '../../plugins/services/page'
const state = {
  isLoadPages: true,
  pagesPaginations: null,
  Pages: null,
  updatedSuccessfuly: false,
  _Error: "",
  metaTypeList: null,
  successAddPageImage: null,
  successAddPageFile: null,
  page: null,
  pageImageList: null,
  pageFileList: null,
  metaList: null,
  updateMetaPage: false,
  pageVideosList: null,
  successAddPageVideo: null,
  pageYoutubeVideosList: null,
  successAddPageYoutubeVideo: null,
  successDeletePage: null,
  isLoadMeta: true,
  processing: false,
  wrongYoutubeurl: null,
  updatePageDetailsSuccess: null
};

const getters = {
  // general
  _isLoadPages: state => state.processing,
  _isLoadPage: state => state.processing,
  is_LoadMeta: state => state.processing,
  _PagesError: state => state._Error,
  _pagesPaginations: state => state.pagesPaginations,
  _Pages: state => state.Pages,
  _page: state => state.page,
  _successDeletePage: state => state.successDeletePage,
  _updatePageDetailsSuccess: state => state.updatePageDetailsSuccess,
  // meta
  _metaList: state => state.metaList,
  _updateMetaPage: state => state.updateMetaPage,
  _pageMetaTypeList: state => state.metaTypeList,
  // images
  _pageImageList: state => state.pageImageList,
  _sccussCreatePageImage: state => state.successAddPageImage,
  // file
  _pageFileList: state => state.pageFileList,
  _sccussCreateFile: state => state.successAddPageFile,
  // videos
  _pageVideosList: state => state.pageVideosList,
  _successAddPageVideo: state => state.successAddPageVideo,
  _isLoadAttach: state => state.processing,

  // youtube
  _pageYoutubeVideosList: state => state.pageYoutubeVideosList,
  _successAddPageYoutubeVideo: state => state.successAddPageYoutubeVideo,
  _wrongYoutubeurl: state => state.wrongYoutubeurl
};

const mutations = {
  // general page
  getPagesListStarted(state) {
    state.isLoadPages = true;
    state.Pages = [];
  },
  getPagesListEnded(state) {
    state.isLoadPages = false;
  },
  getPagesSuccess(state, payload) {
    state.isLoadPages = false;
    state.Pages = payload.data;
    state.pagesPaginations = payload;
  },
  getPageSuccess(state, payload) {
    state.page = payload.data;
  },
  setProcessing(state, payload) {
    state.processing = payload;
  },
  updatedSuccessfuly(state) {
    state.updatedSuccessfuly = true;
  },
  getPagesError(state, error) {
    state.isLoadPages = false;
    state.PagesError = error;
    state.Pages = null;
  },
  deletePage(state, payload) {
    state.successDeletePage = payload;
  },
  // metaData
  getmetaStarted(state, payload) {
    state.isLoadMeta = true;
  },
  getMetaList(state, payload) {
    state.metaList = payload.data;
  },
  getmetaEnded(state, payload) {
    state.isLoadMeta = false;
  },
  updateMetaPageSuccess(state, payload) {
    state.updateMetaPage = !state.updateMetaPage;
  },
  getMetaTypeList(state, payload) {
    state.metaTypeList = payload.data;
  },
  // page image
  getPageImageListStarted(state, payload) {
    state.pageImageList = null;
  },
  getPageImageList(state, payload) {
    state.pageImageList = payload.data;
  },
  successAddPageImage(state, payload) {
    state.successAddPageImage = payload;
  },
  // page files
  getPageFileListStarted(state, payload) {
    state.pageFileList = null;
  },
  getPageFileList(state, payload) {
    state.pageFileList = payload.data;
  },
  successAddPageFile(state, payload) {
    state.successAddPageFile = payload;
  },
  /* page videos */
  getPageVideosListStarted(state, payload) {
    state.pageVideosList = null;
  },
  getPageVideosList(state, payload) {
    state.pageVideosList = payload.data;
  },
  successAddPageVideo(state, payload) {
    state.successAddPageVideo = payload;
  },
  /* youtube */
  getPageYoutubeVideosListStarted(state, payload) {
    state.pageYoutubeVideosList = null;
  },
  getPageYoutubeVideosList(state, payload) {
    state.pageYoutubeVideosList = payload.data;
  },
  successAddPageYoutubeVideo(state, payload) {
    state.successAddPageYoutubeVideo = payload;
  },
  updatePageDetails(state, payload) {
    state.updatePageDetailsSuccess = payload;
  },
  wrongYoutubeurl(state, payload) {
    state.wrongYoutubeurl = payload;
  }
};

const actions = {
  // -------------------- general page ---------------------
  getPagesList({ commit }, payload) {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    const pages = get_pages({
      type: payload.role,
      order_dir: payload.dir,
      keyword: payload.search,
      order_by: payload.order_by,
      limit: payload.limit,
      page: payload.page
    })
   pages
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getPagesSuccess", res.data);
      });
  },
  getPage({ commit }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    const page = get_page(id);
    page
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getPageSuccess", res.data);
      });
  },
  updatePageData({ commit, dispatch }, payload) {
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
      formData.append("image", payload.file);
    }
    formData.append("_method", "PUT");
    const updatePage = update_page({id, formData});
    updatePage.then(res => {
      if (res.status === 200) {
        dispatch("getPage", { id });
        commit("updatePageDetails", res);
      }
    });
  },
  deletePage({ commit, dispatch }, payload) {
    const id = payload.pageId;
    const deletePage = delete_page(id);
    deletePage.then(res => {
      if (res.status === 200) {
        commit("deletePage", res);
      }
    });
  },

  // -------------------------- page images ------------------------------
  getPageImageList({ commit }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    const images = get_images(id)
    images.then(res => {
      commit("setProcessing", true);
      return res;
    }).then(res => {
      commit("getPageImageList", res.data);
    });
  },
  createPageImage({ commit, dispatch }, payload) {
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
    const createPage = create_image({id, formData})
    createPage.then(res => {
      if (res.status === 201) {
        commit("successAddPageImage", res.data.data);
        dispatch("getPageImageList", { id });
      }
    });
  },
  deletePageImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.attachment_id;
    const deleteImage = delete_image({id, attachment_id})
    deleteImage.then(res => {
      if (res.status === 200) {
        dispatch("getPageImageList", { id });
      }
    });
  },
 

  // --------------------files---------------------------
 
  getPageFileList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const files = get_files(id)
    files.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getPageFileList", res.data);
      });
  },
  createPageFile({ commit, dispatch }, payload) {
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
        commit("successAddPageFile", res.data.data);
        dispatch("getPageFileList", { id });
      }
    });
  },
  deletePageFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.file_id;
    const deleteFile = delete_file({id, attachment_id})
    deleteFile.then(res => {
      if (res.status === 200) {
        dispatch("getPageFileList", { id });
      }
    });
  },

  // ------------------------- meta data --------------------
  getMetaList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const metaData = get_meta(id)
   
      metaData.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getMetaList", res.data);
      });
  },
  createMetaPage({ commit, dispatch }, payload) {
    commit("getmetaStarted");

    const id = payload.pageId;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    const createMeta = create_meta({id, formData});
    createMeta.then(res => {
      commit("getmetaEnded");
      return res;
    }).then(res => {
      if (res.status === 201 || res.status === 200) {
        dispatch("getMetaList", { id });
          commit("updateMetaPageSuccess");
      }
    });
  },
  updateMetaPage({ commit, dispatch }, payload) {
    commit("getmetaStarted");

    const metadata_id = payload.metadata_id;
    const id = payload.pageId;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[meta_content]`, el.content);
    });
    formData.append(`meta_type_id`, payload.meta_type_id);
    formData.append("_method", "PUT");
    const updateMeta = update_meta({id,metadata_id, formData})
    
      updateMeta.then(res => {
        commit("getmetaEnded");
        return res;
      }).then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getMetaList", { id });
          commit("updateMetaPageSuccess", res);
        }
      });
  },
  deleteMetaPage({ commit, dispatch }, payload) {
    commit("getmetaStarted");

    const metadata_id = payload.metadata_id;
    const id = payload.pageId;
    const deleteMeta = delete_meta({id, metadata_id});
    deleteMeta.then(res => {
      commit("getmetaEnded");
      return res;
    }).then(res => {
      dispatch("getMetaList", { id });
    });
  },
  getMetaTypeList({ commit }, payload) {
    const metaType = get_metaType();
    metaType.then(res => {
      commit("getMetaTypeList", res.data);
    });
  },

  // ********************* page videos ***************************
  getPageVideosList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const videos = get_videos(id);
   
      videos.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getPageVideosList", res.data);
      });
  },
  createPageVideo({ commit, dispatch }, payload) {
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
          commit("successAddPageVideo", res.data.data);
          dispatch("getPageVideosList", { id });
        }
      })
      .catch(err => {
        commit("errorAddPageVideo", err);
      });
  },
  deletePageVideo({ commit, dispatch }, payload) {
    const id = payload.PageId;
    const attachment_id = payload.file_id;
    const deleteVideo = delete_video({id, attachment_id}) 
    deleteVideo.then(res => {
      if (res.status === 200) {
        dispatch("getPageVideosList", { id });
      }
    });
  },
  // ############### youtube ##################
  getPageYoutubeVideoList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    const youtubes = get_youtube(id)
    
      youtubes.then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getPageYoutubeVideosList", res.data);
      });
  },
  createPageYoutubeVideo({ commit, dispatch }, payload) {
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
          commit("successAddPageYoutubeVideo", res.data.data);
          dispatch("getPageYoutubeVideoList", { id });
        }
      })
      .catch(err => {
        commit("wrongYoutubeurl", err);
      });
  },
  updatePageYoutubeVideo({ commit, dispatch }, payload) {
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
          commit("successAddPageYoutubeVideo", res.data.data);
          dispatch("getPageYoutubeVideoList", { id });
        }
      });
  },
  deletePageYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.pageId;
    const attachment_id = payload.youtube_id;
    const deleteYoutube = delete_youtube({id, attachment_id})
    
    deleteYoutube.then(res => {
        if (res.status === 200) {
          dispatch("getPageYoutubeVideoList", { id });
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
