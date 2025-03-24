import {configApi, urlApi} from "./../config.js";

const rolService = {
    get: async () => {
        try {
            const response = await configApi.get(`/v1/roles`);
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getPermission:async () => {
      try {
          const response = await configApi.get(`/v1/permissions`);
          return response.data.data;
      }catch(error) {
            console.log(error)
            throw new Error('Error al Obtener los Permisos');
      }
    },
    store: async (rol) => {
        try {
            const response = await configApi.post(`/v1/roles`, rol);
            return response.data;
        } catch (error) {
            alert('Error al Obtener los Permisos' + error);
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    update: async (rol) => {
        try {
            // console.log(rol.stablishment_type_id);
            const response = await configApi.put(`/v1/roles/${rol.id}`, rol);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    getOne: async (id) => {
        try {
            const response = await configApi.get(`/v1/roles/${id}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    getUrl: () => {
        return `${urlApi}/v1/roles`;
    },
    destroy: async (id) => {
        try {
            const response = await configApi.delete(`/v1/roles/${id}`);
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Categorias');
        }
    },


};

export default rolService;