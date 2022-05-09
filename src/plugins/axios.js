import axios from "axios";
import { getAccessToken, getCurrentLanguage } from "../utils";
import store from "../store";

axios.interceptors.request.use(request => {
  request.headers = {
    Authorization: "Bearer " + getAccessToken(),
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
      }, 2000);
      // setTimeout(() => {
      //   location.reload();
      // }, 2000);
    }
  }
);

export default axios;
