import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://ceng316-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Tarayıcıdaki localStorage'dan JWT token'ını alıyoruz. Eğer kullanıcı daha önce giriş yaptıysa ve token'ı sakladıysa, bu token her isteğe eklenir.
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
