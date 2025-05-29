import {configApi, urlApi} from "./config.js";

const saleItemItemService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/sale-items`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursale-items');
        }
    },
    store: async (saleItem) => {
        try {
            const response = await configApi.post(`/v1/sale-items`, saleItem);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursale-items');
        }
    },
    update: async ( saleItem) => {
        try {
            const id = saleItem.get('id'); // ✅ así se accede
            const response = await configApi.post(`/v1/sale-items/${id}`, saleItem, {
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
    getOne: async (sale_id) => {
        try {
            const response = await configApi.get(`/v1/sale-items/${sale_id}`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/sale-items`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/sale-items/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default saleItemItemService;