import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Public client — NO credentials. Public endpoints (articles, contact, files).
// This avoids the Cloudflare-edge issue where ACAO is rewritten to '*' on GETs,
// which the browser rejects when credentials are also sent.
const publicApi = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

// Auth/admin client — WITH credentials (httpOnly session cookie).
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Auth API
export const authAPI = {
  exchangeSession: (sessionId) =>
    api.post('/auth/session', { session_id: sessionId }),

  getMe: () =>
    api.get('/auth/me'),

  logout: () =>
    api.post('/auth/logout'),
};

// Articles API (Public — no credentials)
export const articlesAPI = {
  getAll: (params = {}) =>
    publicApi.get('/articles', { params }),

  getCount: (params = {}) =>
    publicApi.get('/articles/count', { params }),

  getBySlug: (slug) =>
    publicApi.get(`/articles/${slug}`),
};

// Admin Articles API (credentialed)
export const adminArticlesAPI = {
  getAll: (params = {}) =>
    api.get('/admin/articles', { params }),

  create: (data) =>
    api.post('/admin/articles', data),

  update: (articleId, data) =>
    api.put(`/admin/articles/${articleId}`, data),

  delete: (articleId) =>
    api.delete(`/admin/articles/${articleId}`),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Contact API (public)
export const contactAPI = {
  send: (data) =>
    publicApi.post('/contact', data),
};

// Admin Messages API (credentialed)
export const adminMessagesAPI = {
  getAll: (params = {}) =>
    api.get('/admin/messages', { params }),

  markRead: (messageId) =>
    api.put(`/admin/messages/${messageId}/read`),

  delete: (messageId) =>
    api.delete(`/admin/messages/${messageId}`),
};

// Admin Stats API (credentialed)
export const adminStatsAPI = {
  get: () =>
    api.get('/admin/stats'),
};

// Health check (public)
export const healthAPI = {
  check: () =>
    publicApi.get('/health'),
};

export default api;
