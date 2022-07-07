import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  console.log('Setting token to', newToken)
  token = newToken
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  console.log('Sending with token', token)
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

// FIXME: No authorization yet
// NOTE: Authorization not needed for leaving likes
const update = async (blog, id) => {
  const url = `${baseUrl}/${id}`
  const response = await axios.put(url, blog)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const url = `${baseUrl}/${id}`
  const response = await axios.delete(url, config)
  return response.data
}

const blogService = { getAll, create, update, remove, setToken }
export default blogService