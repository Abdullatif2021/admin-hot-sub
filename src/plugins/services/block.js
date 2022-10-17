
import { apiUrl } from "../../constants/config";
import axios from "../../plugins/axios";


// ------------------ GENERAL -------------------
export const get_blocks = async (params) =>{
  return await axios.get(`${apiUrl}/blocks`, {params})
}
export const get_block = async (blockId) =>{
  return await axios.get(`${apiUrl}/blocks/${blockId}/slug`)
}
export const create_block = async (formData) =>{
  return await axios.post(`${apiUrl}/blocks`, formData, {})
}
export const update_block = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/blocks/${id}`, formData, {})
}
export const delete_block = async (id) =>{
    return await axios.delete(`${apiUrl}/blocks/${id}`)
}

// ------------------ IMAGES -------------------

export const get_images = async (id) =>{
    return await axios.get(`${apiUrl}/blocks/images/${id}`)
}
export const create_image = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/blocks/images/${id}`, formData, {})
}
export const delete_image = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/blocks/images/${id}/${attachment_id}`)
}

// ---------------- FILES ------------------


export const get_files = async (id) =>{
  return await axios.get(`${apiUrl}/blocks/files/${id}`)
}
export const create_file = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/blocks/files/${id}`, formData, {})
}
export const delete_file = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/blocks/files/${id}/${attachment_id}`)
}

// --------------------- METADATA ---------------------- 
export const get_meta = async (id) =>{
    return await axios.get(`${apiUrl}/blocks/metadata/${id}`)
}
export const create_meta = async ({id, formData}) =>{
    return await axios.post(`${apiUrl}/blocks/metadata/${id}`, formData, {})
}
export const update_meta = async ({id, metadata_id, formData}) =>{
    return await axios.post(`${apiUrl}/blocks/metadata/${id}/${metadata_id}`, formData, {})
}
export const delete_meta = async ({id, metadata_id}) =>{
    return await axios.delete(`${apiUrl}/blocks/metadata/${id}/${metadata_id}`)
}
export const get_metaType = async () =>{
    return await  axios.get(`${apiUrl}/metadata/meta-type`)
}


// -------------------- VIDEOS -----------------


export const get_videos = async (id) =>{
    return await axios.get(`${apiUrl}/blocks/videos/${id}`)
}
export const create_video = async ({id, formData}) =>{
    return await axios.post(`${apiUrl}/blocks/videos/${id}`, formData, {})
}
export const delete_video = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/blocks/videos/${id}/${attachment_id}`)
}


//  ---------------------- YOUTUBE -----------------




export const get_youtube = async (id) =>{
  return await axios.get(`${apiUrl}/blocks/youtube-videos/${id}`)
}
export const create_youtube = async ({id, formData}) =>{
  return await axios.post(`${apiUrl}/blocks/youtube-videos/${id}`, formData, {})
}
export const update_youtube = async ({id, attachment_id, formData}) =>{
  return await axios.post(`${apiUrl}/blocks/youtube-videos/${id}/${attachment_id}`,formData,{})
}
export const delete_youtube = async ({id, attachment_id}) =>{
  return await axios.delete(`${apiUrl}/blocks/youtube-videos/${id}/${attachment_id}`)
}


// ------------------------ CATEGORY --------------------
export const get_categories = async (params) =>{
    return await axios.get(`${apiUrl}/blocks/categories`, {params})
}
export const get_categoryType = async () =>{
    return await axios.get(`${apiUrl}/blocks/categories/types`)
}
export const get_category = async (id) =>{
    return await axios.get(`${apiUrl}/blocks/categories/${id}`)
}
export const create_category = async (formData) =>{
    return await axios.post(`${apiUrl}/blocks/categories`, formData, {})
}
export const update_category = async ({id, formData}) =>{
  console.log('from service', id, formData);
    return await axios.post(`${apiUrl}/blocks/categories/${id}`, formData, {})
}
export const delete_category = async () =>{
    return await  axios.get(`${apiUrl}/metadata/meta-type`)
}


// ------------------------ CATEGORY METADATA ------------------

export const get_categoryMeta = async (id) =>{
    return await  axios.get(`${apiUrl}/blocks/categories/metadata/${id}`)
}
export const create_categoryMeta = async ({id, formData}) =>{
    return await  axios.post(`${apiUrl}/blocks/categories/metadata/${id}`, formData, {})
}
export const update_categoryMeta = async ({id, metadata_id, formData}) =>{
    return await  axios .post(`${apiUrl}/blocks/categories/metadata/${id}/${metadata_id}`, formData, {})
}
export const delete_categoryMeta = async ({id, metadata_id}) =>{
    return await axios.delete(`${apiUrl}/blocks/categories/metadata/${id}/${metadata_id}`)
}