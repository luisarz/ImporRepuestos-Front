// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://204.48.22.137:8000',  // Cambia esto por la URL base de tu API
  timeout: 10000,  // Tiempo de espera para la solicitud (en milisegundos)
  headers: {
    'Content-Type': 'application/json',  // Especifica que estamos enviando datos JSON
  },
});

export default api;
