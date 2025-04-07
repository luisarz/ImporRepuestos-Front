import {ref, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '@/components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import ProviderService from "@/services/providers/providerService.js";
import ProductsService from "@/services/productsService.js";
import CategoryService from "@/services/categoryService.js";
import BrandService from "@/services/brandService.js";
import UnitMeasurementService from "@/services/hacienda/unitMeasurementService.js";

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
            entity: {
                id: 0,
                code: '',
                original_code: '',
                barcode: '',
                description: '',
                brand_id: 0,
                category_id: 0,
                provider_id: 0,
                unit_measurement_id: 0,
                description_measurement_id: 0,
                image: '',
                is_active: 0,
                is_taxed: 0,
                is_grouped: 0,
                is_service: 0,
            },
            form: {
                code: {isRequired: true, validationSuccess: true},
                original_code: {isRequired: true, validationSuccess: true},
                barcode: {isRequired: true, validationSuccess: true},
                description: {isRequired: true, validationSuccess: true},
                brand_id: {isRequired: true, validationSuccess: true},
                category_id: {isRequired: true, validationSuccess: true},
                provider_id: {isRequired: true, validationSuccess: true},
                unit_measurement_id: {isRequired: true, validationSuccess: true},
                description_measurement_id: {isRequired: true, validationSuccess: true},
                image: {isRequired: false, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
                is_taxed: {isRequired: false, validationSuccess: true},
                is_grouped: {isRequired: false, validationSuccess: true},
                is_service: {isRequired: false, validationSuccess: true}

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

        formFields() {
            return [
                {
                    key: 'code',
                    label: 'Código',
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
                    options: this.brands.map(b=>({value: b.id, text: b.description}))
                },
                {
                    key: 'category_id',
                    label: 'Categoría',
                    type: 'select',
                    placeholder: 'Seleccione una categoría',
                    options: this.categories.map(c => ({value: c.id, text: c.description}))
                },
                {
                    key: 'provider_id',
                    label: 'Proveedor',
                    type: 'select',
                    placeholder: 'Seleccione un proveedor',
                    options: this.providers.map(p => ({value: p.id, text: p.comercial_name})),

                },
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
                {key: 'image', label: 'Imagen', type: 'file',  placeholder: 'Imagen del producto'},
                {key: 'is_active', label: 'Activo', type: 'checkbox', placeholder: 'Producto activo'},
                {key: 'is_taxed', label: 'Gravado', type: 'checkbox',  placeholder: 'Producto gravado'},
                {
                    key: 'is_grouped',
                    label: 'Agrupado',
                    type: 'checkbox',
                    placeholder: 'Producto agrupado'
                },
                {
                    key: 'is_service',
                    label: 'Servicio',
                    type: 'checkbox',
                    placeholder: 'Producto es un servicio'
                },
            ];
        },
    },
    methods: {
        async save() {

            if (!this.validationForm()) return;
            this.loading = true;
            try {
                if (this.isEditing) {
                    console.log(this.entity);
                    await ProductsService.update(this.entity);
                } else {
                    await ProductsService.store(this.entity);
                }
                window.location.reload();
            } catch (error) {
                console.error('Error al guardar el almacén:', error);
            } finally {
                this.loading = false;
            }
        },


        async loadOptions() {
            try {

                const [categories, providers, brands,unitsMeasurement] = await Promise.all([
                    CategoryService.get(),
                    ProviderService.get(),
                    BrandService.get(),
                    UnitMeasurementService.get()
                ]);

                // Asigna los datos a las propiedades reactivas
                this.categories = categories.data || [];
                this.providers = providers.data || []; // Asegúrate de que sea un array
                this.brands = brands.data || []; // Asegúrate de que sea un array
                this.unitsMeasurement = unitsMeasurement.data || []; // Asegúrate de que sea un array
            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.categories = [];
                this.providers = [];
                this.brands = [];
                this.unitsMeasurement = [];
            }
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
        async openStoreModal() {
            this.loading = true;
            this.isEditing = false;
            this.resetModal();
            await this.loadOptions();
            KTModal.getInstance(document.querySelector("#modal_store")).show();
            this.loading = false;
        },
        async editModal(data) {
            this.isEditing = true;
            this.entity = {...data};
            console.log(this.entity);
            await this.loadOptions();

            KTModal.getInstance(document.querySelector("#modal_store")).show();
        },

        resetModal() {
            this.entity = {
                id: null,
                code: '',
                original_code: '',
                barcode: '',
                description: '',
                brand_id: 0,
                category_id: 0,
                provider_id: 0,
                unit_measurement_id: 0,
                description_measurement_id: 0,
                image: '',
                is_active: 0,
                is_taxed: 0,
                is_service: 0,
                is_grouped: 0,

            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: ProductsService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    provider_type_id: {
                        title: 'Proveedor',
                        render: function (data, type, row) {
                            return type?.provider_type?.description ?? 'S/N';
                        },
                    },
                    document_type_id: {
                        title: 'Tipo Documento',
                        render: function (data, type, row) {
                            return type?.document_type?.description ?? 'S/N';
                        }
                    },
                    document_number: {title: 'N° Documento'},
                    comercial_name: {title: 'Nombre Comercial'},
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
                layout: {scroll: false},
                sortable: true,
            };
            new KTDataTable(tableElement, options);
        },
        deleteRow(id) {
            this.entity.id = id;
            KTModal.getInstance(document.querySelector("#modal-question")).show();
        },
    },
    mounted() {
        this.initDataTable();
        window.editModal = this.editModal.bind(this);
    },
};