import axios from 'axios';

// Base Axios Instance Setup
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Apne backend port/URL ke mutabiq change kar sakte hain
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatic JWT token attach karne ke liye (agar user logged in hai)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;