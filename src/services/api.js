import axios from 'axios';

// Instancia centralizada de Axios apuntando al backend de Spring Boot
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Interceptor: Inyecta el token de seguridad en los headers en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;