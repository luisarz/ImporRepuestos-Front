import {configApi, urlApi} from "./config.js";

const companyService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/company`);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },
    store: async (company) => {
        try {
            const response = await configApi.post(`/v1/company`, company);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },
    update: async (company) => {
        try {
            const response = await configApi.put(`/v1/company/${company.id}`, company);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/company/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuper la Compañia');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/company`;
    },


};

export default companyService;