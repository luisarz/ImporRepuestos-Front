import {configApi, urlApi} from "./../config.js";

const vehicleModelService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/vehicle-models`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (vehicleModel) => {
        try {
            const response = await configApi.post(`/v1/vehicle-models`, vehicleModel);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (vehicleModel) => {
        try {
            // console.log(vehicleModel.stablishment_type_id);
            const response = await configApi.put(`/v1/vehicle-models/${vehicleModel.id}`, vehicleModel);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/vehicle-models/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/vehicle-models`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/vehicle-models/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default vehicleModelService;