import {configApi, urlApi} from "./config.js";

const warehouseService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/warehouse`);
            return response.data.data;
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
            // console.log(warehouse.stablishment_type_id);
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
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/warehouse/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default warehouseService;