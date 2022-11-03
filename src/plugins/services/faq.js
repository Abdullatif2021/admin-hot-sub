
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";

export const get_faqs = async (params) =>{
  return await axios.get(`${apiUrl}/faq`, {params})
}
export const get_faq = async (params) =>{
    return await axios.get(`${apiUrl}/faq`, {params})
}
export const create_faq = async (formData) =>{
  return await axios.post(`${apiUrl}/faq`, formData, {})
}  
export const update_faq = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/faq/${id}`, formData, {})
}
export const delete_faq = async (faq_id) =>{
  return await  axios.delete(`${apiUrl}/faq/${faq_id}`)
}
export const get_faqCategories = async (params) =>{
  return await axios.get(`${apiUrl}/faqcategory`, {params})
}
export const get_faqCategory = async (category_id) =>{
    return await axios.get(`${apiUrl}/faqcategory/${category_id}`)
  }
export const create_faqCategory = async (formData) =>{
  return await  axios.post(`${apiUrl}/faqcategory`, formData, {})
}
export const update_faqCategory = async ({category_id, formData}) =>{
  return await axios.post(`${apiUrl}/faqcategory/${category_id}`, formData, {})
}
export const delete_faqCategory = async (category_id) =>{
  return await axios.delete(`${apiUrl}/faqcategory/${category_id}`)
}
