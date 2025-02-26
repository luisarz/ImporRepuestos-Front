import configApi from "./config.js";
// Servicio de autenticación
const authService = {
    login: async (username, password) => {
      try {
        const response = await configApi.post(`/api/v1/login`, {
          email:username,
          password:password
        });
        console.log(response)
        return response.data; // Devuelve el token recibido
      } catch (error) {
        console.log(error)
        throw new Error('Usuario o contraseña incorrectos');
      }
    },
    logout: () => {
      localStorage.removeItem('auth_token');
    },
    getToken: () => {
      return localStorage.getItem('auth_token');
    },
    isAuthenticated: () => {
      return !!localStorage.getItem('auth_token');
    }
  };
  
  export default authService;