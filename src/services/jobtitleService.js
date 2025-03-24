import {configApi, urlApi} from "./config.js";

const jobTitleService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/jobs-titles`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (jobTitle) => {
        try {
            const response = await configApi.post(`/v1/jobs-titles`, jobTitle);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (jobTitle) => {
        try {
            // console.log(jobTitle.stablishment_type_id);
            const response = await configApi.put(`/v1/jobs-titles/${jobTitle.id}`, jobTitle);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/jobs-titles/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/jobs-titles`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/jobs-titles/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default jobTitleService;