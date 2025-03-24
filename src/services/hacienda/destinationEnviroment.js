import {configApi, urlApi} from "./../config.js";

const destinationEnviromentService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/unit-measurements`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (unitMeasurement) => {
        try {
            const response = await configApi.post(`/v1/unit-measurements`, unitMeasurement);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (unitMeasurement) => {
        try {
            // console.log(unitMeasurement.stablishment_type_id);
            const response = await configApi.put(`/v1/unit-measurements/${unitMeasurement.id}`, unitMeasurement);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/unit-measurements/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/unit-measurements`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/unit-measurements/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default destinationEnviromentService;