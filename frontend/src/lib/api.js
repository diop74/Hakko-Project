import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Articles API (Public)
export const articlesAPI = {
  getAll: (params = {}) => 
    api.get('/articles', { params }),
  
  getCount: (params = {}) => 
    api.get('/articles/count', { params }),
  
  getBySlug: (slug) => 
    api.get(`/articles/${slug}`),
};

// Admin Articles API
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

// Contact API
export const contactAPI = {
  send: (data) => 
    api.post('/contact', data),
};

// Admin Messages API
export const adminMessagesAPI = {
  getAll: (params = {}) => 
    api.get('/admin/messages', { params }),
  
  markRead: (messageId) => 
    api.put(`/admin/messages/${messageId}/read`),
  
  delete: (messageId) => 
    api.delete(`/admin/messages/${messageId}`),
};

// Admin Stats API
export const adminStatsAPI = {
  get: () => 
    api.get('/admin/stats'),
};

// Health check
export const healthAPI = {
  check: () => 
    api.get('/health'),
};

export default api;
