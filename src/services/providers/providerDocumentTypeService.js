import {configApi, urlApi} from "./../config.js";

const providerDocumentTypeService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/providers-documents-types`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    store: async (providerDocumentType) => {
        try {
            const response = await configApi.post(`/v1/providers-documents-types`, providerDocumentType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (providerDocumentType) => {
        try {
            // console.log(providerDocumentType.stablishment_type_id);
            const response = await configApi.put(`/v1/providers-documents-types/${providerDocumentType.id}`, providerDocumentType);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/providers-documents-types/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/providers-documents-types`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/providers-documents-types/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default providerDocumentTypeService;