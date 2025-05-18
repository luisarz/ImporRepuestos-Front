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
import Inventory from "@/services/inventoryService.js";
import ProviderService from "@/services/providers/providerService.js";
// @ts-ignore
// @ts-ignore
export default {
    components: {LongModal, GeneralModal, QuestionModal},
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
                last_cost_without_tax: {isRequired: true, validationSuccess: true},
                last_cost_with_tax: {isRequired: true, validationSuccess: true},
                stock_actual_quantity: {isRequired: true, validationSuccess: true},
                stock_min: {isRequired: true, validationSuccess: true},
                stock_max: {isRequired: true, validationSuccess: true},
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
        cleanupImagePreview() {
            if (this.entity.image && this.entity.image instanceof File) {
                const imageUrl = URL.createObjectURL(this.entity.image);
                URL.revokeObjectURL(imageUrl);
            }
        },

        // Método para obtener la URL de previsualización de la imagen


        // Método para manejar el cambio de imagen
        async openStoreModal() {
            this.resetModal();
            this.loading = true;
            this.isEditing = false;
            try {
                const storeTemp = await Inventory.store(this.entity);
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


                // if (data.image) {
                //     const cleanPath = data.image.replace(/^public\//, '');
                //     this.entity.image = `${VUE_APP_STORAGE_URL}${cleanPath}`;
                // } else {
                //     this.entity.image_preview = null;
                // }

                await this.loadOptions();

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
        formFields() {
            return [
                {
                    group: "Información Inventario",
                    fields: [
                        {
                            key: 'warehouse_id',
                            label: 'Sucursal',
                            type: 'select',
                            placeholder: 'Sucursal',
                            options: this.warehouses.map(w => ({value: w.id, text: w.name}))

                        },
                        {
                            key: 'product_id',
                            label: 'Producto',
                            type: 'select',
                            placeholder: 'Producto a levantar',
                            options: [
                                ...this.products.map(p => ({value: p.id, text: p.code + ' ' + p.description}))
                            ],
                        },
                        {
                            key: 'provider_id',
                            label: 'Proveedor',
                            type: 'select',
                            placeholder: 'Proveedor',
                            options: [
                                ...this.providers.map(p => ({value: p.id, text: p.legal_name }))
                            ],
                        },

                        {
                            key: 'stock_actual_quantity',
                            label: 'Inventario actual',
                            type: 'number',
                            placeholder: 'Inventario actual en sucursal'
                        },
                        {
                            key: 'stock_min',
                            label: 'Stock',
                            type: 'number',
                            placeholder: 'Stock mínimo',
                        },
                        {
                            key: 'stock_max',
                            label: 'Stock Maximo',
                            type: 'number',
                            placeholder: 'Stock Máximo',
                        },



                    ],
                },

                {
                    group: "Configuraciones",
                    fields: [
                        {
                            key: 'last_cost_without_tax',
                            label: 'Costo sin IVA',
                            type: 'number',
                            placeholder: 'Costo sin IVA'
                        },
                        {
                            key: 'last_cost_with_tax',
                            label: 'Costo con IVA',
                            type: 'number',
                            placeholder: 'Costo con IVA',
                        },

                        {
                            key: 'alert_stock_min',
                            label: 'Alerta stock mínimo',
                            type: 'checkbox',
                            placeholder: 'Producto es un servicio'
                        },
                        {
                            key: 'alert_stock_max',
                            label: 'Alerta stock maximo',
                            type: 'checkbox',
                            placeholder: 'Producto es un servicio'
                        },
                        {
                            key: 'is_active',
                            label: 'Inventario activo',
                            type: 'checkbox',
                            placeholder: 'Inventario activo',
                        },

                    ],
                },


            ];
        },

        getImagePreview(file) {
            if (!file) return '';

            if (typeof file === 'string') {
                return file;
            }

            // Si es un objeto File (nueva imagen seleccionada)
            if (file instanceof File) {
                return URL.createObjectURL(file);
            }

            return '';
        },
        handleImageChange(event) {
            const file = event.target.files[0];

            // Limpiar previsualización anterior
            this.cleanupImagePreview();

            if (file) {
                this.entity.image = file;
                // Puedes agregar validación de imagen aquí si lo deseas
            } else {
                this.entity.image = null;
            }
        },
        imageUrl() {
            return this.getImagePreview(`${VUE_APP_STORAGE_URL()}/${this.entity.image}`);
        },
        validationForm() {
            let isValid = true;
            Object.keys(this.form).forEach((key) => {
                if (this.form[key].isRequired) {
                    this.form[key].validationSuccess = !!this.entity[key];
                    if (!this.form[key].validationSuccess) {
                        console.log(`El campo ${key} no es válido.`);
                        isValid = false;
                    }
                }
            });
            return isValid;
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
                formData.append('alert_stock_min', this.entity.alert_stock_min? '1' : '0');
                formData.append('stock_max', this.entity.stock_max);
                formData.append('alert_stock_max', this.entity.alert_stock_max? '1' : '0');
                formData.append('last_purchase', this.entity.last_purchase);
                formData.append('provider_id', this.entity.provider_id );
                formData.append('is_temp',  '0');
                formData.append('is_active', this.entity.is_active ? '1' : '0');
               const inventory= await Inventory.update(formData);
                console.log(inventory);
                if(inventory.status==='success'){
                    await Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        timer: 1500,
                        showConfirmButton: true,
                        timerProgressBar:true,
                        text: inventory.message,
                        confirmButtonText: 'Aceptar'
                    });
                    location.reload();

                    // this.loadInventoryTable();
                }else{
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: inventory.message,
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


         loadInventoryTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: `${urlApi}/v1/inventories`,
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
                            const description = type?.product?.description ?? 'S/N';
                            const code = type?.product?.code ?? 'S/N';
                            const original_code = type?.product?.original_code ?? 'S/N';
                            const image = type?.product?.image ?? 'S/N';
                            const imageUrl = image ? `${VUE_APP_STORAGE_URL}${image}` : `${VUE_APP_STORAGE_URL}/images/default.png`;
                            const imagePreview = `<img src="${imageUrl}" alt="image" class="w-10 h-10 rounded-full">`;
                            const wareHouse = type?.warehouse?.name ?? 'SN';
                            const product = `<div class="flex items-center gap-4">
                <div class="leading-none w-10 shrink-0 cursor-pointer">
                <img src="${image}" alt="image" class="w-15 h-15 rounded-full">
                </div>
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

                    barcode: {
                        title: 'barcode',
                        search: true,
                        render: function (data, type, row) {
                            return type?.product?.barcode ?? 'SN'
                        },
                        createdCell(cell)
                        {
                            cell.classList.add('text-small');
                        }


                    },

                    original_code: {
                        title: 'original_code',
                        render: function (data, type, row) {
                            return type?.product?.original_code ?? 'SN'
                        }
                    },
                    category: {
                        title: 'Categoría',
                        render: function (data, type, row) {
                            const category = type?.product?.category?.description ?? 'S/N';
                            return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
                        }

                    },
                    medida: {
                        title: 'Medida',
                        render: function (data, type, row) {
                            const medida = type?.product?.unit_measurement?.description ?? 'S/N';
                            const description = type?.product?.description_measurement_id ?? 'S/N';
                            const returnMedida= `<div class="flex items-center gap-4">
             
                <div class="flex flex-col gap-0.5">
                 <span class="leading-none font-medium text-sm text-gray-900">
                      ${medida.charAt(0).toUpperCase() + medida.slice(1).toLowerCase()}
                 </span>
               
                 <span class="text-2sm text-gray-700 font-normal">
                        ${description.charAt(0).toUpperCase() + description.slice(1).toLowerCase()}
                 </span>
              
                </div>
                
               </div>`
                            return returnMedida;
                        },

                    },
                    actual_stock: {
                        title: 'Inventario en lotes',
                        render: (actual_stock) => `<badge class="badge badge-light-primary text-center">${actual_stock}</badge>`,
                        createdCell(cell) {
                            cell.classList.add('text-center');
                        },
                    },
                    default_price: {
                        title: 'default_price',
                        render: (price) => `<badge class="badge badge-info text-center w-75">$ ${price}</badge>`,
                        createdCell(cell) {
                            cell.classList.add('text-center');
                        },

                    },
                    last_purchase: {
                        title: 'Last purchase',
                        render: function (data, type, row) {
                            if (!type?.last_purchase) return 'S/N';
                            const date = new Date(type.last_purchase);
                            return new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(date);
                        }
                    },


                    // comercial_name: {title: 'Nombre Comercial'},
                    edit: {
                        render: () => `<button class="btn btn-sm btn-icon btn-clear btn-light">
                            <i class="ki-filled ki-notepad-edit" ></i></button>`,
                        createdCell: (cell, cellData, rowData) => {
                            cell.addEventListener('click', () => this.editModal(rowData));
                        },
                    },
                    delete: {
                        render: () => `<button class="btn btn-sm btn-icon btn-clear btn-light"><i class="ki-outline ki-trash text-lg text-danger text-center"></i></button>`,
                        createdCell: (cell, cellData, rowData) => {
                            cell.addEventListener('click', () => this.deleteProductModal(rowData.id));
                        },
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
            const dataTable = new KTDataTable(tableElement, options);
            dataTable.reload();
            dataTable.showSpinner();

        },



        async loadOptions() {
            try {

                const [categories, brands, unitsMeasurement, products, warehouses,providers] = await
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
        this.loadInventoryTable();
        // window.editModal = this.editModal.bind(this);
    },
};