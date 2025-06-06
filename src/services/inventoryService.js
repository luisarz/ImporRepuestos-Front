import {configApi, urlApi} from "./config.js";
import Swal from "sweetalert2";

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
            if (error.response && error.response.status === 422) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al actualizar el producto, complete todos los campos requeridos',
                    showConfirmButton: true,
                })
                // console.log(error.response.data.errors); // Aquí están los detalles de los errores
            }
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