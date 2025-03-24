import {ref, onMounted, nextTick} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '@/components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import CategoryService from '@/services/categoryService.js';

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            categories: [],
            entity: {
                id: 0,
                code: '',
                description: '',
                commission_percentage: 0,
                category_parent_id: 0,
                is_active: 0,
            },
            form: {
                code: {isRequired: true, validationSuccess: true},
                description: {isRequired: true, validationSuccess: true},
                commission_percentage: {isRequired: true, validationSuccess: true},
                category_parent_id: {isRequired: false, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? `Modificar -${this.moduleName}` : `Crear - ${this.moduleName}`;
        },
        moduleName() {
            return 'Categorías';
        },

        formFields() {
            return [
                {key: 'code', label: 'Código', type: 'input', placeholder: 'Código de la categoría'},
                {key: 'description', label: 'Descripción', type: 'input', placeholder: 'Descripción de la categoría'},
                {
                    key: 'commission_percentage',
                    label: 'Porcentaje de Comisión',
                    type: 'number',
                    placeholder: 'Porcentaje de Comisión'
                },
                {
                    key: 'category_parent_id',
                    label: 'Categoría Padre',
                    type: 'select',
                    placeholder: 'Categoría Padre',
                    options: this.categories.map(c => ({value: c.id, text: c.description}))

                },
                {key: 'is_active', label: 'Activo', type: 'checkbox', placeholder: 'Activo'}


            ];
        },
    },
    methods: {
        async save() {

            if (!this.validationForm()) return;
            this.loading = true;
            try {
                if (this.isEditing) {
                    await CategoryService.update(this.entity);
                } else {
                    await CategoryService.store(this.entity);
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
                const [categories] = await Promise.all([
                    CategoryService.get(),
                ]);
                this.categories = categories.data.data || [];

            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.categories = [];
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
                await CategoryService.destroy(this.entity.id);
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
            await this.loadOptions();

            KTModal.getInstance(document.querySelector("#modal_store")).show();
        },

        resetModal() {
            this.entity = {
                id: null,
                name: null,
                guard_name: null,
            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: CategoryService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    code: {title: 'Código'},
                    description: {title: 'description'},
                    category_parent_id: {
                        title: 'Categoría Padre',
                        render: function (data, type, row) {
                            return type.category_parent?.description ?? '';
                        }
                    },
                    commission_percentage: {
                        title: 'Porcentaje de Comisión',
                        render: function (data, type, row) {
                            return data + '%';
                        }
                    },

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


