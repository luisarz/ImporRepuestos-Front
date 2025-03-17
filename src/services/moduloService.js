import { configApi } from "./config.js";

const moduloService = {
  get: async () => {
    try {
      const response = await configApi.get(`/v1/modulos`);
      return response.data.data.data;
    } catch (error) {
      console.log(error)
      throw new Error('Error al Obtener los Modulos');
    }
  },
};

export default moduloService;