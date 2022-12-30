import { apiEndpoint } from '../config'
import { Blog } from '../types/Blog';
import { CreateBlogRequest } from '../types/CreateBlogRequest';
import Axios from 'axios'
import { UpdateBlogRequest } from '../types/UpdateBlogRequest';

export async function getBlogs(idToken: string): Promise<Blog[]> {
  console.log('Fetching blogs')

  const response = await Axios.get(`${apiEndpoint}/blogs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })

  console.log('blogs:', response.data)
  return response.data.items
}

export async function createBlog(
  idToken: string,
  newBlog: CreateBlogRequest,
  file: Buffer
) {
  await Axios.post(`${apiEndpoint}/blogs`, JSON.stringify(newBlog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  }).then(async (res) => {
    await uploadFile(res.data.url, file)
      .then(async () => { return res.data.item })
  })
}

export async function patchBlog(
  idToken: string,
  blogId: string,
  updatedBlog: UpdateBlogRequest,
  file: Buffer
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/blogs/${blogId}`, JSON.stringify(updatedBlog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  }).then(async (res) => {
    if (file != null) {
      await uploadFile(res.data.url, file)
    } else {
      console.log("No file attachment")
    }
  })
}

export async function deleteBlog(
  idToken: string,
  blogId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/blogs/${blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  blogId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/blogs/${blogId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  console.log("uploading file url: ", uploadUrl)
  await Axios.put(uploadUrl, file).then(() => {
    console.log("Upload file successfully")
  })
  console.log("upload done")
}

export async function findBlogByName(idToken: string, name: string): Promise<Blog[]> {
  console.log('Fetching blogs with name:', name)

  const response = await Axios.get(`${apiEndpoint}/blogs/search?name=${name}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })

  console.log('blogs:', response.data)
  return response.data.items
}