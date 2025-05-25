import {KTDataTable, KTModal} from '../../../metronic/core/index';
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
import Lote from "@/services/loteService.js";
import ProviderService from "@/services/providers/providerService.js";
import MediumModal from "@/components/MediumModal.vue";
// @ts-ignore
// @ts-ignore
export default {
    components: {MediumModal, LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            providers: [],
            products: [],
            warehouses: [],

            entity: {
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
            form: {
                warehouse_id: {isRequired: true, validationSuccess: true},
                product_id: {isRequired: true, validationSuccess: true},
                provider_id: {isRequired: true, validationSuccess: true},
                last_cost_without_tax: {isRequired: false, validationSuccess: true},
                last_cost_with_tax: {isRequired: false, validationSuccess: true},
                stock_actual_quantity: {isRequired: false, validationSuccess: true},
                stock_min: {isRequired: false, validationSuccess: true},
                stock_max: {isRequired: false, validationSuccess: true},
                alert_stock_min: {isRequired: false, validationSuccess: true},
                alert_stock_max: {isRequired: false, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? `Modificar -${this.moduleName}` : `Levantar - ${this.moduleName}`;
        },
        moduleName() {
            return ' Inventarios';
        },
        formattedDate: {
            get() {
                const date = this.entity.last_purchase; // Ajusta la clave si es diferente
                return date ? new Date(date).toISOString().split('T')[0] : '';
            },
            set(value) {
                this.entity.last_purchase = value; // Devuelve el formato correcto
            }
        },


    },
    methods: {
        VUE_APP_STORAGE_URL() {
            return VUE_APP_STORAGE_URL
        },



        // Método para obtener la URL de previsualización de la imagen


        // Método para manejar el cambio de imagen
        async openStoreModal() {
            this.resetModal();
            this.loading = true;
            this.isEditing = false;
            try {
                const storeTemp = await Lote.store(this.entity);
                if (!this.entity) {
                    this.entity = {};
                }
                this.entity.id = storeTemp.data.id;
                this.isEditing = true;
                await this.loadOptions();
                KTModal.getInstance(document.querySelector("#modal_store")).show();
            } catch (error) {
                console.error('Error al crear temporal:', error);
            } finally {
                this.loading = false;
            }

        },
        resetModal() {
            this.entity = null;
        },
        async editModal(data) {
            this.isEditing = true;
            this.entity = {...data};
            this.entity.image = null;


            try {

                await this.loadOptions();
                try {
                    console.log("Antes de cargar price " + this.entity.id);
                    // await this.$nextTick();
                    this.loadPriceTable(this.entity.id);
                } catch (error) {
                    console.error('Error al cargar Precios:', error);
                }

                const modal = KTModal.getInstance(document.querySelector("#modal_store"));
                if (modal) {
                    modal.show();
                } else {
                    console.error("Could not find modal instance");
                }


            } catch (error) {
                console.error("Error in editModal:", error);
            }
        },



        imageUrl() {
            return this.getImagePreview(`${VUE_APP_STORAGE_URL()}/${this.entity.image}`);
        },
      
        async save() {
            if (!this.validationForm()) return;
            this.loading = true;

            try {
                // Preparamos FormData para ambos casos (create y update)
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('id', this.entity.id);
                formData.append('warehouse_id', this.entity.warehouse_id);
                formData.append('product_id', this.entity.product_id);
                formData.append('last_cost_without_tax', this.entity.last_cost_without_tax);
                formData.append('last_cost_with_tax', this.entity.last_cost_with_tax);
                formData.append('stock_actual_quantity', this.entity.stock_actual_quantity);
                formData.append('stock_min', this.entity.stock_min);
                formData.append('alert_stock_min', this.entity.alert_stock_min ? '1' : '0');
                formData.append('stock_max', this.entity.stock_max);
                formData.append('alert_stock_max', this.entity.alert_stock_max ? '1' : '0');
                formData.append('last_purchase', this.entity.last_purchase);
                formData.append('provider_id', this.entity.provider_id);
                formData.append('is_temp', '0');
                formData.append('is_active', this.entity.is_active ? '1' : '0');
                const Lote = await Lote.update(formData);
                console.log(Lote);
                if (Lote?.status === 'success') {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        timer: 1500,
                        showConfirmButton: true,
                        timerProgressBar: true,
                        text: Lote.message,
                        confirmButtonText: 'Aceptar'
                    });
                    location.reload();

                    // this.loadLoteTable();
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: Lote.message,
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                this.isEditing = true;
                this.loading = false;
                console.error('Error al guardar el producto:', error);
            } finally {
                this.isEditing = true;
                this.loading = false;
            }
        },


        loadLoteTable() {
            const tablePriceElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: `${urlApi}/v1/batches`,
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
                    other: {
                        render: function (data, type, row) {
                            const description = type?.inventory?.product?.description ?? 'S/N';
                            const code = type?.inventory?.product?.code ?? 'S/N';
                            const original_code = type?.inventory?.product?.original_code ?? 'S/N';
                            const image = type?.product?.image ?? 'S/N';
                            const imageUrl = image ? `${VUE_APP_STORAGE_URL}${image}` : `${VUE_APP_STORAGE_URL}/images/default.png`;
                            const wareHouse =type?.inventory?.warehouse?.name ?? 'SN';
                            const product = `<div class="flex items-center gap-4">
               
                <div class="flex flex-col gap-0.5">
                 <span class="leading-none font-medium text-sm text-gray-900">
                      ${description.charAt(0).toUpperCase() + description.slice(1).toLowerCase()}
                 </span>
               
                 <span class="text-2sm text-gray-700 font-normal">
                        ${code.charAt(0).toUpperCase() + code.slice(1).toLowerCase()} - CI
                 </span>
                   </span>
                      ${wareHouse}
                 </span>
                </div>
                
               </div>`
                            return product;
                        }
                    },

                    code: {
                        title: 'code',
                        search: true,
                        render: function (data, type, row) {
                            return type?.code ?? 'SN'
                        },
                        createdCell(cell) {
                            cell.classList.add('text-small');
                        }


                    },

                    origen_code: {
                        title: 'origen_code',
                        render: function (data, type, row) {
                            return type?.origen_code?.code ?? 'SN'
                        }
                    },
                    initial_quantity: {
                        title: 'initial_quantity',


                    },
                    available_quantity:{
                        title: 'available_quantity',
                        render: function (data, type, row) {
                            return type?.available_quantity ?? 'SN'
                        }
                    },

                    observations:{
                        title: 'observations',
                        render: function (data, type, row) {
                            return type?.observations ?? 'SN'
                        }
                    },

                    incoming_date: {
                        title: 'Last purchase',
                        render: function (data, type, row) {
                            if (!type?.incoming_date) return 'S/N';
                            const date = new Date(type.incoming_date);
                            return new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(date);
                        }
                    },
                    expiration_date: {
                        title: 'Last purchase',
                        render: function (data, type, row) {
                            if (!type?.expiration_date) return 'S/N';
                            const date = new Date(type.expiration_date);
                            return new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(date);
                        }
                    },


                    // comercial_name: {title: 'Nombre Comercial'},
                    actions: {
                        title: 'Acciones',
                        render: () => `
        <div class="d-flex align-items-center" style="gap: 0.5rem;">
            <button type="button" class="btn btn-sm btn-icon btn-light btn-edit" title="Editar" style="flex: none;">
                <i class="ki-filled ki-notepad-edit"></i>
            </button>
            <button type="button" class="btn btn-sm btn-icon btn-light btn-delete" title="Eliminar" style="flex: none;">
                <i class="ki-outline ki-trash text-danger"></i>
            </button>
        </div>
    `,
                        createdCell: (cell, cellData, rowData) => {
                            cell.querySelector('.btn-edit')?.addEventListener('click', () => this.editModal(rowData));
                            cell.querySelector('.btn-delete')?.addEventListener('click', () => this.deleteProductModal(rowData.id));
                        }
                    }


                },
                layout: {scroll: true},
                sortable: true,
                stateSave: true,
                infoEmpty: 'No hay datos disponibles',
                search: {
                    input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                    key: 'search', // Parámetro que se enviará al servidor
                    delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                },
            };
            const dataTable = new KTDataTable(tablePriceElement, options);
            dataTable.showSpinner();

        },
        loadPriceTable(id) {
            try {
                const tablePrices = document.querySelector("#table_prices");

                if (!tablePrices) {
                    console.error('Elemento #table_prices no está en el DOM aún.');
                    return;
                }

                const optionsTablePrice = {
                    type: 'remote',
                    apiEndpoint: `${urlApi}/v1/prices/Lote/${id}?_=${Date.now()}`,
                    requestHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    columns: {

                        price_description: {
                            title: 'Descripción',
                        },
                        price: {
                            title: 'Precio',
                        },
                        utility: {
                            title: 'Utilidad',
                        },
                        is_default: {
                            title: 'Predeterminado',
                        },
                    },
                    layout: {scroll: true},
                    sortable: true,
                    stateSave: true,
                };

                if (this.dataTablePrices) {
                    this.dataTablePrices.dispose();
                    this.dataTablePrices.reload(optionsTablePrice);
                    console.log('Tabla anterior eliminada');
                }

                this.dataTablePrices = new KTDataTable(tablePrices, optionsTablePrice);
                console.log('Nueva tabla de precios inicializada');
            } catch (error) {
                console.error('Error al cargar la tabla de precios:', error);
            }
        },

        async loadOptions() {
            try {

                const [categories, brands, unitsMeasurement, products, warehouses, providers] = await
                    Promise.all(
                        [
                            CategoryService.get(),
                            BrandService.get(),
                            UnitMeasurementService.get(),
                            ProductsService.get(),
                            WarehouseService.get(),
                            ProviderService.get()
                        ]);

                this.categories = categories.data || [];
                this.brands = brands.data || []; // Asegúrate de que sea un array
                this.unitsMeasurement = unitsMeasurement.data || []; // Asegúrate de que sea un array
                this.products = products.data || []; // Asegúrate de que sea un array
                this.warehouses = warehouses.data || []; // Asegúrate de que sea un array
                this.providers = providers.data || []; // Asegúrate de que sea un array


            } catch (error) {
                this.categories = [];
                this.providers = [];
                this.brands = [];
                this.products = [];
                this.warehouses = [];
                console.error('Error al cargar las opciones:', error);
            }
        },


    },

    mounted() {
        this.loadLoteTable();
        // window.editModal = this.editModal.bind(this);
    },
};