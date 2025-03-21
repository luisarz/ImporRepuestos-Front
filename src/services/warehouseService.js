import {configApi, urlApi} from "./config.js";

const warehouseService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/warehouse`);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (warehouse) => {
        try {
            const response = await configApi.post(`/v1/warehouse`, warehouse);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (warehouse) => {
        try {
            const response = await configApi.put(`/v1/warehouse/${warehouse.id}`, warehouse);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/warehouse/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/warehouse`;
    },


};

export default warehouseService;