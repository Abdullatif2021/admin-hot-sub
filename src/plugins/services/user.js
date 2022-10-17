
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";

export const login_user = async (params) =>{
  return await axios.post(`${apiUrl}/auth`, params)
}
export const get_user = async () =>{
    return await axios.get(`${apiUrl}/auth/user`)
}
export const get_users = async (params) =>{
  return await axios.get(`${apiUrl}/users`, {params})
}
export const create_user = async (user) =>{
  return await axios.post(`${apiUrl}/users`, user)
}
export const update_user = async (formData) =>{
    return await axios.post(`${apiUrl}/auth`, formData, {})
}
export const change_locale = async (data) =>{
  return await axios.put(`${apiUrl}/users/prefer_locale`, data)
}
export const active_user = async ({id,active}) =>{
  return await  axios.put(`${apiUrl}/users/${id}`,{active},{})
}
export const reset_password = async (params) =>{
    return await axios.post(`${apiUrl}/auth/password/forgot`, params)
}
export const get_userInfo = async (params) =>{
    return await axios.get(`${apiUrl}/users`, {params})
}
export const phone_confirm = async (userId) =>{
  return await  axios.post(`${apiUrl}/verifyMobileByAdmin/${userId}`, {})
}
export const verfiy_ident = async (userId) =>{
  return await axios.post(`${apiUrl}/accountVerification/${userId}`, {})
}  
export const get_userAttach = async (userId) =>{
  return await axios.get(`${apiUrl}/user/attachments?user_id=${userId}`)
}
export const verfiy_attach = async (id) =>{
    return await axios.post(`${apiUrl}/user/attachments/verfiy/${id}`)
}
export const send_note = async (formData) =>{
    return await axios.post(`${apiUrl}/user/attachments/report`, formData, {})
}
export const update_info = async ({id, user}) =>{
    return await axios.put(`${apiUrl}/users/${id}`, user, {})
}
export const verfiy_transaction = async ({id, type}) =>{
    return await axios.post(`${apiUrl}/wallet/transactions/verfiy/${id}`,{payment_status: type},{})
}
export const forgot_password = async (email) =>{
    return await axios.post(`${apiUrl}/auth/password/forgot`, {email: email})
}
export const sign_out = async (category_id) =>{
    return await axios.post(`${apiUrl}/auth/logout`)
}
export const refresh_token = async (token) =>{
    return await axios.post(`${apiUrl}/auth/refresh_token`, {refresh_token: token})
}
export const get_countries = async () =>{
    return await axios.get(`${apiUrl}/countries`)
}
export const get_nationalities = async () =>{
    return await axios.get(`${apiUrl}/`)
}
export const update_attach = async ({attachment_id, formData}) =>{
    return await axios.post(`${apiUrl}/user/attachments/${attachment_id}`, formData, {})
}
export const add_attach = async ({userId, formData}) =>{
    return await axios.post(`${apiUrl}/user/attachments/${userId}`, formData, {})
}
export const get_attachCategory = async () =>{
    return await axios.get(`${apiUrl}/user/attachments/categories`)
}
export const get_userWallet = async (userId) =>{
    return await axios.get(`${apiUrl}/wallet`, {params: {owner_id: userId}})
}
export const get_userTransaction = async (params) =>{
    return await axios.get(`${apiUrl}/wallet/transactions`, {params})
}
export const get_userDeposit = async (userId) =>{
    return await axios.get(`${apiUrl}/deposit`, {params: {user_id: userId}})
}















