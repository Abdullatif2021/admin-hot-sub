import axios from "../../plugins/axios";
import { apiUrl, adminRoot } from "../../constants/config";
import router from "../../router";

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
  isLoadMeta: true
};

const getters = {
  // general
  _isLoadPages: state => state.isLoadPages,
  _isLoadMeta: state => state.isLoadMeta,
  _PagesError: state => state._Error,
  _pagesPaginations: state => state.pagesPaginations,
  _Pages: state => state.Pages,
  _page: state => state.page,
  _successDeletePage: state => state.successDeletePage,

  // meta
  _metaList: state => state.metaList,
  _updateMetaPage: state => state.updateMetaPage,
  _pageMetaTypeList: state => state.metaTypeList,
  // images
  _pageImageList: state => state.pageImageList,
  _sccussCreateImage: state => state.successAddPageImage,
  // file
  _pageFileList: state => state.pageFileList,
  _sccussCreateFile: state => state.successAddPageFile,
  // videos
  _pageVideosList: state => state.pageVideosList,
  _successAddPageVideo: state => state.successAddPageVideo,
  // youtube
  _pageYoutubeVideosList: state => state.pageYoutubeVideosList,
  _successAddPageYoutubeVideo: state => state.successAddPageYoutubeVideo
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
  getPageStarted(state) {
    state.isLoadPages = true;

    state.page = null;
  },
  getPageSuccess(state, payload) {
    state.isLoadPages = false;

    state.page = payload.data;
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
    state.updateMetaPage = true;
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
  }
};

