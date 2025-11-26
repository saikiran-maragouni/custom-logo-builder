import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const logoAPI = {
  getAllLogos: (userId) => api.get(`/logos${userId ? `?userId=${userId}` : ''}`),
  getLogoById: (id) => api.get(`/logos/${id}`),
  createLogo: (logo, userId) => api.post(`/logos${userId ? `?userId=${userId}` : ''}`, logo),
  updateLogo: (id, logo) => api.put(`/logos/${id}`, logo),
  deleteLogo: (id) => api.delete(`/logos/${id}`),
  getPublicLogos: () => api.get('/logos/public'),
};

export const aiAPI = {
  getBrandingSuggestions: (request) => api.post('/ai/branding-suggestions', request),
  getLogoSuggestions: (request) => api.post('/ai/logo-suggestions', request),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api;