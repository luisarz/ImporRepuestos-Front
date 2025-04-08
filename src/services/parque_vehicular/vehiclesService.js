import {configApi, urlApi} from "./../config.js";

const vehicleService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/vehicles`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (vehicle) => {
        try {
            const response = await configApi.post(`/v1/vehicles`, vehicle);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (vehicle) => {
        try {
            // console.log(vehicle.stablishment_type_id);
            const response = await configApi.put(`/v1/vehicles/${vehicle.id}`, vehicle);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/vehicles/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/vehicles`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/vehicles/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default vehicleService;