const actions = {
  // -------------------- general page ---------------------
  getPagesList({ commit }, payload) {
    commit("getPagesListStarted");

    axios
      .get(`${apiUrl}/pages`, {
        params: {
          type: payload.role,
          order_dir: payload.dir,
          name: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page
        }
      })
      .then(res => {
        if (res.status === 200) {
          commit("getPagesListEnded", false);
        }
        return res;
      })
      .then(res => {
        commit("getPagesSuccess", res.data);
      });
  },
  getPage({ commit }, payload) {
    commit("getPageStarted");
    const id = payload.id;
    axios.get(`${apiUrl}/pages/${id}`).then(res => {
      commit("getPageSuccess", res.data);
    });
  },
  updatePageData({ commit, dispatch }, payload) {
    const id = payload.id;

    const formData = new FormData();

    formData.append("link1", payload.data.link1);
    formData.append("link2", payload.data.link2);
    formData.append("type", payload.data.type);
    formData.append("ar[name]", payload.data.locales.ar.name);
    formData.append("ar[description]", payload.data.locales.ar.description);
    formData.append("en[name]", payload.data.locales.en.name);
    formData.append("en[description]", payload.data.locales.en.description);

    if (payload.file !== null) {
      formData.append("image", payload.file);
    }
    formData.append("_method", "PUT");
    axios.post(`${apiUrl}/pages/${id}`, formData, {}).then(res => {
      if (res.status === 200) {
        dispatch("getPage", { id });
      }
    });
  },
  deletePage({ commit, dispatch }, payload) {
    const id = payload.pageId;
    axios.delete(`${apiUrl}/pages/${id}`).then(res => {
      if (res.status === 200) {
        commit("deletePage", res);
      }
    });
  },
  // -------------------- general page ---------------------

  // -------------------------- page images ------------------------------
  getPageImageList({ commit }, payload) {
    commit("getPageImageListStarted");
    const id = payload.id;
    axios.get(`${apiUrl}/pages/images/${id}`).then(res => {
      commit("getPageImageList", res.data);
    });
  },
  createPageImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.image) {
      formData.append("path", payload.image);
    }
    formData.append("ar[title]", payload.ar_title);
    formData.append("ar[description]", payload.ar_description);
    formData.append("en[title]", payload.en_title);
    formData.append("en[description]", payload.en_description);
    axios.post(`${apiUrl}/pages/images/${id}`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("successAddPageImage", res.data.data);
        dispatch("getPageImageList", { id });
      }
    });
  },
  deletePageImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.attachment_id;
    axios.delete(`${apiUrl}/pages/images/${id}/${attachment_id}`).then(res => {
      if (res.status === 200) {
        dispatch("getPageImageList", { id });
      }
    });
  },
  // -------------------------- page images ------------------------------

  // --------------------files---------------------------
  getPageFileList({ commit }, payload) {
    commit("getPageFileListStarted");

    const id = payload.id;
    axios.get(`${apiUrl}/pages/files/${id}`).then(res => {
      commit("getPageFileList", res.data);
    });
  },
  createPageFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.file) {
      formData.append("path", payload.file);
    }
    formData.append("ar[title]", payload.ar_title);
    formData.append("ar[description]", payload.ar_description);
    formData.append("en[title]", payload.en_title);
    formData.append("en[description]", payload.en_description);
    axios.post(`${apiUrl}/pages/files/${id}`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("successAddPageFile", res.data.data);
        dispatch("getPageFileList", { id });
      }
    });
  },
  deletePageFile({ commit, dispatch }, payload) {
    const id = payload.pageId;
    const attachment_id = payload.file_id;
    axios.delete(`${apiUrl}/pages/files/${id}/${attachment_id}`).then(res => {
      if (res.status === 200) {
        dispatch("getPageFileList", { id });
      }
    });
  },
  // --------------------files---------------------------

  // ------------------------- meta data --------------------
  getMetaList({ commit }, payload) {
    commit("getmetaStarted");
    const id = payload.id;
    axios
      .get(`${apiUrl}/pages/metadata/${id}`)
      .then(res => {
        commit("getmetaEnded");
        return res;
      })
      .then(res => {
        commit("getMetaList", res.data);
      });
  },

  createMetaPage({ commit, dispatch }, payload) {
    commit("getmetaStarted");

    const id = payload.pageId;
    axios
      .post(
        `${apiUrl}/pages/metadata/${id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        commit("getmetaEnded");
        return res;
      })
      .then(res => {
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
    axios
      .put(
        `${apiUrl}/pages/metadata/${id}/${metadata_id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        commit("getmetaEnded");
        return res;
      })
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getMetaList", { id });
          commit("updateMetaPageSuccess");
        }
      });
  },
  deleteMetaPage({ commit, dispatch }, payload) {
    commit("getmetaStarted");

    const metadata_id = payload.metadata_id;
    const id = payload.pageId;
    axios
      .delete(`${apiUrl}/pages/metadata/${id}/${metadata_id}`)
      .then(res => {
        commit("getmetaEnded");
        return res;
      })
      .then(res => {
        dispatch("getMetaList", { id });
      });
  },
  getMetaTypeList({ commit }, payload) {
    axios.get(`${apiUrl}/metadata/meta-type`).then(res => {
      commit("getMetaTypeList", res.data);
    });
  },
  // ------------------------- meta data --------------------

  // ********************* page videos ***************************
  getPageVideosList({ commit }, payload) {
    commit("getPageVideosListStarted");

    const id = payload.id;
    axios.get(`${apiUrl}/pages/videos/${id}`).then(res => {
      commit("getPageVideosList", res.data);
    });
  },
  createPageVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.video) {
      formData.append("path", payload.video);
    }
    formData.append("ar[title]", payload.ar_title);
    formData.append("ar[description]", payload.ar_description);
    formData.append("en[title]", payload.en_title);
    formData.append("en[description]", payload.en_description);
    axios.post(`${apiUrl}/pages/videos/${id}`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("successAddPageVideo", res.data.data);
        dispatch("getPageVideosList", { id });
      }
    });
  },
  deletePageVideo({ commit, dispatch }, payload) {
    const id = payload.pageId;
    const attachment_id = payload.file_id;
    axios.delete(`${apiUrl}/pages/videos/${id}/${attachment_id}`).then(res => {
      if (res.status === 200) {
        console.log();
        dispatch("getPageVideosList", { id });
      }
    });
  },

  // ********************* page videos ***************************

  // ############### youtube ##################
  getPageYoutubeVideoList({ commit }, payload) {
    commit("getPageYoutubeVideosListStarted");

    const id = payload.id;
    axios.get(`${apiUrl}/pages/youtube-videos/${id}`).then(res => {
      commit("getPageYoutubeVideosList", res.data);
    });
  },
  createPageYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("path", payload.path);
    formData.append("ar[title]", payload.ar_title);
    formData.append("ar[description]", payload.ar_description);
    formData.append("en[title]", payload.en_title);
    formData.append("en[description]", payload.en_description);
    axios
      .post(`${apiUrl}/pages/youtube-videos/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("successAddPageYoutubeVideo", res.data.data);
          dispatch("getPageYoutubeVideoList", { id });
        }
      });
  },
  updatePageYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.attachment_id;
    const formData = new FormData();
    formData.append("path", payload.path);
    formData.append("ar[title]", payload.ar_title);
    formData.append("ar[description]", payload.ar_description);
    formData.append("en[title]", payload.en_title);
    formData.append("en[description]", payload.en_description);
    formData.append("_method", "PUT");

    axios
      .post(
        `${apiUrl}/pages/youtube-videos/${id}/${attachment_id}`,
        formData,
        {}
      )
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          commit("successAddPageYoutubeVideo", res.data.data);
          dispatch("getPageYoutubeVideoList", { id });
        }
      });
  },
  deletePageYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.pageId;
    const attachment_id = payload.youtube_id;
    axios
      .delete(`${apiUrl}/pages/youtube-videos/${id}/${attachment_id}`)
      .then(res => {
        if (res.status === 200) {
          console.log();
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
