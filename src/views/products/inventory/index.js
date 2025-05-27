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
import MediumModal from "@/components/MediumModal.vue";
import PricesService from "@/services/pricesService.js";
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
        async loadWarehouse() {
            try {
                const response = await WarehouseService.get();
                this.warehouses = response.data || [];
            } catch (error) {
                console.error('Error al cargar las sucursales:', error);
                this.warehouses = [];
            }
        },

        async openPriceStore(editData = null) {
            const isEditMode = editData !== null;
            const {value: formValues} = await Swal.fire({
                title: isEditMode ? 'Modificar Precio' : 'Agregar Precio',
                html: `
      <div class="mb-3">
        <label for="price_description" class="form-label mb-1">Descripcion precio:</label>
        <input type="text" id="price_description" class="input" 
               placeholder="Ingrese la descripcion" value="${isEditMode ? editData.price_description : ''}" required>
      </div>
      <div class="mb-2">
        <label for="price" class="form-label mb-1">Precio:</label>
        <input type="number" id="price" class="input" 
               placeholder="Ingrese el precio" value="${isEditMode ? editData.price : ''}">
      </div>
       <div class="mb-2">
        <label for="utility" class="form-label mb-1">Utilidad:</label>
        <input type="number" id="utility" class="input" 
               placeholder="Utilidad" value="${isEditMode ? editData.utility : 0}">
      </div>
        <div class="mb-2">
      <label for="utilidadPrecioTxt" class="form-label mb-1">Predeterminado:</label>
        <label  class="switch">
                           <input
                                type="checkbox"
                                id="is_default"
                                :true-value="1"
                                :false-value="0"
                              />
                          </label>
      </div>
    `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: isEditMode ? 'Guardar cambios' : 'Agregar',
                cancelButtonText: 'Cancelar',
                buttonsStyling: false,
                allowOutsideClick: false, // 👈 evita cierre por clic fuera
                allowEscapeKey: false,
                customClass: {
                    confirmButton: 'btn btn-success me-2',
                    cancelButton: 'btn btn-info'
                },
                didOpen: () => {
                    setTimeout(() => {
                        document.getElementById('price_description').focus();
                    }, 100);
                },

                preConfirm: () => {
                    const inventory_id = this.entity.id;
                    const price_description = document.getElementById('price_description').value.trim();
                    const price = document.getElementById('price').value.trim();
                    const utility = document.getElementById('utility').value.trim();
                    const is_default = document.getElementById('is_default').checked ? 1 : 0; // checkbox
                    const max_discount = 0;
                    const is_active = true;

                    if (!price_description) {
                        Swal.showValidationMessage('La descripción del precio es requerida');
                        return false;
                    }

                    if (!price || isNaN(price)) {
                        Swal.showValidationMessage('El precio debe ser un número válido');
                        return false;
                    }

                    if (!utility || isNaN(utility)) {
                        Swal.showValidationMessage('La utilidad debe ser un número válido');
                        return false;
                    }

                    return {
                        inventory_id,
                        price_description,
                        price: parseFloat(price),
                        utility: parseFloat(utility),
                        is_default,
                        max_discount,
                        is_active
                    };
                }

            });

            if (formValues) {

                if (isEditMode) {
                    // Lógica para editar

                    const interchange = PricesService.update(editData.id, formValues);
                    await Swal.fire('¡Actualizado!', 'El intercambio ha sido modificado.', 'success');
                    this.loadPriceTable(editData.inventory_id);
                } else {
                    // Lógica para registrar nuevo
                    const price = await PricesService.store(formValues)

                    if (price.status === 'success') {
                        await Swal.fire({
                            title: '¡Agregado!',
                            text: 'El Precio ha sido agregado.',
                            icon: 'success',
                            timer: 1500,
                            timerProgressBar: true,
                            confirmButtonText: 'Aceptar',
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        });
                        this.loadPriceTable(price.data.inventory_id);
                    }
                }

            }
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
        formFields() {
            return [
                {
                    group: "Información Inventario",
                    fields: [
                        {
                            key: 'warehouse_id',
                            label: 'Sucursal',
                            type: 'select',
                            value: 0,
                            readonly: false,
                            placeholder: 'Sucursal',
                            options: this.warehouses.map(w => ({value: w.id, text: w.name}))

                        },
                        {
                            key: 'product_id',
                            label: 'Producto',
                            type: 'select',
                            value: 0,
                            readonly: false,
                            placeholder: 'Producto a levantar',
                            options: [
                                ...this.products.map(p => ({value: p.id, text: p.code + ' ' + p.description}))
                            ],
                        },
                        {
                            key: 'provider_id',
                            label: 'Proveedor',
                            type: 'select',
                            value: 0,
                            readonly:false,

                            placeholder: 'Proveedor',
                            options: [
                                ...this.providers.map(p => ({value: p.id, text: p.legal_name}))
                            ],
                        },

                        {
                            key: 'stock_actual_quantity',
                            label: 'Inventario actual',
                            type: 'number',
                            value: 0,
                            readonly: false,
                            placeholder: 'Inventario actual en sucursal'
                        },
                        {
                            key: 'stock_min',
                            label: 'Stock minimo',
                            type: 'number',
                            value: 0,
                            readonly: false,


                            placeholder: 'Stock mínimo',
                        },
                        {
                            key: 'stock_max',
                            label: 'Stock Maximo',
                            type: 'number',
                            value: 0,
                            readonly: false,

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
                            value: 0,
                            readonly: true,

                            placeholder: 'Costo sin IVA'
                        },
                        {
                            key: 'last_cost_with_tax',
                            label: 'Costo con IVA',
                            type: 'number',
                            value: 0,
                            readonly: true,

                            placeholder: 'Costo con IVA',
                        },

                        {
                            key: 'alert_stock_min',
                            label: 'Alerta stock mínimo',
                            type: 'checkbox',
                            value: 0,
                            readonly: false,

                            placeholder: 'Producto es un servicio'
                        },
                        {
                            key: 'alert_stock_max',
                            label: 'Alerta stock maximo',
                            type: 'checkbox',
                            value: 0,
                            readonly: false,

                            placeholder: 'Producto es un servicio'
                        },
                        {
                            key: 'is_active',
                            label: 'Inventario activo',
                            type: 'checkbox',
                            value: 0,
                            readonly: false,
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
                formData.append('alert_stock_min', this.entity.alert_stock_min ? '1' : '0');
                formData.append('stock_max', this.entity.stock_max);
                formData.append('alert_stock_max', this.entity.alert_stock_max ? '1' : '0');
                formData.append('last_purchase', this.entity.last_purchase);
                formData.append('provider_id', this.entity.provider_id);
                formData.append('is_temp', '0');
                formData.append('is_active', this.entity.is_active ? '1' : '0');
                const inventory = await Inventory.update(formData);
                console.log(inventory);
                if (inventory?.status === 'success') {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        timer: 1500,
                        showConfirmButton: true,
                        timerProgressBar: true,
                        text: inventory.message,
                        confirmButtonText: 'Aceptar'
                    });
                    location.reload();

                    // this.loadInventoryTable();
                } else {
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
            const tablePriceElement = document.querySelector("#kt_remote_table");
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
                        createdCell(cell) {
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
                            const returnMedida = `<div class="flex items-center gap-4">
             
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
                // mapRequest: (queryParams) => {
                //     // For CodeIgniter integration - customize as needed
                //     console.log('Search term:', queryParams.get('search'));
                //     return queryParams;
                // },
                layout: {scroll: true},
                sortable: true,
                stateSave: true,
                infoEmpty: 'No hay datos disponibles',
                search: {
                    input: document.getElementById('search_description'),
                    key: 'search', // este será el parámetro principal
                    delay: 400,
                    advanced: [
                        {
                            input: document.getElementById('kt_datatable_search_query'),
                            key: 'category'
                        },

                    ]
                },

            };
            const dataTable = new KTDataTable(tablePriceElement, options);

            document.querySelectorAll('[data-datatable-search]').forEach((searchElement) => {
                const tableId = searchElement.getAttribute('#kt_remote_table');
                const datatable = document.querySelector(tableId);

                if (datatable && datatable.instance) {
                    searchElement.addEventListener('keyup', () => {
                        // Recolectar todos los valores de inputs con el mismo atributo
                        const allInputs = document.querySelectorAll(`[data-datatable-search="${tableId}"]`);
                        let combinedSearch = '';

                        allInputs.forEach((input) => {
                            if (input.value.trim() !== '') {
                                combinedSearch += input.value.trim() + ' ';
                            }
                        });

                        datatable.instance.search(combinedSearch.trim());
                    });
                }
            });



            document.querySelectorAll('[data-datatable-filter-column]').forEach((filterElement) => {
                const column = filterElement.getAttribute('data-datatable-filter-column');

                const applyFilter = () => {
                    dataTable.setFilter({
                        column: column,
                        type: 'text',
                        value: filterElement.value
                    }).redraw();
                };

                filterElement.addEventListener('change', applyFilter);
                filterElement.addEventListener('keyup', (event) => {
                    if (event.key === 'Enter') {
                        applyFilter();
                    }
                });

            });




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
                    apiEndpoint: `${urlApi}/v1/prices/inventory/${id}?_=${Date.now()}`,
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
        this.loadWarehouse();
        this.loadInventoryTable();
        // window.editModal = this.editModal.bind(this);
    },
};