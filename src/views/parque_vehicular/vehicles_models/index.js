import {ref, onMounted, nextTick} from 'vue';
import {KTDataTable, KTModal} from './../../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../../components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import VehicleModelService from '@/services//parque_vehicular/vehicleModelService.js/';
import BrandService from '@/services/brandService.js';
import CategoryService from "@/services/categoryService.js";
import ProviderService from "@/services/providers/providerService.js";
import UnitMeasurementService from "@/services/hacienda/unitMeasurementService.js";
export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            brands:[],
            entity: {
                id: 0,
                brand_id: 0,
                code: '',
                description: '',
                is_active: 0,
            },
            form: {
                code: {isRequired: true, validationSuccess: true},
                brand_id: {isRequired: true, validationSuccess: true},
                description: {isRequired: true, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? `Modificar -${this.moduleName}` : `Crear - ${this.moduleName}`;
        },
        moduleName() {
            return ' Tipo Placa';
        },

        formFields() {
            return [

                {
                    key: 'code',
                    label: 'Código',
                    type: 'input',
                    placeholder: 'Código',
                },
                {
                    key: 'brand_id',
                    label: 'Marca',
                    type: 'select',
                    placeholder: 'Marca',
                    options: this.brands.map(u => ({value: u.id, text: u.description}))

                },
                {
                    key: 'description',
                    label: 'Modelo',
                    type: 'input',
                    placeholder: 'Modelo',
                },
                {key: 'is_active', label: 'Activo', type: 'checkbox'},
            ];
        },
    },
    methods: {
        async save() {

            if (!this.validationForm()) return;
            this.loading = true;
            try {
                if (this.isEditing) {
                    await VehicleModelService.update(this.entity);
                } else {
                    await VehicleModelService.store(this.entity);
                }
                window.location.reload();
            } catch (error) {
                console.error('Error al guardar el almacén:', error);
            } finally {
                this.loading = false;
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
                await VehicleModelService.destroy(this.entity.id);
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
        async loadOptions() {
            try {

                const [brands] = await Promise.all([
                    BrandService.get(),
                ]);

                // Asigna los datos a las propiedades reactivas
                console.log(brands.data);
                this.brands = brands.data || [];
            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.brands = [];
            }
        },
        async editModal(data) {
            this.isEditing = true;
            this.entity = {...data};
            await this.loadOptions();

            KTModal.getInstance(document.querySelector("#modal_store")).show();
        },

        resetModal() {
            this.entity = {
                id: null,
                brand_id: null,
                code: null,
                description: null,
                is_active: 0,
            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: VehicleModelService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    code: {title: 'Código'},
                    brand_id: {
                        title: 'Tipo Documento',
                        render: function (data, type, row) {
                            return type?.brand?.description ?? 'S/N';
                        }
                    },
                    description: {title: 'Descripción'},
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


