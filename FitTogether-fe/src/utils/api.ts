import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

export const authInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/v1/auth`
})

export const backendInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/v1`
})

// Add request interceptors to include access token in headers
authInstance.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

backendInstance.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

// Add response interceptors to handle 401 unauthorized responses
// authInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             useAuthStore.getState().removeAccessToken()
//             window.location.href = '/login'
//         }
//         return Promise.reject(error)
//     }
// )

// backendInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             useAuthStore.getState().removeAccessToken()
//             window.location.href = '/login'
//         }
//         return Promise.reject(error)
//     }
// )
