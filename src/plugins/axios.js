import axios from "axios";
import { getCurrentLanguage } from "../utils";
import store from "../store";

axios.interceptors.request.use(request => {
  request.headers = {
    Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    locale: getCurrentLanguage()
  };
  return request;
});

axios.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      store.dispatch("refreshToken");
      setTimeout(() => {
        axios.request(error.config);
      }, 1500);
    }
  }
);

export default axios;
