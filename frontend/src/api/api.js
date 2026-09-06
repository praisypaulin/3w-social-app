import axios from 'axios';

// Set VITE_API_URL in a .env file at the frontend root when deploying
// e.g. VITE_API_URL=https://your-backend.onrender.com/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the saved JWT to every request automatically, if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
