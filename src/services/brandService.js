import {configApi, urlApi} from "./config.js";

const brandService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/brands`);
            // console.log("response");
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (brand) => {
        try {
            const response = await configApi.post(`/v1/brands`, brand);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (brand) => {
        try {
            // console.log(brand.stablishment_type_id);
            const response = await configApi.put(`/v1/brands/${brand.id}`, brand);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/brands/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/brands`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/brands/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default brandService;