import {configApi, urlApi} from "./../config.js";

const paymentMethodService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/payment-methods`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (paymentMethod) => {
        try {
            const response = await configApi.post(`/v1/payment-methods`, paymentMethod);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (paymentMethod) => {
        try {
            // console.log(paymentMethod.stablishment_type_id);
            const response = await configApi.put(`/v1/payment-methods/${paymentMethod.id}`, paymentMethod);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/payment-methods/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/payment-methods`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/payment-methods/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default paymentMethodService;