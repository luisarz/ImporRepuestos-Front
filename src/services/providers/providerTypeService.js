import {configApi, urlApi} from "./../config.js";

const providerTypeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/providers-types`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (providersType) => {
        try {
            const response = await configApi.post(`/v1/providers-types`, providersType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (providersType) => {
        try {
            // console.log(providersType.stablishment_type_id);
            const response = await configApi.put(`/v1/providers-types/${providersType.id}`, providersType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/providers-types/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/providers-types`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/providers-types/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default providerTypeService;