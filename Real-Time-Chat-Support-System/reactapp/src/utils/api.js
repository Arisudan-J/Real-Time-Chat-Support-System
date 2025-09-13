import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const chatAPI = {
  createSession: (data = {}) => api.post('/chat-sessions', data),
  getSessions: () => api.get('/chat-sessions'),
  getMessages: (sessionId) => api.get(`/chat-messages/${sessionId}`),
  sendMessage: (message) => api.post('/chat-messages', message),
  assignAgent: (sessionId, agentId) => api.put(`/chat-sessions/${sessionId}/assign`, { agentId }),
  deleteSession: (sessionId) => api.delete(`/chat-sessions/${sessionId}`),
};

export const agentAPI = {
  getAvailableAgents: () => api.get('/agents/available'),
  updateStatus: (status) => api.put('/agents/status', { status }),
};

export default api;