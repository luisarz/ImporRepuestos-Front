import {configApi, urlApi} from "./config.js";

const interchangeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/interchanges`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener los prodúctos');
        }
    },
    store: async (interchange) => {
        try {
            const response = await configApi.post(`/v1/interchanges`, interchange);
            return response.data;
        } catch (error) {
            console.log(error)
            // throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async ( interchange) => {
        try {
            const response = await configApi.put(`/v1/interchanges/${interchange.id}`, interchange);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar producto:', error.response || error);
            throw error;
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/interchanges/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/interchanges`;
    },
    getInterchangeByProduct:  (id) => {  // Add async here
        try {
            return `${urlApi}/v1/interchanges/product/${id}`;
        } catch (error) {
            console.error('Error getting product interchanges:', error);
        }
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/interchanges/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default interchangeService;