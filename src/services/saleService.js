import {configApi, urlApi} from "./config.js";
import {createRouterMatcher as Promise} from "vue-router";

const saleService = {
    // Obtener todas las ventas (paginadas)
    get: async (params = {}) => {
        try {
            const response = await configApi.get(`/v1/sales`, {params});
            return response.data;
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
            // throw new Error('Error al obtener el listado de ventas');
        }
    },


    // Crear una nueva venta
    store: async (saleData) => {
        try {
            const response = await configApi.post(`/v1/sales`, saleData);
            return response.data;
        } catch (error) {
            console.error('Error al crear la venta:', error);
            // throw new Error(error.response?.data?.message || 'Error al crear la venta');
        }
    },

    // Actualizar una venta existente
    update: async (sale) => {
        try {
            const response = await configApi.put(`/v1/sales/${sale.id}`, sale);
            console.log(sale);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la venta:', error);
            // throw new Error(error.response?.data?.message || 'Error al actualizar la venta');
        }
    },


    // Obtener una venta específica
    getById: async (id) => {
        try {
            const response = await configApi.get(`/v1/sales/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener la venta:', error);
            throw new Error(error.response?.data?.message || 'Error al obtener los datos de la venta');
        }
    },

    // Eliminar una venta
    delete: async (id) => {
        try {
            const response = await configApi.delete(`/v1/sales/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
            throw new Error(error.response?.data?.message || 'Error al eliminar la venta');
        }
    },

    // Obtener URL base del endpoint
    getUrl: () => `${urlApi}/v1/sales`,

    // Métodos adicionales que podrías necesitar:

    // Obtener items de una venta
    getItems: async (saleId) => {
        try {
            const response = await configApi.get(`/v1/sales/${saleId}/items`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener items de la venta:', error);
            throw new Error('Error al obtener los items de la venta');
        }
    },

    // Cambiar estado de una venta
    updateStatus: async (saleId, status) => {
        try {
            const response = await configApi.patch(`/v1/sales/${saleId}/status`, {status});
            return response.data;
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            throw new Error('Error al actualizar el estado de la venta');
        }
    }
};

export default saleService;