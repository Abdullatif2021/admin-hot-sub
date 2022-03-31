import axios from "axios";
import { getAccessToken, getCurrentLanguage } from "../utils";
import router from "../router";

axios.interceptors.request.use(request => {
  request.headers = {
    Authorization: "Bearer " + getAccessToken(),
    locale: getCurrentLanguage()
  };
  return request;
});

axios.interceptors.response.use(response => {
  // if (response.data.status == 401) {
  //   router.push("/");
  // }

  return response;
});

export default axios;
