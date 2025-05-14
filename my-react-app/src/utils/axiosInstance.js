// src/utils/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://homeeasebackend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json', // ✅ Makes POST requests safe
  }
});

// Request interceptor with error handling
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // ✅ Handles token setup failures or config issues
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

export default instance;
