import {ref, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../../components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import IntercambioService from '@/services/interchangeService.js';
import ProductsService from "@/services/productsService.js";

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            products_equivalents: [],
            entity: {
                id: 0,
                product_id: null,
                product_id_equivalent: null,
                is_active: 0,
            },
            form: {
                product_id: {isRequired: true, validationSuccess: true},
                product_id_equivalent: {isRequired: true, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? 'Modificar Equivalente' : 'Crear Equivalente';
        },
        modalHeader() {
            return this.isEditing ? 'Modificar Equivalente' : 'Crear Equivalente';
        },
        formFields() {
            return [
                {
                    key: 'product_id',
                    label: 'Producto',
                    type: 'select',
                    placeholder: 'Código',
                    options: this.products_equivalents.map(pe => ({value: pe.id, text: pe.description}))
                },
                {
                    key: 'product_id_equivalent',
                    label: 'Producto Equivalente',
                    type: 'select',
                    placeholder: 'Código',
                    options: this.products_equivalents.map(pe => ({value: pe.id, text: pe.description}))

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
                    await IntercambioService.update(this.entity);
                } else {
                    await IntercambioService.store(this.entity);
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
                const [products_equivalents] = await Promise.all([ProductsService.get()]);
                this.products_equivalents = products_equivalents.data || []; // Asegúrate de que sea un array
            } catch (error) {
                console.error('Error al cargar las opciones:', error);

                this.products_equivalents = [];
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
                await IntercambioService.destroy(this.entity.id);
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
            this.entity.id = data.id;
            console.log(this.entity);
            await this.loadOptions();
            KTModal.getInstance(document.querySelector("#modal_store")).show();
        },

        resetModal() {
            this.entity = {
                id: null,
                product_id: null,
                products_equivalents: null,
                is_active: 0,
            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: IntercambioService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    id: {
                        title: 'codigo',
                        render: (data, type, row) => {
                            return type?.product?.code ?? 'S/N';
                        }
                    },
                    product_id: {
                        title: 'Producto',
                        render: (data, type, row) => {
                            return type?.product?.description ?? 'S/N';
                        }
                    },
                    product_id_equivalent: {
                        title: 'Intercambio',
                        render: (data, type, row) => {
                            return type?.code ?? 'S/N';
                        }

                    },
                    reference: {
                        title: 'Referencia',
                        render: (data, type, row) => {
                            return type?.reference ?? 'S/N';
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
                search: {
                    // input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                    key: 'search', // Parámetro que se enviará al servidor
                    delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                },
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