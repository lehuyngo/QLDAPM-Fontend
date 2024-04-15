import axios from 'axios'
import { LOCAL_STORAGE_ITEM } from '../constants/common'

const ENDPOINT = process.env.REACT_APP_API

export const api = axios.create({
  baseURL: `${ENDPOINT}`,
  timeout: 10000
})

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem(LOCAL_STORAGE_ITEM.TOKEN)
    if (token && config.headers) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)
