const API_BASE_URL = 'http://localhost:8080/api';

const fetchAPI = async (url, options = {}) => {
  const response = await fetch(API_BASE_URL + url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await response.text();
  try {
    return { data: JSON.parse(text) };
  } catch {
    return { data: text };
  }
};

export const logoAPI = {
  getAllLogos: (userId) => fetchAPI(`/logos${userId ? `?userId=${userId}` : ''}`),
  getLogoById: (id) => fetchAPI(`/logos/${id}`),
  createLogo: (logo, userId) => fetchAPI(`/logos${userId ? `?userId=${userId}` : ''}`, { method: 'POST', body: JSON.stringify(logo) }),
  updateLogo: (id, logo) => fetchAPI(`/logos/${id}`, { method: 'PUT', body: JSON.stringify(logo) }),
  deleteLogo: (id) => fetchAPI(`/logos/${id}`, { method: 'DELETE' }),
  getPublicLogos: () => fetchAPI('/logos/public'),
};

export const aiAPI = {
  getBrandingSuggestions: (request) => fetchAPI('/ai/branding-suggestions', { method: 'POST', body: JSON.stringify(request) }),
  getLogoSuggestions: (request) => fetchAPI('/ai/logo-suggestions', { method: 'POST', body: JSON.stringify(request) }),
};

export const authAPI = {
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
};

export default { logoAPI, aiAPI, authAPI };