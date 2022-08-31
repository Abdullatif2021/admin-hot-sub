
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";

export const get_Auctions = async (params) =>{
  return await axios.get(`${apiUrl}/auctions`, {params})
}
export const get_auction = async (id) =>{
  return await axios.get(`${apiUrl}/auctions/${id}`)
}
export const create_auction = async (formData) =>{
  return await axios.post(`${apiUrl}/auctions`,formData, {})
}
export const update_auction = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/auctions/${id}`,formData, {})
}
export const delete_auction = async (id) =>{
  return await axios.delete(`${apiUrl}/auctions/${id}`)
}
export const get_bids = async (params) =>{
  return await axios.get(`${apiUrl}/auctions/bids`, {params})
}
export const get_sides = async () =>{
  return await axios.get(`${apiUrl}/auctions/sides`)
}
export const get_owners = async () =>{
  return await axios.get(`${apiUrl}/auctions/owners`)
}
export const get_cities = async (params) =>{
  return await axios.get(`${apiUrl}/cities`, {params})
}
export const get_areas = async (params) =>{
  return await axios.get(`${apiUrl}/areas`, {params})
}
export const get_files = async (id) =>{
  return await axios.get(`${apiUrl}/auctions/files/${id}`)
}
export const create_file = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/auctions/files/${id}`, formData, {})
}
export const delete_file = async ({id, fileId}) =>{
  return await axios.delete(`${apiUrl}/auctions/files/${id}/${fileId}`)
}
export const get_images = async (id) =>{
  return await axios.get(`${apiUrl}/auctions/images/${id}`)
}
export const create_image = async (id) =>{
  return await axios.post(`${apiUrl}/auctions/images/${id}`, formData, {})
}
export const delete_image = async ({id, imgId}) =>{
  return await axios.delete(`${apiUrl}/auctions/images/${id}/${imgId}`)
}
export const create_customVal = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/categories/additional/${id}`, formData, {})
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
