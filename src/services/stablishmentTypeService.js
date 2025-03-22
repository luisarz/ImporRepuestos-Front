import {configApi, urlApi} from "./config.js";

const establishmentTypeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/establishment-types`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (stablishmentType) => {
        try {
            const response = await configApi.post(`/v1/establishment-types`, stablishmentType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (stablishmentType) => {
        try {
            const response = await configApi.put(`/v1/establishment-types/${stablishmentType.id}`, stablishmentType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/establishment-types/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/establishment-types`;
    },


};

export default establishmentTypeService