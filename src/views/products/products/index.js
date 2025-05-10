import {KTDataTable, KTModal} from '../../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '@/components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import ProductsService from "@/services/productsService.js";
import CategoryService from "@/services/categoryService.js";
import BrandService from "@/services/brandService.js";
import UnitMeasurementService from "@/services/hacienda/unitMeasurementService.js";
import {VUE_APP_STORAGE_URL, configApi} from "@/services/config.js";
import EquivalentService from "@/services/equivalentService.js";
import equivalentService from "@/services/equivalentService.js";

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            providers: [],
            brands: [],
            categories: [],
            unitsMeasurement: [],
            products: [],
            product_id_equivalent: null,
            entity: {
                id: 0,
                code: '',
                original_code: '',
                barcode: '',
                description: '',
                brand_id: 0,
                category_id: 0,
                // provider_id: 0,
                unit_measurement_id: 0,
                description_measurement_id: 0,
                image: null,
                is_active: 0,
                is_taxed: 0,
                is_discontinued: 0,
                is_not_purchasable: 0,
                is_service: 0,
            },
            form: {
                code: {isRequired: true, validationSuccess: true},
                original_code: {isRequired: false, validationSuccess: true},
                barcode: {isRequired: true, validationSuccess: true},
                description: {isRequired: true, validationSuccess: true},
                brand_id: {isRequired: true, validationSuccess: true},
                category_id: {isRequired: true, validationSuccess: true},
                // provider_id: {isRequired: true, validationSuccess: true},
                unit_measurement_id: {isRequired: true, validationSuccess: true},
                description_measurement_id: {isRequired: true, validationSuccess: true},
                image: {isRequired: false, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
                is_taxed: {isRequired: false, validationSuccess: true},
                is_discontinued: {isRequired: false, validationSuccess: true},
                is_not_purchasable: {isRequired: false, validationSuccess: true},
                is_service: {isRequired: false, validationSuccess: true},
                image_preview: {isRequired: false, validationSuccess: true},

            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? `Modificar -${this.moduleName}` : `Crear - ${this.moduleName}`;
        },
        moduleName() {
            return ' Prodúctos';
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
        deleteRow(id) {
            this.entity.id = id;
            KTModal.getInstance(document.querySelector("#modal-question")).show();
        },
        deleteEquivalente(id) {
            this.equi = id;
            KTModal.getInstance(document.querySelector("#modal-question")).show();
        },

        // Método para limpiar la previsualización
        async destroy() {
            if (this.loading) return;
            this.loading = true;
            try {
                await ProductsService.destroy(this.entity.id);
                window.location.reload();
            } catch (error) {
                console.error('Error al eliminar el almacén:', error);
            } finally {
                this.loading = false;
            }
        },

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
            } catch (error) {
                console.error("Error in editModal:", error);
            }
        },
        formFields() {
            return [
                {
                    group: "Información Básica",
                    fields: [
                        {
                            key: 'code',
                            label: 'Código Import',
                            type: 'text',
                            placeholder: 'Código del producto'
                        },
                        {
                            key: 'original_code',
                            label: 'Código Original',
                            type: 'text',
                            placeholder: 'Código original del producto'
                        },
                        {
                            key: 'barcode',
                            label: 'Código de Barras',
                            type: 'text',
                            placeholder: 'Código de barras del producto'
                        },
                        {
                            key: 'category_id',
                            label: 'Categoría/Grupo',
                            type: 'select',
                            placeholder: 'Seleccione una categoría',
                            options: this.categories.map(c => ({value: c.id, text: c.description}))
                        },
                        {
                            key: 'description',
                            label: 'Descripción',
                            type: 'text',
                            placeholder: 'Descripción del producto'
                        },
                        {
                            key: 'brand_id',
                            label: 'Marca',
                            type: 'select',
                            placeholder: 'Seleccione una marca',
                            options: this.brands.map(b => ({value: b.id, text: b.description}))
                        },

                        // {
                        //     key: 'provider_id',
                        //     label: 'Proveedor',
                        //     type: 'select',
                        //     placeholder: 'Seleccione un proveedor',
                        //     options: this.providers.map(p => ({value: p.id, text: p.comercial_name})),
                        //
                        // },
                        {
                            key: 'unit_measurement_id',
                            label: 'Unidad de Medida',
                            type: 'select',
                            placeholder: 'Seleccione una unidad de medida',
                            options: this.unitsMeasurement.map(u => ({value: u.id, text: u.description}))
                        },
                        {
                            key: 'description_measurement_id',
                            label: 'Descripción de la Medida',
                            type: 'text',
                            placeholder: 'Descripción de la medida'
                        },
                        {key: 'image', label: 'Imagen', type: 'file', placeholder: 'Imagen del producto'},

                    ],
                },

                {
                    group: "Configuraciones",
                    fields: [
                        {key: 'is_active', label: 'Activo', type: 'checkbox', placeholder: 'Producto activo'},
                        {key: 'is_taxed', label: 'Gravado', type: 'checkbox', placeholder: 'Producto gravado'},

                        {
                            key: 'is_service',
                            label: 'Servicio',
                            type: 'checkbox',
                            placeholder: 'Producto es un servicio'
                        },
                        {
                            key: 'is_discontinued',
                            label: 'Descontinuado',
                            type: 'checkbox',
                            placeholder: 'Producto descontinuado'
                        },
                        {
                            key: 'is_not_purchasable',
                            label: 'No Comprable',
                            type: 'checkbox',
                            placeholder: 'Producto No comprable'
                        },
                        // Campo virtual para mostrar la imagen
                        {
                            key: 'image_preview',
                            label: 'Imagen prodúcto',
                            type: 'custom',
                            component: 'image-preview',
                            condition: () => this.entity.image
                        }
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


        loadTableProducts() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: ProductsService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    code: {
                        title: 'code',

                    },
                    original_code: {
                        title: 'original_code',

                    },
                    barcode: {
                        title: 'bar_code',

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
                    description_measurement_id: {
                        title: 'Unidad de Medida',
                    },
                    brand: {
                        title: 'Marca',
                        render: function (data, type, row) {
                            return type?.brand?.description ?? 'S/N';
                        }
                    },

                    // comercial_name: {title: 'Nombre Comercial'},
                    edit: {
                        render: () => `<button class="btn btn-outline btn-info">
                            <i class="ki-outline ki-notepad-edit text-lg text-primary cursor: pointer" ></i></button>`,
                        createdCell: (cell, cellData, rowData) => {
                            cell.addEventListener('click', () => this.editModal(rowData));
                        },
                    },
                    delete: {
                        render: () => `<button class="btn btn-outline btn-danger"><i class="ki-outline ki-trash text-lg text-danger text-center"></i></button>`,
                        createdCell: (cell, cellData, rowData) => {
                            cell.addEventListener('click', () => this.deleteRow(rowData.id));
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

            if (!tableElementEquivalent) {
                console.error("Table element not found");
                return;
            }

            try {
                console.log("Loading equivalents for product ID:", idProduct);
                const endpoint = `${equivalentService.getEquivalentByProduct(idProduct)}?timestamp=${Date.now()}`;
                console.log("Using endpoint:", endpoint);


                const options = {
                    type: 'remote',
                    apiEndpoint: equivalentService.getEquivalentByProduct(idProduct),
                    requestHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    columns: {

                        product_id_equivalent: {
                            title: 'product_id_equivalent',

                        },
                        product_equivalent: {
                            title: 'producto_equivalente',
                            render: function (data, type, row) {
                                return type?.product_equivalent?.description ?? 'S/N';
                            }
                        },
                        edit: {
                            render: () => `<button class="btn btn-outline btn-info">
                        <i class="ki-outline ki-notepad-edit text-lg text-primary cursor: pointer"></i></button>`,
                            createdCell: (cell, cellData, rowData) => {
                                cell.addEventListener('click', () => this.editModal(rowData));
                            },
                        },
                        delete: {
                            render: () => `<button class="btn btn-outline btn-danger">
                        <i class="ki-outline ki-trash text-lg text-danger text-center"></i></button>`,
                            createdCell: (cell, cellData, rowData) => {
                                cell.addEventListener('click', () => this.deleteRow(rowData.id));
                            },
                        },
                    },
                    layout: {scroll: true},
                    sortable: true,
                    pagination: true
                };

                // if (this.dataTableEquivalents) {
                //     this.dataTableEquivalents.reload(options);
                //     console.log('Reload equivalents data');
                // } else {
                this.dataTableEquivalents = new KTDataTable(tableElementEquivalent, options);
                console.log('Initialize equivalents data');
                // }/

            } catch (error) {
                console.error("Error loading equivalents:", error);
                // Show user feedback
                alert("Error loading equivalent products: " + error.message);
            }
        },

        async loadOptions() {
            try {

                const [categories,
                    brands,
                    unitsMeasurement,
                    products] = await Promise.all(
                    [
                        CategoryService.get(),
                        BrandService.get(),
                        UnitMeasurementService.get(),
                        ProductsService.get(),
                    ]);

                this.categories = categories.data || [];
                this.brands = brands.data || []; // Asegúrate de que sea un array
                this.unitsMeasurement = unitsMeasurement.data || []; // Asegúrate de que sea un array
                this.products = products.data || []; // Asegúrate de que sea un array
            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.categories = [];
                // this.providers = [];
                this.brands = [];
                this.unitsMeasurement = [];
                this.products = [];
            }
        },

        async addEquivalente() {
            try {
                const formData = new FormData();
                formData.append('product_id', this.entity.id);
                formData.append('product_id_equivalent', this.product_id_equivalent);
                formData.append('is_active', 1);
                await EquivalentService.store(formData);
                this.loadEquivalents(this.entity.id);

            } catch (error) {
                console.error('Error al registrar equivalencia:', error);
            }
        },
    },

    mounted() {
        this.loadTableProducts();
        // this.loadEquivalents(this.entity.id);
        window.editModal = this.editModal.bind(this);
    },
};