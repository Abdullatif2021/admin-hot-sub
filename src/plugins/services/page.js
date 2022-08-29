
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";


// ------------------ GENERAL -------------------
export const get_pages = async (params) =>{
  return await axios.get(`${apiUrl}/pages`, {params})
}
export const get_page = async (pageId) =>{
  return await axios.get(`${apiUrl}/pages/${id}`)
}
export const update_page = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/pages/${id}`, formData, {})
}
export const delete_page = async (id) =>{
    return await axios.delete(`${apiUrl}/pages/${id}`)
}

// ------------------ IMAGES -------------------

export const get_images = async (id) =>{
    return await axios.get(`${apiUrl}/pages/images/${id}`)
}
export const create_image = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/pages/images/${id}`, formData, {})
}
export const delete_image = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/pages/images/${id}/${attachment_id}`)
}

// ---------------- FILES ------------------


export const get_files = async (id) =>{
  return await axios.get(`${apiUrl}/pages/files/${id}`)
}
export const create_file = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/pages/files/${id}`, formData, {})
}
export const delete_file = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/pages/files/${id}/${attachment_id}`)
}

// --------------------- METADATA ---------------------- 
export const get_meta = async (id) =>{
    return await axios.get(`${apiUrl}/pages/metadata/${id}`)
}
export const create_meta = async ({id, formData}) =>{
    return await axios.post(`${apiUrl}/pages/metadata/${id}`, formData, {})
}
export const update_meta = async ({id, metadata_id, formData}) =>{
    return await axios.post(`${apiUrl}/pages/metadata/${id}/${metadata_id}`, formData, {})
}
export const delete_meta = async ({id, metadata_id}) =>{
    return await axios.delete(`${apiUrl}/pages/metadata/${id}/${metadata_id}`)
}
export const get_metaType = async () =>{
    return await  axios.get(`${apiUrl}/metadata/meta-type`)
}


// -------------------- VIDEOS -----------------


export const get_videos = async (id) =>{
    return await axios.get(`${apiUrl}/pages/videos/${id}`)
}
export const create_video = async ({id, formData}) =>{
    return await axios.post(`${apiUrl}/pages/videos/${id}`, formData, {})
}
export const delete_video = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/pages/videos/${id}/${attachment_id}`)
}


//  ---------------------- YOUTUBE -----------------

export const get_youtube = async (id) =>{
  return await axios.get(`${apiUrl}/pages/youtube-videos/${id}`)
}
export const create_youtube = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/pages/youtube-videos/${id}`, formData, {})
}
export const update_youtube = async ({id, attachment_id, formData}) =>{
  return await axios.post(`${apiUrl}/pages/youtube-videos/${id}/${attachment_id}`,formData,{})
}
export const delete_youtube = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/pages/youtube-videos/${id}/${attachment_id}`)
}


