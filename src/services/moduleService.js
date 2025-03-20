import {configApi, urlApi} from "./config.js";

const moduleService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/modulos`);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },
    store: async (modulo) => {
        try {
            const response = await configApi.post(`/v1/modulos`, modulo);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },
    update: async (modulo) => {
        try {
            const response = await configApi.put(`/v1/modulos/${modulo.id}`, modulo);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/modulos/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/modulos`;
    },


};

export default moduleService;