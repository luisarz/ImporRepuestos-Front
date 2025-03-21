// src/services/api.js
import axios from 'axios';
import authService from './authService';

// export const urlApi = 'https://impor-api.laravel.cloud/api';
export const urlApi = 'http://127.0.0.1:8000/api';

export const configApi = axios.create({
  baseURL: urlApi,  // Cambia esto por la URL base de tu API
  timeout: 10000,  // Tiempo de espera para la solicitud (en milisegundos)
  headers: {
    'Content-Type': 'application/json',  // Especifica que estamos enviando datos JSON
  },
});

// Interceptor para añadir el token a cada solicitud (si existe)
configApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken(); // Obtener el token del servicio de autenticación
    if (token) {
      // Si el token existe, lo añadimos al encabezado Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
configApi.interceptors.response.use(
  (response) => {
    return response; // Si la respuesta es exitosa, la retornamos
  },
  (error) => {
    // Manejo de errores global
    if (error.response && error.response.status === 401) {
      // Si la respuesta es un error 401 (No autorizado), podemos redirigir al login
      authService.logout(); // Eliminar el token si ha expirado o es inválido
      window.location.href = '/sign-in'; // Redirigir a la página de inicio de sesión
    }
    return Promise.reject(error); // Si ocurre otro tipo de error, lo pasamos
  }
);


