import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s timeout for AI operations
});

// Request interceptor to attach JWT token, and handle FormData
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Let browser automatically populate multipart/form-data boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// If the server says the session is invalid, drop the stale token
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !url.startsWith('/auth/login') && !url.startsWith('/auth/register')) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const resumeService = {
  uploadPdf: (formData) => api.post('/resume/upload', formData),
  pasteResumeText: (resumeText, fileName) => api.post('/resume/upload', { resumeText, fileName }),
  getLatestResume: () => api.get('/resume/latest'),
};

export const jobService = {
  analyzeJob: (data) => api.post('/job/analyze', data),
  getHistory: () => api.get('/job/history'),
  getAnalysisById: (id) => api.get(`/job/${id}`),
  deleteAnalysis: (id) => api.delete(`/job/${id}`),
};

export const chatService = {
  sendMessage: (payload) => api.post('/chat/message', payload),
};

export default api;
