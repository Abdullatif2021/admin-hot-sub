
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";

export const get_statistics = async (params) =>{
    return await axios.get(`${apiUrl}/statistics`, {params})
  }
export const get_logs = async () => {
  return await axios.get(`${apiUrl}/logs`)
}
export const get_owner_chart = async (params) => {
  return await axios.get(`${apiUrl}/auctions/auctionsbyowners`, {params})
}