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
// @ts-ignore
// @ts-ignore
export default {
    components: {MediumModal, LongModal, GeneralModal, QuestionModal},
    data() {
        return {
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
       async sendDte(_idsale){
                await Swal.fire({
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
                })
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

                            if (type.is_dte === 0) {
                                return `
                <!--Send DTE-->
                <button class="btn btn-sm btn-icon btn-danger btn-outline btn-light send-dte">
                    <i class="ki-outline ki-rocket text-lg text-danger text-center"></i>
                    
                </button>
            `;
                            }

                            return `
            <!-- print pdf-->
            <button class="btn btn-sm btn-icon btn-info btn-outline btn-light me-1 print-pdf-btn">
                <i class="ki-filled ki-printer"></i>
            </button>
            <!--print ticket-->
            <button class="btn btn-sm btn-icon btn-info btn-outline btn-light me-1 print-ticket-btn">
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
                            cell.querySelector('.print-pdf-btn')?.addEventListener('click', () => {
                                this.printPdf(rowData.id);
                            });
                            cell.querySelector('.print-ticket-btn')?.addEventListener('click', () => {
                                this.printTicket(rowData.id);
                            });
                            cell.querySelector('.send-email')?.addEventListener('click', () => {
                                this.sendEmail(rowData.id);
                            });
                            cell.querySelector('.cancel-dte')?.addEventListener('click', () => {
                                this.cancelDte(rowData.id);
                            });
                            cell.querySelector('.log-dte')?.addEventListener('click', () => {
                                this.showLog(rowData.id);
                            });
                            cell.querySelector('.send-dte')?.addEventListener('click', () => {
                                this.sendDte(rowData.id);
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
                        },createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                    },
                    sale_status: {
                        title: 'Estado de venta',
                        render: function (sale_status) {
                            const status = {
                                1: 'Procesando',
                                2: 'Finalizada',
                                3: 'Anulada'
                            }[sale_status] ?? 'Finalizada';
                            return status;
                        },createdCell: (cell, cellData, rowData) => {
                            cell.classList.add('font-normal');
                        },
                    },
                    total_sale_formatted:{
                      title: 'Total de venta',
                        render: function (data, type, row) {
                            return '$ ' +type?.total_sale_formatted ?? 'SN';
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