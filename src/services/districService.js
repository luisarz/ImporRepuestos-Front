import {configApi, urlApi} from "./config.js";

const districtService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/districts`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (districts) => {
        try {
            const response = await configApi.post(`/v1/districts`, districts);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (districts) => {
        try {
            const response = await configApi.put(`/v1/districts/${districts.id}`, districts);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/districts/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/districts`;
    },


};

export default districtService;