import {configApi, urlApi} from "./config.js";

const saleService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/sales`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (Sale) => {
        try {
            const response = await configApi.post(`/v1/sales`, Sale);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async ( Sale) => {
        try {
            const id = Sale.get('id'); // ✅ así se accede
            const response = await configApi.post(`/v1/sales/${id}`, Sale, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar producto:', error.response || error);
            throw error;
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/sales/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/sales`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/sales/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default saleService;