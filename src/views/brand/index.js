import {ref, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import BrandService from '@/services/brandService.js';

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            brand: {
                id: 0,
                code: '',
                description: '',

                is_active: 0,
            },
            form: {
                code: {isRequired: true, validationSuccess: true},
                description: {isRequired: true, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? 'Modificar Marca' : 'Crear Marca';
        },
        modalHeader() {
            return this.isEditing ? 'Modificar Marca' : 'Crear Marca';
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
                    key: 'description',
                    label: 'Marca',
                    type: 'input',
                    placeholder: 'Código',
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
                    await BrandService.update(this.brand);
                } else {
                    await BrandService.store(this.brand);
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
                    this.form[key].validationSuccess = !!this.brand[key];
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
                await BrandService.destroy(this.brand.id);
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
            KTModal.getInstance(document.querySelector("#modal_store")).show();
            this.loading = false;
        },
        async editModal(data) {
            this.isEditing = true;
            this.brand = {...data};
            KTModal.getInstance(document.querySelector("#modal_store")).show();
        },

        resetModal() {
            this.brand = {
                id: null,
                code: null,
                description: null,
                is_active: 0,
            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: BrandService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    code: {title: 'Código'},
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
            this.brand.id = id;
            KTModal.getInstance(document.querySelector("#modal-question")).show();
        },
    },
    mounted() {
        this.initDataTable();
        window.editModal = this.editModal.bind(this);
    },
};