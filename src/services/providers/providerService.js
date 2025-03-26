import {configApi, urlApi} from "./../config.js";

const providerService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/providers`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (provider) => {
        try {
            const response = await configApi.post(`/v1/providers`, provider);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (provider) => {
        try {
            // console.log(provider.stablishment_type_id);
            const response = await configApi.put(`/v1/providers/${provider.id}`, provider);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/providers/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/providers`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/providers/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default providerService;