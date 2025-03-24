import {configApi, urlApi} from "./../config.js";

const providerTypeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/economic-activities`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (economicActivity) => {
        try {
            const response = await configApi.post(`/v1/economic-activities`, economicActivity);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (economicActivity) => {
        try {
            // console.log(economicActivity.stablishment_type_id);
            const response = await configApi.put(`/v1/economic-activities/${economicActivity.id}`, economicActivity);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/economic-activities/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/economic-activities`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/economic-activities/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default providerTypeService;