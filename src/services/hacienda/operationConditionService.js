import {configApi, urlApi} from "./../config.js";

const providerTypeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/operation-conditions`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (operationCondition) => {
        try {
            const response = await configApi.post(`/v1/operation-conditions`, operationCondition);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (operationCondition) => {
        try {
            // console.log(operationCondition.stablishment_type_id);
            const response = await configApi.put(`/v1/operation-conditions/${operationCondition.id}`, operationCondition);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/operation-conditions/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/operation-conditions`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/operation-conditions/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default providerTypeService;