import {configApi, urlApi} from "./config.js";

const inventoryService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/inventories`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (formData) => {
        try {
            const response = await configApi.post(`/v1/inventories`, formData);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async ( formData) => {
        try {
            const id = formData.get('id'); // ✅ así se accede
            const response = await configApi.post(`/v1/inventories/${id}`, formData, {
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
            const response = await configApi.get(`/v1/inventories/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/inventories`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/inventories/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default inventoryService;