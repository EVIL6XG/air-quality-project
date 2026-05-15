import axios from "axios"

const { VITE_API_URL } = import.meta.env
const baseURL = VITE_API_URL ?? "http://127.0.0.1:5000"

export const httpRoot = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const http = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

const addAuthToken = (config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

const handleUnauthorized = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token")
    window.location = "/login"
  }

  return Promise.reject(error)
}

http.interceptors.request.use(addAuthToken)
httpRoot.interceptors.request.use(addAuthToken)

http.interceptors.response.use((response) => response, handleUnauthorized)
httpRoot.interceptors.response.use((response) => response, handleUnauthorized)

export const get = (url, cfg) => http.get(url, cfg).then((res) => res.data)

export const post = (url, body, cfg) =>
  http.post(url, body, cfg).then((res) => res.data)
