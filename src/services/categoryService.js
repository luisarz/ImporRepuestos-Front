import {configApi,urlApi} from "./config.js";

const categoryService = {
    get: async () => {
      try {
        const response = await configApi.get(`/v1/categories`);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error('Error al Obtener las Categorias');
      }
    },
    store: async (category) => {
      try {
        const response = await configApi.post(`/v1/categories`,category);
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error('Error al almacenar las Categoría');
      }
    },
    update: async (category) => {
      try {
        const response = await configApi.put(`/v1/categories/${category.id}`,category);
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error('Error al actualizar la Categoría');
      }
    },
    destroy: async (id) => {
      try {
        const response = await configApi.delete(`/v1/categories/${id}`);
        return response.data;
      } catch (error) {
        console.log(error.response.data)
        throw new Error('Error al eliminar la Categoría');
      }
    },
    getUrl:() => {
        return `${urlApi}/v1/categories`;
    },
  };
  
export default categoryService;