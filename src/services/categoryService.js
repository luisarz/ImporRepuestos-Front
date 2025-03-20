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
        throw new Error('Error al Obtener las Categorias');
      }
    },
    update: async (category) => {
      try {
        const response = await configApi.put(`/v1/categories/${category.id}`,category);
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error('Error al Obtener las Categorias');
      }
    },
    destroy: async (id) => {
      try {
        const response = await configApi.delete(`/v1/categories/${id}`);
      } catch (error) {
        console.log(error)
        throw new Error('Error al Obtener las Categorias');
      }
    },
    getUrl:() => {
        return `${urlApi}/v1/categories`;
    },
  };
  
export default categoryService;