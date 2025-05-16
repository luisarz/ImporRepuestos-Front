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
// @ts-ignore
// @ts-ignore
export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            searchQuery: '',
            loading: false,
            isEditing: false,
            providers: [],
            brands: [],
            categories: [],
            unitsMeasurement: [],
            products: [],
            warehouses: [],

            entity: {
                id:0,
                warehouse_id:0,
                product_id:0,
                provider_id:0,
                last_cost_without_tax:0,
                last_cost_with_tax:0,
                stock_actual_quantity:0,
                stock_min:0,
                alert_stock_min:0,
                stock_max:0,
                alert_stock_max:0,
                last_purchase:null

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
            try {
                const storeTemp = await ProductsService.store(this.entity);
                console.log(storeTemp.data.id);
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
                console.log(this.isEditing);
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
                this.loadEquivalents(this.entity.id);
            } catch (error) {
                console.error('Error al cargar equivalentes:', error);
            }

            try {


                if (data.image) {
                    const cleanPath = data.image.replace(/^public\//, '');
                    this.entity.image = `${VUE_APP_STORAGE_URL}${cleanPath}`;
                } else {
                    this.entity.image_preview = null;
                }

                await this.loadOptions();

                const modal = KTModal.getInstance(document.querySelector("#modal_store"));
                if (modal) {
                    modal.show();
                } else {
                    console.error("Could not find modal instance");
                }


                try {
                    this.loadInterChanges(this.entity.id);
                } catch (error) {
                    console.error('Error al cargar intercambios:', error);
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
                            options:this.warehouses.map(w => ({value: w.id, text: w.name}))

                        },
                        {
                            key: 'product_id',
                            label: 'Producto',
                            type: 'select',
                            placeholder: 'Producto a levantar',
                            options:this.products.map(p => ({value: p.id, text: p.code +' '+ p.description}))
                        },

                        {
                            key: 'stock_actual_quantity',
                            label: 'Inventario actual',
                            type: 'number',
                            placeholder: 'Inventario actual en suscursal'
                        },
                        {
                            key: 'stock_min',
                            label: 'Stock',
                            type: 'number',
                            placeholder: 'Stock minimo',
                        },
                        {
                            key: 'stock_max',
                            label: 'Stock Maximo',
                            type: 'number',
                            placeholder: 'Stock Maximo',
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
                            label: 'Stock mínimo',
                            type: 'checkbox',
                            placeholder: 'Producto es un servicio'
                        },
                        {
                            key: 'alert_stock_max',
                            label: 'Sobre maximo',
                            type: 'checkbox',
                            placeholder: 'Producto es un servicio'
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

                this.loadEquivalents(this.entity.id);

            try {
                // Preparamos FormData para ambos casos (create y update)
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('id', this.entity.id);
                formData.append('code', this.entity.code);
                formData.append('original_code', this.entity.original_code);
                formData.append('barcode', this.entity.barcode);
                formData.append('description', this.entity.description);
                formData.append('brand_id', this.entity.brand_id);
                formData.append('category_id', this.entity.category_id);
                formData.append('provider_id', this.entity.provider_id);
                formData.append('unit_measurement_id', this.entity.unit_measurement_id);
                formData.append('description_measurement_id', this.entity.description_measurement_id);
                formData.append('is_active', this.entity.is_active ? '1' : '0');
                formData.append('is_taxed', this.entity.is_taxed ? '1' : '0');
                formData.append('is_service', this.entity.is_service ? '1' : '0');
                formData.append('is_discontinued', this.entity.is_discontinued ? '1' : '0');
                formData.append('is_not_purchasable', this.entity.is_not_purchasable ? '1' : '0');

                await EquivalentService.store(formData);

                if (this.entity.image instanceof File) {
                    formData.append('image', this.entity.image);
                }

                if (this.isEditing) {
                    await ProductsService.update(formData);
                } else {
                    await ProductsService.store(this.entity);
                }

                location.reload();
            } catch (error) {
                console.error('Error al guardar el producto:', error);
            } finally {
                this.loading = false;
            }
        },


       async loadTableProducts() {
            const searchQuery=this.searchQuery;
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                // apiEndpoint: ProductsService.getUrl(),
                apiEndpoint:`${urlApi}/v1/inventories?search=${searchQuery}`,
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    warehouse_id: {
                        title: 'warehouse',
                        search: true,
                        render:function (data,type,row){
                            return type?.warehouse?.name??'SN'
                        }

                    },
                    code: {
                        title: 'code',
                        search: true,
                        render:function (data,type,row){
                            return type?.product?.code??'SN'
                        }

                    },
                    original_code: {
                        title: 'original_code',
                        search: true,
                        render:function (data,type,row){
                            return type?.product?.original_code??'SN'
                        }

                    },
                    producto: {
                        title: 'bar_code',
                        render:function (data,type,row){
                            return type?.product?.description??'SN'
                        }
                    },
                    category: {
                        title: 'Categoría',
                        render: function (data, type, row) {
                            return type?.category?.description ?? 'S/N';
                        }
                    },
                    description: {
                        title: 'Descripción',

                    },
                    inventory_batches_sum_quantity: {
                        title: 'Inventario en lotes',
                        render:function (data, type, row) {
                            return type?.inventory_batches_sum_quantity??0;
                        }
                    },
                    price: {
                        title: 'Marca',
                        render: function (data, type, row) {
                            // return type?.price['0']?.price ?? 'S/N';
                        }
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
                search: {
                    input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                    key: 'search', // Parámetro que se enviará al servidor
                    delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                },
            };
            const dataTable = new KTDataTable(tableElement, options);
            dataTable.reload();
        },
        loadEquivalents(idProduct) {
            const tableElementEquivalent = document.querySelector("#table_equivalente");

            try {
                // console.log("Loading equivalents for product ID:", idProduct);
                // const endpoint = `${equivalentService.getEquivalentByProduct(idProduct)}`;
                // console.log("Using endpoint:", endpoint);


                const options = {
                    type: 'remote',
                    apiEndpoint: EquivalentService.getEquivalentByProduct(idProduct),
                    requestHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    columns: {

                        product_id_equivalent: {
                            title: 'product_id_equivalent',
                            render: function (data, type, row) {
                                return type?.product_equivalent?.code ?? 'S/N';
                            }

                        },
                        product_equivalent: {
                            title: 'producto_equivalente',
                            render: function (data, type, row) {
                                return type?.product_equivalent?.description ?? 'S/N';
                            }
                        },

                        delete: {
                            render: () => `<button class="btn btn-sm btn-outline btn-danger">
                        <i class="ki-outline ki-trash text-lg text-danger text-center"></i></button>`,
                            createdCell: (cell, cellData, rowData) => {
                                cell.addEventListener('click', () => this.deleteEquivalente(rowData.id));
                            },
                        },
                    },
                    layout: {scroll: true},
                    sortable: true,
                    search: {
                        input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                        key: 'search', // Parámetro que se enviará al servidor
                        delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                    },
                };

                if (this.dataTableEquivalents) {
                    this.dataTableEquivalents.reload(options);
                    console.log('Reload equivalents data');
                } else {
                    this.dataTableEquivalents = new KTDataTable(tableElementEquivalent, options);
                    console.log('Initialize equivalents data');
                }

            } catch (error) {
                console.error("Error loading equivalents:", error);
                // Show user feedback
                alert("Error loading equivalent products: " + error.message);
            }
        },

        loadInterChanges(idProduct) {
            const tableElementInterchange = document.querySelector("#table_intercambio");
            try {

                const formData = new FormData();

                const options = {
                    type: 'remote',
                    apiEndpoint: `${urlApi}/v1/interchanges/product/${idProduct}`,//InterchangesService.getInterchangeByProduct(idProduct),
                    requestHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    columns: {

                        code: {title: 'code'},
                        reference: {title: 'reference'},
                        delete: {
                            render: () => `<button class="btn btn-sm btn-outline btn-danger">
                        <i class="ki-outline ki-trash text-lg text-danger text-center"></i></button>`,
                            createdCell: (cell, cellData, rowData) => {
                                cell.addEventListener('click', () => this.deleteEquivalente(rowData.id));
                            },
                        },
                    },
                    layout: {scroll: true},
                    sortable: true,
                    search: {
                        input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                        key: 'search', // Parámetro que se enviará al servidor
                        delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                    },
                };

                if (this.dataTableInterChanges) {
                    this.dataTableInterChanges.reload(options);
                    console.log('Reload equivalents data');
                } else {
                    this.dataTableInterChanges = new KTDataTable(tableElementInterchange, options);
                    console.log('Initialize intercambios data');
                }

            } catch (error) {
                console.error("Error loading intercambios:", error);
            }
        },
        async showIntercambioModal(editData = null) {
            const isEditMode = editData !== null;

            const {value: formValues} = await Swal.fire({
                title: isEditMode ? 'Editar Intercambio' : 'Agregar Intercambio',
                html: `
      <div class="mb-3">
        <label for="swalIntercambioCode" class="form-label">Código intercambio:</label>
        <input type="text" id="swalIntercambioCode" class="input" 
               placeholder="Ingrese el código" value="${isEditMode ? editData.code : ''}" required>
      </div>
      <div class="mb-3">
        <label for="swalReference" class="form-label">Referencia:</label>
        <input type="text" id="swalReference" class="input" 
               placeholder="Ingrese el nombre" value="${isEditMode ? editData.name : ''}">
      </div>
    `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: isEditMode ? 'Guardar cambios' : 'Agregar',
                cancelButtonText: 'Cancelar',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn btn-success me-2',
                    cancelButton: 'btn btn-info'
                },
                didOpen: () => {
                    setTimeout(() => {
                        document.getElementById('swalIntercambioCode').focus();
                    }, 100);
                },
                preConfirm: () => {
                    const code = document.getElementById('swalIntercambioCode').value.trim();
                    const reference = document.getElementById('swalReference').value.trim();
                    const product_id = this.entity.id;
                    const is_active = true;

                    if (!code) {
                        Swal.showValidationMessage('El código es requerido');
                        return false;
                    }

                    return {code, reference, product_id, is_active};
                }
            });

            if (formValues) {
                if (isEditMode) {
                    // Lógica para editar
                    const interchange = InterchangesService.update(editData.id, formValues);
                    await Swal.fire('¡Actualizado!', 'El intercambio ha sido modificado.', 'success');
                } else {
                    // Lógica para registrar nuevo
                    const interchange = await InterchangesService.store(formValues)
                    if (interchange.status === 'success') {
                        await Swal.fire({
                            title: '¡Agregado!',
                            text: 'El intercambio ha sido agregado.',
                            icon: 'success',
                            timer: 1500,
                            timerProgressBar: true,
                            confirmButtonText: 'Aceptar',
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        });
                        this.loadInterChanges(this.entity.id);

                    }
                }

            }
        },

// Ejemplo de uso:
// Para agregar nuevo: showIntercambioModal()
// Para editar: showIntercambioModal({ id: 1, code: 'ABC123', name: 'Producto Ejemplo' })

        async loadOptions() {
            try {

                const [categories,
                    brands,
                    unitsMeasurement,
                    products,warehouses] = await Promise.all(
                    [
                        CategoryService.get(),
                        BrandService.get(),
                        UnitMeasurementService.get(),
                        ProductsService.get(),
                        WarehouseService.get()
                    ]);

                this.categories = categories.data || [];
                this.brands = brands.data || []; // Asegúrate de que sea un array
                this.unitsMeasurement = unitsMeasurement.data || []; // Asegúrate de que sea un array
                this.products = products.data || []; // Asegúrate de que sea un array
                this.warehouses=warehouses.data || []; // Asegúrate de que sea un array
            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.categories = [];
                // this.providers = [];
                this.brands = [];
                this.unitsMeasurement = [];
                this.products = [];
                this.warehouses = [];
            }
        },

        async addEquivalente() {

            try {
                const formData = new FormData();
                formData.append('product_id', this.entity.id);
                formData.append('product_id_equivalent', this.product_id_equivalent);
                formData.append('is_active', 1);
                const response = await EquivalentService.store(formData);
                if(response.status==='error') {
                    await Swal.fire({
                        title: 'Error',
                        text: response.message,
                        icon: 'error',
                        confirmButtonText: 'Entendido',
                        buttonsStyling: false,
                        timer: 1500,
                        timerProgressBar: true,
                        customClass: {
                            confirmButton: 'btn btn-danger'
                        }
                    });
                    return false;

                }
                await Swal.fire({
                    title: '¡Agregado!',
                    text: 'La equivalencia ha sido agregada.',
                    icon: 'success',
                    timer: 1500,
                    timerProgressBar: true,
                    confirmButtonText: 'Aceptar',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                this.loadEquivalents(this.entity.id);
            }
            catch (error){
                console.error('Error al cargar las opciones:', error);
            }
        },

        async addInterchange(formValues) {
            try {
                return await InterchangesService.store(formValues);
            } catch (error) {
                console.error('Error al agregar equivalencia:', error);
            }
        },
       async handleSearch() {

                await this.loadTableProducts();
        }
    },
    // watch: {
    //     searchQuery(newVal) {
    //         console.log(newVal);
    //         this.loadTableProducts();
    //     },
    // },
    mounted() {
        this.loadTableProducts();
        // this.loadEquivalents(this.entity.id);
        // window.editModal = this.editModal.bind(this);
    },
};