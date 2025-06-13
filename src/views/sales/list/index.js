import {KTDataTable, KTModal} from '../../../metronic/core/index.js';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '@/components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import ProductsService from "@/services/productsService.js";
import CategoryService from "@/services/categoryService.js";
import BrandService from "@/services/brandService.js";
import UnitMeasurementService from "@/services/hacienda/unitMeasurementService.js";
import {urlApi, VUE_APP_STORAGE_URL} from "@/services/config.js";
import EquivalentService from "@/services/equivalentService.js";
import Swal from 'sweetalert2';
import WarehouseService from "@/services/warehouseService.js";
import Inventory from "@/services/inventoryService.js";
import ProviderService from "@/services/providers/providerService.js";
import MediumModal from "@/components/MediumModal.vue";
import PricesService from "@/services/pricesService.js";
import SaleHeader from "@/services/saleService.js";
import dteService from "@/services/DTE/dteService.js";
// @ts-ignore
// @ts-ignore
export default {
    components: {MediumModal, LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            pdfUrl: null,
            loading: false,
            warehouses: [],

            sale: {
                id: 0,
                warehouse_id: 0,
                product_id: 0,
                provider_id: 0,
                last_cost_without_tax: 0,
                last_cost_with_tax: 0,
                stock_actual_quantity: 0,
                stock_min: 0,
                alert_stock_min: 0,
                stock_max: 0,
                alert_stock_max: 0,
                last_purchase: null,
                is_active: false,

            },

        };
    },

    methods: {

        newSale() {
            this.$router.push({name: 'sale-new'});
        },

        async loadWarehouse() {
            try {
                const response = await WarehouseService.get();
                this.warehouses = response.data || [];
            } catch (error) {
                console.error('Error al cargar las sucursales:', error);
                this.warehouses = [];
            }
        },
        async generateDTE(_idsale) {
            const confirmGenerateDTE = await Swal.fire({
                title: '¿Generar DTE?',
                text: "¿Estás seguro de que deseas generar el DTE?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, generar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'btn btn-danger me-2',
                    cancelButton: 'btn btn-info'
                }
            });
            if (confirmGenerateDTE.isConfirmed) {
                console.log("Usuario confirmó generación del DTE");

                // Mostrar loading spinner
                let loadingSwal = Swal.fire({
                    title: 'Generando DTE...',
                    text: 'Por favor espera',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    const response = await dteService.generateDTE(_idsale);

                    // Cerrar el loading spinner antes de mostrar el resultado
                    await Swal.close();

                    if (response.estado === "EXITO") {
                        await Swal.fire({
                            icon: 'success',
                            title: 'DTE generado',
                            text: response.mensaje,
                            customClass: {
                                confirmButton: 'btn btn-success me-2',
                            }
                        });
                        location.reload();
                    } else {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Error al generar DTE',
                            text: response.original.message || 'Ocurrió un error al generar el DTE.',
                            customClass: {
                                confirmButton: 'btn btn-danger me-2',
                            }
                        });
                    }
                } catch (error) {
                    // Cerrar el loading spinner antes de mostrar el error
                    await Swal.close();
                    console.error("Error al generar el DTE", error);

                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo generar el DTE.'
                    });
                }
            }


        },
        async cancelDte(_idsale) {
            await Swal.fire({
                title: '¿Invalidar DTE?',
                text: "¿Estás seguro de que deseas invalidar el DTE?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Invalidar',
                cancelButtonText: 'Cancelar proceso',
                customClass: {
                    confirmButton: 'btn btn-danger me-2',
                    cancelButton: 'btn btn-info'
                }
            })
        },
        async sendEmail(_idsale) {
            await Swal.fire({
                title: 'Enviar correo',
                text: "¿Estás seguro de que deseas enviar el correo?",
                icon: 'info',
                allowEscapeKey: false,
                showCancelButton: true,
                confirmButtonText: 'Sí, enviar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'btn btn-success me-2',
                    cancelButton: 'btn btn-info'
                }
            })
            const response = await dteService.sendEmailDTE(_idsale);
            console.log(response.data);
        },
        async printTicketDTE(_idsale) {
            try {
                const response = await dteService.printTicketDTE(_idsale);
// console.log(response.data.pdf);

                // 2. Verificar estructura de respuesta
                if (!response.data || !response.data.pdf) {
                    throw new Error('La respuesta no contiene datos PDF');
                }

                // 3. Convertir a string seguro
                const base64Data = this.ensureString(response.data.pdf);

                // 4. Limpiar y decodificar
                const cleanedBase64 = base64Data.replace(/\s/g, '');
                const binaryString = atob(cleanedBase64);
                const bytes = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // 5. Crear y mostrar PDF
                const blob = new Blob([bytes], {type: 'application/pdf'});
                const url = URL.createObjectURL(blob);

                // Opción 1: Abrir en nueva pestaña
                window.open(url, '_blank');


            } catch (error) {
                console.error("Error al imprimir el ticket DTE", error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo imprimir el ticket DTE.'
                });
            }
        },
        async printPdfDTE(_idsale) {
            try {
                // 1. Llamar al servicio para obtener el PDF
                const response = await dteService.printPdfDTE(_idsale);
                // 2. Verificar estructura de respuesta
                if (!response.data || !response.data.pdf) {
                    throw new Error('La respuesta no contiene datos PDF');
                }

                // 3. Convertir a string seguro
                const base64Data = this.ensureString(response.data.pdf);
                // 4. Limpiar y decodificar
                const cleanedBase64 = base64Data.replace(/\s/g, '');
                const binaryString = atob(cleanedBase64);
                const bytes = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // 5. Crear y mostrar PDF
                const blob = new Blob([bytes], {type: 'application/pdf'});
                const url = URL.createObjectURL(blob);

                // Opción 1: Abrir en nueva pestaña
                window.open(url, '_blank');


            } catch (error) {
                console.error("Error al imprimir el ticket DTE", error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo imprimir el ticket DTE.'
                });
            }
        },
        // Función auxiliar para asegurar string
        ensureString(data) {
            if (typeof data === 'string') return data;
            if (data instanceof String) return data.toString();
            if (data && data.toString) return data.toString();
            return String(data);
        },

        loadSales() {
            const tablePriceElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: `${urlApi}/v1/sales`,
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    select: {
                        render: (item, data, context) => {
                            const checkbox = document.createElement('input');
                            checkbox.className = 'checkbox checkbox-sm';
                            checkbox.type = 'checkbox';
                            checkbox.value = data.id.toString();
                            checkbox.setAttribute('data-datatable-row-check', 'true');
                            return checkbox.outerHTML.trim();
                        },
                    },
                    // comercial_name: {title: 'Nombre Comercial'},
                    edit: {
                        render: (data, type, rowData) => {
                            if (type.is_dte === 0 && type.sale_status == 2) {//Procesando
                                return `
                                    <!--Send DTE-->
                                    <button class="btn btn-sm btn-icon btn-danger btn-outline btn-light generate-dte" data-offset="60px 0px" data-toggle="tooltip" data-placement="top" title="Generar DTE">
                                        <i class="ki-outline ki-satellite text-lg text-danger text-center"></i>
                                    </button>
                                      <!--log DTE-->
                                    <button class="btn btn-sm btn-icon btn-info btn-outline btn-light log-dte">
                                        <i class="ki-outline ki-fingerprint-scanning text-lg text-danger text-center"></i>
                                    </button>
                                `;
                            }
                            if (type.is_dte === 0 && type.sale_status == 1) {//Procesando
                                return `
                                    <!--Editar venta-->
                                    <button class="btn btn-sm btn-icon btn-warning btn-outline btn-light edit-sale-btn" 
                                        data-offset="60px 0px" 
                                        data-toggle="tooltip" 
                                        data-placement="top" 
                                        title="Modificar venta">
                                        <i class="ki-outline ki-pencil text-lg text-danger text-center"></i>
                                    </button>
                                   
                                `;
                            }
                            if (type.is_dte === 1 && type.sale_status == 3) {//Procesando
                                return `
                                    <!--print ticket-->
                                    <button class="btn btn-sm btn-icon btn-info btn-outline btn-light me-1 print-ticket-btn">
                                        <i class="ki-filled ki-printer"></i>
                                    </button>
                                    
                                    <!-- print pdf-->
                                    <button class="btn btn-sm btn-icon btn-info btn-outline btn-light me-1 print-pdf-btn">
                                        <i class="ki-filled ki-printer"></i>
                                    </button>
                                    
                                    <!--log DTE-->
                                    <button class="btn btn-sm btn-icon btn-info btn-outline btn-light log-dte">
                                        <i class="ki-outline ki-fingerprint-scanning text-lg text-danger text-center"></i>
                                    </button>
                                   
                                `;
                            }


                            return `
          <!--print ticket-->
            <button class="btn btn-sm btn-icon btn-info btn-outline btn-light me-1 print-ticket-btn">
                <i class="ki-filled ki-printer"></i>
            </button>
            
            <!-- print pdf-->
            <button class="btn btn-sm btn-icon btn-info btn-outline btn-light me-1 print-pdf-btn">
                <i class="ki-filled ki-printer"></i>
            </button>
        
            <!--Send Email-->
            <button class="btn btn-sm btn-icon btn-outline btn-warning btn-light me-1 send-email">
                <i class="ki-filled ki-sms"></i>
            </button>
            <!--Cancel DTE-->
            <button class="btn btn-sm btn-icon btn-danger btn-outline btn-light me-1 cancel-dte">
                <i class="ki-filled ki-dislike"></i>
            </button>
            <!--log DTE-->
            <button class="btn btn-sm btn-icon btn-success btn-outline btn-light log-dte">
                <i class="ki-outline ki-medal-star text-lg text-danger text-center"></i>
            </button>
            
        `;
                        },
                        createdCell: (cell, cellData, rowData) => {
                            // Editar
                            cell.querySelector('.edit-sale-btn')?.addEventListener('click', () => {
                                this.$router.push({name: 'sale-edit', params: {id: rowData.id}});
                            });
                            cell.querySelector('.print-ticket-btn')?.addEventListener('click', () => {
                                this.printTicketDTE(rowData.generationCode);
                            });
                            cell.querySelector('.print-pdf-btn')?.addEventListener('click', () => {
                                this.printPdfDTE(rowData.generationCode);
                            });
                            cell.querySelector('.send-email')?.addEventListener('click', () => {
                                this.sendEmail(rowData.id);
                            });
                            cell.querySelector('.cancel-dte')?.addEventListener('click', () => {
                                this.cancelDte(rowData.generationCode);
                            });
                            cell.querySelector('.log-dte')?.addEventListener('click', () => {
                                this.showLog(rowData.id);
                            });
                            cell.querySelector('.generate-dte')?.addEventListener('click', () => {
                                this.generateDTE(rowData.id);
                            });

                            cell.classList.add('text-right');
                        }
                    },


                    warehouse_id: {
                        title: 'Sucursal',
                        render: function (data, type, row) {
                            return type?.warehouse?.name ?? 'SN';
                        },
                        createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                        search: true,
                    },
                    formatted_date: {
                        title: 'formatted_date',
                        render: function (data, type, row) {
                            return type?.formatted_date ?? 'SN';
                        },
                        createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                        search: true,
                    },

                    document_type_id: {
                        title: 'document_type_id',
                        render: function (data, type, row) {
                            return type?.document_type?.name ?? 'SN';
                        },
                        createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                    },
                    document_internal_number: {
                        title: 'document_internal_number',
                        createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },


                    },
                    is_dte: {
                        title: 'is_dte',
                        render: function (item, data, row) {

                            return data?.is_dte
                                ? `<span class="badge badge-success badge-outline text-center">
           <i class="ki-outline ki-check-circle fs-6 me-1"></i> Enviado
       </span>`
                                : `<span class="badge badge-danger badge-outline text-center">
           <i class="ki-outline ki-underlining fs-6 me-1"></i> Pendiente
       </span>`;

                        },
                    },
                    billing_model: {
                        title: 'Modelo de facturación',
                        render: function (data, type, row) {
                            return type.billing_model === 1
                                ? `<span class="badge badge-success badge-outline text-center">Previo</span>`
                                : row.billing_model === 0
                                    ? `<span class="badge badge-danger badge-outline text-center">Diferido</span>`
                                    : row?.billing_model?.name ?? 'SN';
                        },
                        createdCell(cell) {
                            cell.classList.add('text-center');
                        },
                    },

                    seller: {
                        title: 'seller',
                        render: function (data, type, row) {
                            const seller = type?.seller.name + ' ' + type?.seller.last_name;
                            return seller ?? 'SN';
                        },
                        createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                    },

                    customer_id: {
                        title: 'Cliente',
                        render: function (data, type, row) {
                            const customer = type?.customer.name + ' ' + type?.customer.last_name;
                            return customer ?? 'SN';
                        },
                        createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                    },
                    payment_method: {
                        title: 'Forma de pago',
                        render: function (data, type, row) {
                            return type?.operation_condition?.name ?? 'SN';
                        }, createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                    },
                    sale_status: {
                        title: 'Estado de venta',
                        render: function (sale_status) {
                            const status = {
                                1: 'En progreso',
                                2: 'Facturada',
                                3: 'Cancelada',
                            }[sale_status];
                            return status;
                        }, createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                    },
                    total_sale_formatted: {
                        title: 'Total de venta',
                        render: function (data, type, row) {
                            return '$ ' + type?.total_sale_formatted ?? 'SN';
                        },
                        createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('text-right', 'font-bold');
                        }
                    },


                },

                layout: {scroll: true},
                sortable: true,
                stateSave: true,

                search: {
                    input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                    key: 'search', // Parámetro que se enviará al servidor
                    delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                },
            };
            const dataTable = new KTDataTable(tablePriceElement, options);
            dataTable.showSpinner();


        },


    }
    ,

    mounted() {
        this.loadWarehouse();
        this.loadSales();
        // window.editModal = this.editModal.bind(this);
    }
    ,
}
;