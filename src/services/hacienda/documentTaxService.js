import {configApi, urlApi} from "./../config.js";

const documentTaxService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/document-tax`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (documentTax) => {
        try {
            const response = await configApi.post(`/v1/document-tax`, documentTax);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (documentTax) => {
        try {
            // console.log(documentTax.stablishment_type_id);
            const response = await configApi.put(`/v1/document-tax/${documentTax.id}`, documentTax);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/document-tax/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/document-tax`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/document-tax/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default documentTaxService;