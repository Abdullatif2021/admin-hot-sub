
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
export const get_customFileds = async (id) =>{
  return await axios.get(`${apiUrl}/categories/custom_fields/${id}`)
}
export const create_customField = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/categories/custom_fields/${id}`, formData, {})
}
export const update_customField = async ({id, custom_id, formData}) =>{
  return await axios.post(`${apiUrl}/categories/custom_fields/${id}/${custom_id}`,formData,{})
}
export const delete_customField = async ({id, custom_id}) =>{
  return await axios.delete(`${apiUrl}/categories/custom_fields/${id}/${custom_id}`)
}








