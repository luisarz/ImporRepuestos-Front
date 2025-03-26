import {configApi, urlApi} from "./config.js";

const productService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/products`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (product) => {
        try {
            const response = await configApi.post(`/v1/products`, product);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (product) => {
        try {
            // console.log(product.stablishment_type_id);
            const response = await configApi.put(`/v1/products/${product.id}`, product);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/products/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/products`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/products/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default productService;