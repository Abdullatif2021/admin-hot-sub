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

  // //////////////////////////////////////////////////////////////////
  page: null,
  pageImageList: null,
  pageFileList: null,
  metaList: null,
  updateMetaPage: false
};

const getters = {
  isLoadPages: state => state.isLoadPages,
  PagesError: state => state.Error,
  pagesPaginations: state => state.pagesPaginations,
  Pages: state => state.Pages,
  //   updatedSuccessfuly: state => state.updatedSuccessfuly
  metaList: state => state.metaList,
  _page: state => state.page,
  _updateMetaPage: state => state.updateMetaPage,
  _metaTypeList: state => state.metaTypeList,
  _pageImageList: state => state.pageImageList,
  sccussCreateImage: state => state.successAddPageImage,
  _pageFileList: state => state.pageFileList,
  sccussCreateFile: state => state.successAddPageFile
};

const mutations = {
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
  getMetaList(state, payload) {
    state.metaList = payload.data;
  },
  updateMetaPageSuccess(state, payload) {
    state.updateMetaPage = true;
  },
  getMetaTypeList(state, payload) {
    state.metaTypeList = payload.data;
  },
  getPageImageListStarted(state, payload) {
    state.pageImageList = null;
  },
  getPageImageList(state, payload) {
    state.pageImageList = payload.data;
  },
  successAddPageImage(state, payload) {
    state.successAddPageImage = payload;
  },
  getPageFileListStarted(state, payload) {
    state.pageFileList = null;
  },
  getPageFileList(state, payload) {
    state.pageFileList = payload.data;
  },
  successAddPageFile(state, payload) {
    state.successAddPageFile = payload;
  }
};

const actions = {
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
      console.log("from get page", res);
      commit("getPageSuccess", res.data);
    });
  },
  getMetaList({ commit }, payload) {
    const id = payload.id;
    axios.get(`${apiUrl}/pages/metadata/${id}`).then(res => {
      console.log(res);
      commit("getMetaList", res.data);
    });
  },
  getPageImageList({ commit }, payload) {
    commit("getPageImageListStarted");

    const id = payload.id;
    axios.get(`${apiUrl}/pages/images/${id}`).then(res => {
      console.log(res);
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
      console.log("delete page image", res);
      if (res.status === 200) {
        dispatch("getPageImageList", { id });
      }
    });
  },
  getPageFileList({ commit }, payload) {
    commit("getPageFileListStarted");

    const id = payload.id;
    axios.get(`${apiUrl}/pages/files/${id}`).then(res => {
      console.log(res);
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
      console.log("delete page file", res);
      if (res.status === 200) {
        dispatch("getPageFileList", { id });
      }
    });
  },
  updatePageData({ commit }, payload) {
    console.log(payload);
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
      console.log(res);
      if (res.status === 200) {
        console.log("Successfully Done !");
      }
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
        console.log(res);
        if (res.status === 201) {
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
        // formData,
        {
          en: { meta_content: payload.content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          console.log("updateMetaPageSuccess");
          dispatch("getMetaList", { id });
          commit("updateMetaPageSuccess");
        }
      });
  },
  deleteMetaPage({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.pageId;
    axios.delete(`${apiUrl}/pages/metadata/${id}/${metadata_id}`).then(res => {
      console.log(res);
      dispatch("getMetaList", { id });
    });
  },
  getMetaTypeList({ commit }, payload) {
    axios.get(`${apiUrl}/metadata/meta-type`).then(res => {
      console.log("meta types", res);
      commit("getMetaTypeList", res.data);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
