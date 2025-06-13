import {configApi} from ".././config.js";

const dteService = {

    generateDTE: async (idVenta) => {
        try {
            const response = await configApi.get(`/v1/generarDTE/${idVenta}`);
            return response.data;
        } catch (error) {
            console.log("Generando DTE "+error)
        }
    },
    cancelDTE: async (idVenta) => {
        try {
            // console.log(jobTitle.stablishment_type_id);
            const response = await configApi.get(`/v1/sendAnularDTE/${idVenta}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al Obtener las Sucursales');
        }
    },
    sendEmailDTE: async (idVenta) => {
        try {
            const response = await configApi.get(`/v1/sendDTE/${idVenta}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error('Error al recuperar la Sucursal');
        }
    },
    printTicketDTE:async (idVenta) => {
        try {
            return await configApi.get(`/v1/printDTETicket/${idVenta}`);
        }catch(error) {
            console.log("Error al imprimir el ticket DTE "+error)
        }
    },

    printPdfDTE: async (idVenta) => {
        try {
            return await configApi.get(`/v1/printDTEPdf/${idVenta}`);
        }catch(error) {
            console.log("Error al imprimir el PDF "+error)
        }
    },
    logDTE: async (idVenta) => {
        try {
            const response = await configApi.get(`/v1/logDTE/${idVenta}`);
            return response.data;
        }catch(error) {
            console.log("Error al imprimir el PDF "+error)
        }
    },


};

export default dteService;