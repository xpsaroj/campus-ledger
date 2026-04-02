import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
})

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Token ${token}`
    } else {
        delete api.defaults.headers.common.Authorization
    }
}

export const login = async (username, password) => {
    const response = await api.post('/auth/token/', { username, password })
    return response.data
}

export const logout = async () => {
    await api.post('/auth/logout/')
}

export const getStudents = async (search = '') => {
    const response = await api.get('/students/', {
        params: search ? { search } : {},
    })
    return response.data
}

export const createStudent = async (payload) => {
    const response = await api.post('/students/', payload)
    return response.data
}

export const updateStudent = async (id, payload) => {
    const response = await api.put(`/students/${id}/`, payload)
    return response.data
}

export const deleteStudent = async (id) => {
    await api.delete(`/students/${id}/`)
}

export const getEnrollments = async (search = '') => {
    const response = await api.get('/enrollments/', {
        params: search ? { search } : {},
    })
    return response.data
}

export const createEnrollment = async (payload) => {
    const response = await api.post('/enrollments/', payload)
    return response.data
}

export const updateEnrollment = async (id, payload) => {
    const response = await api.put(`/enrollments/${id}/`, payload)
    return response.data
}

export const deleteEnrollment = async (id) => {
    await api.delete(`/enrollments/${id}/`)
}
