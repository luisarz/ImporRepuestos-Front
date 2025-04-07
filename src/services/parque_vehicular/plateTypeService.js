import {configApi, urlApi} from "./../config.js";

const plateTypeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/plate-types`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (plateType) => {
        try {
            const response = await configApi.post(`/v1/plate-types`, plateType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (plateType) => {
        try {
            // console.log(plateType.stablishment_type_id);
            const response = await configApi.put(`/v1/plate-types/${plateType.id}`, plateType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/plate-types/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/plate-types`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/plate-types/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default plateTypeService;