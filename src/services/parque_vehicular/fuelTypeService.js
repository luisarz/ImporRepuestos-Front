import {configApi, urlApi} from "./../config.js";

const fuelTypeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/fuel-types`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (fuelType) => {
        try {
            const response = await configApi.post(`/v1/fuel-types`, fuelType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (fuelType) => {
        try {
            // console.log(fuelType.stablishment_type_id);
            const response = await configApi.put(`/v1/fuel-types/${fuelType.id}`, fuelType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/fuel-types/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/fuel-types`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/fuel-types/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default fuelTypeService;