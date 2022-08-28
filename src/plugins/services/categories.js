
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";

export const get_categoeries = async (params) =>{
  return await axios.get(`${apiUrl}/categories`, {params})
}
export const get_category = async (id) =>{
  return await axios.get(`${apiUrl}/categories/${id}`)
}
export const create_category = async (formData) =>{
  return await axios.post(`${apiUrl}/categories`, formData, {})
}
export const update_category = async ({id, formData}) =>{
  return await  axios.post(`${apiUrl}/categories/${id}`, formData, {})
}
export const delete_category = async (id) =>{
  return await axios.delete(`${apiUrl}/categories/${id}`)
}
export const active_category = async ({id, active}) =>{
  return await axios.put(`${apiUrl}/categories/${id}`,{active: active},{})
}
export const get_metadata = async (id) =>{
  return await axios.get(`${apiUrl}/categories/metadata/${id}`)
}
export const create_meta = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/categories/metadata/${id}`, formData, {})
}
export const update_meta = async ({id, metadata_id, formData}) =>{
  return await axios.post(`${apiUrl}/categories/metadata/${id}/${metadata_id}`, formData, {})
}
export const delete_meta = async ({id, metadata_id}) =>{
  return await axios.delete(`${apiUrl}/categories/metadata/${id}/${metadata_id}`)
}
export const get_metaType = async () =>{
  return await axios.get(`${apiUrl}/metadata/meta-type`)
}
export const get_subCategories = async (params) =>{
  return await axios.get(`${apiUrl}/categories`, {params})
}
export const get_subCategory = async (id) =>{
  return await axios.get(`${apiUrl}/categories/${id}`)
}
export const create_subCategory = async (formData) =>{
  return await axios.post(`${apiUrl}/categories`, formData, {})
}
export const update_subCategory = async ({sub_id, formData}) =>{
  return await axios.post(`${apiUrl}/categories/${sub_id}`, formData, {})
}
export const delete_subCategory = async ({  sub_id, params}) =>{
    return await axios.delete(`${apiUrl}/categories/${sub_id}`, {params})
  }









export const update_customVal = async ({custom_id, value_id, formData}) =>{
  return await axios.post(`${apiUrl}/categories/additional/${custom_id}/${value_id}`, formData, {})
}
export const get_requests = async (params) =>{
  return await axios.get(`${apiUrl}/auctions/preview`, {params})
}
export const update_request = async ({request_id, formData}) =>{
  return await axios.post(`${apiUrl}/auctions/preview/${request_id}`, formData, {})
}
export const delete_terms = async ({type, id}) =>{
  return await axios.delete(`${apiUrl}/auctions/${type}/${id}`)
}
