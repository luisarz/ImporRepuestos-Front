import {configApi, urlApi} from "./config.js";

const customerService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/customers`);

            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (customer) => {
        try {
            const response = await configApi.post(`/v1/customers`, customer);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (customer) => {
        try {
            // console.log(customer.stablishment_type_id);
            const response = await configApi.put(`/v1/customers/${customer.id}`, customer);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/customers/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/customers`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/customers/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default customerService;