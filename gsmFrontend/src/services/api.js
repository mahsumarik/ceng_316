import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
});

// Her istek öncesi localStorage'daki JWT'yi tak
api.interceptors.request.use((config) => {
  // Tarayıcıdaki localStorage'dan JWT token'ını alıyoruz. Eğer kullanıcı daha önce giriş yaptıysa ve token'ı sakladıysa, bu token her isteğe eklenir.
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
