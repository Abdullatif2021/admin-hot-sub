
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";

export const get_statistics = async (params) =>{
    return await axios.get(`${apiUrl}/statistics`, {params})
  }