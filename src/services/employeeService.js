import {configApi, urlApi} from "./config.js";

const employeeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/employees`);
            // console.log("response");
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (employe) => {
        try {
            const response = await configApi.post(`/v1/employees`, employe);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (employe) => {
        try {
            // console.log(employe.stablishment_type_id);
            const response = await configApi.put(`/v1/employees/${employe.id}`, employe);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/employees/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/employees`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/employees/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default employeeService;