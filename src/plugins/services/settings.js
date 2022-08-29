
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";

export const get_settings = async (params) =>{
  return await axios.get(`${apiUrl}/setting`)
}
export const update_setting = async ({id, value}) =>{
return await axios.put(`${apiUrl}/setting/${id}`,{value: value},{})
}

