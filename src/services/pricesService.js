import {configApi, urlApi} from "./config.js";

const pricesService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/prices`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener los prodúctos');
        }
    },
    store: async (price) => {
        try {
            const response = await configApi.post(`/v1/prices`, price);
            return response.data;
        } catch (error) {
            console.log(error)
            // throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async ( price) => {
        try {
            const response = await configApi.put(`/v1/prices/${price.id}`, price);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar producto:', error.response || error);
            throw error;
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/prices/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/prices`;
    },
    getpricesByInventory:  (id) => {  // Add async here
        try {
            return `${urlApi}/v1/prices/inventory/${id}`;
        } catch (error) {
            console.error('Error getting product prices:', error);
        }
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/prices/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default pricesService;