import {configApi,urlApi} from "./config.js";

const moduleService = {
    get: async () => {
      try {
        const response = await configApi.get(`/v1/modulos`);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error('Error al Obtener las Categorias');
      }
    },
    store: async (modulo) => {
      try {
        const response = await configApi.post(`/v1/modulos`, modulo);
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error('Error al Obtener las Categorias');
      }
    },
    destroy: async (id) => {
      try {
        const response = await configApi.delete(`/v1/modulos/${id}`);
      } catch (error) {
        console.log(error)
        throw new Error('Error al Obtener las Categorias');
      }
    },
    getUrl:() => {
      return `${urlApi}/v1/modulos`;
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/modulos/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener el módulo:", error);
            // throw new Error('Error al obtener el módulo');
        }
    },
    update: async (id, modulo) => {
        try {
            const response = await configApi.put(`/v1/modulos/${id}`, modulo); // Use PUT or PATCH
            return response.data;
        } catch (error) {
            console.error("Error al actualizar el módulo:", error); // Use console.error
            throw new Error('Error al actualizar el módulo'); // Corrected error message
        }
    },
};
  
export default moduleService;