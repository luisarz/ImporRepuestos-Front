import {configApi, urlApi} from "./config.js";

const equivalentService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/equivalents`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener los prodúctos');
        }
    },
    store: async (equivalent) => {
        try {
            const response = await configApi.post(`/v1/equivalents`, equivalent);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async ( equivalent) => {
        try {
            const response = await configApi.put(`/v1/equivalents/${equivalent.id}`, equivalent);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar producto:', error.response || error);
            throw error;
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/equivalents/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/equivalents`;
    },
    getEquivalentByProduct: async (id) => {
        try {
            const response = await configApi.get(`/v1/equivalents/product/${id}`);
            console.log(response);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/equivalents/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default equivalentService;