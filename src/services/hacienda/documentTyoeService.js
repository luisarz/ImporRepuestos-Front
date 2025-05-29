import {configApi, urlApi} from "./../config.js";

const documentTyoeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/countries`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (country) => {
        try {
            const response = await configApi.post(`/v1/countries`, country);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (country) => {
        try {
            // console.log(country.stablishment_type_id);
            const response = await configApi.put(`/v1/countries/${country.id}`, country);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/countries/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/countries`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/countries/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default documentTyoeService;