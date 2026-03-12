import axios from 'axios';

// Create an Axios instance with base URL pointing to our Express backend
const api = axios.create({
  baseURL: 'https://tugasukt-tf4v.vercel.app/api',
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lampStoreToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
