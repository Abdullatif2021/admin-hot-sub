import axios from "../../plugins/axios";
import { apiUrl, adminRoot } from "../../constants/config";
import router from "../../router";

const state = {
  isLoadPages: true,
  pagesPaginations: null,
  Pages: null,
  updatedSuccessfuly: false,
  Error: "",
  metaTypeList: null,
  successAddPageImage: null,
  successAddPageFile: null,
  page: null,
  pageImageList: null,
  pageFileList: null,
  metaList: null,
  updateMetaPage: false,
  pageVideosList: null,
  successAddPageVideo: null
};

const getters = {
  // general
  _isLoadPages: state => state.isLoadPages,
  _PagesError: state => state.Error,
  _pagesPaginations: state => state.pagesPaginations,
  _Pages: state => state.Pages,
  _page: state => state.page,
  // meta
  _metaList: state => state.metaList,
  _updateMetaPage: state => state.updateMetaPage,
  _metaTypeList: state => state.metaTypeList,
  // images
  _pageImageList: state => state.pageImageList,
  _sccussCreateImage: state => state.successAddPageImage,
  // file
  _pageFileList: state => state.pageFileList,
  _sccussCreateFile: state => state.successAddPageFile,
  // videos
  _pageVideosList: state => state.pageVideosList,
  _successAddPageVideo: state => state.successAddPageVideo
};

const mutations = {
  // general page
  getPagesListStarted(state) {
    state.isLoadPages = true;
    state.Pages = [];
  },
  getPagesSuccess(state, payload) {
    state.isLoadPages = false;
    state.Pages = payload.data;
    state.pagesPaginations = payload;
  },
  getPageStarted(state) {
    state.page = null;
  },
  getPageSuccess(state, payload) {
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
  // metaData
  getMetaList(state, payload) {
    state.metaList = payload.data;
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
        if (res.status) {
          commit("getPagesSuccess", res.data);
        } else {
          commit("getPagesError", "error:getPages");
        }
      });
  },
  getPage({ commit }, payload) {
    commit("getPageStarted");
    const id = payload.id;
    axios.get(`${apiUrl}/pages/${id}`).then(res => {
      commit("getPageSuccess", res.data);
    });
  },
  updatePageData({ commit }, payload) {
    const id = payload.id;

    const formData = new FormData();

    if (payload.data.locales.ar) {
      formData.append("ar[name]", payload.data.locales.ar.name);
      formData.append("ar[description]", payload.data.locales.ar.description);
    }
    if (payload.data.locales.en) {
      formData.append("en[name]", payload.data.locales.en.name);
      formData.append("en[description]", payload.data.locales.en.description);
    }
    if (payload.file !== null) {
      formData.append("image", payload.file);
    }
    formData.append("_method", "PUT");
    axios.post(`${apiUrl}/pages/${id}`, formData, {}).then(res => {
      if (res.status === 200) {
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
    if (payload.file) {
      formData.append("path", payload.file);
    }
    formData.append("en[title]", payload.title);
    formData.append("en[description]", payload.description);
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
    formData.append("en[title]", payload.title);
    formData.append("en[description]", payload.description);
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
    const id = payload.id;
    axios.get(`${apiUrl}/pages/metadata/${id}`).then(res => {
      commit("getMetaList", res.data);
    });
  },

  createMetaPage({ commit, dispatch }, payload) {
    const id = payload.pageId;
    axios
      .post(
        `${apiUrl}/pages/metadata/${id}`,
        {
          en: { meta_content: payload.content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          dispatch("getMetaList", { id });
          commit("updateMetaPageSuccess");
        }
      });
  },
  updateMetaPage({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.pageId;
    const formData = new FormData();
    formData.append("en[meta_content]", payload.content);
    formData.append("meta_type_id", payload.meta_type_id);
    axios
      .put(
        `${apiUrl}/pages/metadata/${id}/${metadata_id}`,
        {
          en: { meta_content: payload.content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getMetaList", { id });
          commit("updateMetaPageSuccess");
        }
      });
  },
  deleteMetaPage({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.pageId;
    axios.delete(`${apiUrl}/pages/metadata/${id}/${metadata_id}`).then(res => {
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
    if (payload.file) {
      formData.append("path", payload.file);
    }
    formData.append("en[title]", payload.title);
    formData.append("en[description]", payload.description);
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
  }

  // ********************* page videos ***************************
};

export default {
  state,
  getters,
  mutations,
  actions
};
