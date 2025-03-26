import {ref, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../../components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import ProviderTypeService from '@/services/providers/providerTypeService.js';
import DocumentProviderTypeService from '@/services/providers/providerDocumentTypeService.js';
import EconomicActivityService from "@/services/hacienda/economicActivityService.js";
import ProviderService from "@/services/providers/providerService.js";

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            providerTypes: [],
            documentTypes: [],
            economicActivities: [],
            entity: {
                id: 0,
                legal_name: '',
                comercial_name: '',
                document_type_id: 0,
                document_number: 0,
                economic_activity_id: 0,
                provider_type_id: 0,
                payment_type_id: 0,
                credit_days: 0,
                credit_limit: 0,
                debit_balance: 0,
                last_purchase: 0,
                decimal_purchase: 0,
                is_active: 0,
            },
            form: {
                // id: {isRequired: true, validationSuccess: true},
                legal_name: {isRequired: true, validationSuccess: true},
                comercial_name: {isRequired: true, validationSuccess: true},
                document_type_id: {isRequired: true, validationSuccess: true},
                document_number: {isRequired: true, validationSuccess: true},
                economic_activity_id: {isRequired: true, validationSuccess: true},
                provider_type_id: {isRequired: true, validationSuccess: true},
                payment_type_id: {isRequired: true, validationSuccess: true},
                credit_days: {isRequired: true, validationSuccess: true},
                credit_limit: {isRequired: true, validationSuccess: true},
                debit_balance: {isRequired: true, validationSuccess: true},
                last_purchase: {isRequired: true, validationSuccess: true},
                decimal_purchase: {isRequired: true, validationSuccess: true},
                is_active: {isRequired: false, validationSuccess: true},
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? `Modificar -${this.moduleName}` : `Crear - ${this.moduleName}`;
        },
        moduleName() {
            return ' Proveedores';
        },


        formFields() {
            return [
                {
                    key:'provider_type_id',
                    label: 'Tipo de Provider',
                    type: 'select',
                    options: this.providerTypes.map(p => ({value: p.id, text: p.description})),
                },
                {key: 'legal_name', label: 'Nombre Legal', type: 'input', placeholder: 'Nombre Legal'},

                {key: 'comercial_name', label: 'Nombre Comercial', type: 'input', placeholder: 'Nombre Comercial'},
                {
                    key: 'document_type_id',
                    label: 'Tipo de Documento',
                    type: 'select',
                    placeholder: 'Tipo de Documento',
                    options: this.documentTypes.map(item => ({value: item.id, text: item.description})),
                },
                {key: 'document_number', label: 'Número de Documento', type: 'input', placeholder: 'Número de Documento'},
                {
                    key: 'economic_activity_id',
                    label: 'Actividad Económica',
                    type: 'select',
                    placeholder: 'Actividad Económica',
                    options: this.economicActivities.map(item => ({value: item.id, text: item.description})),
                },

                {
                    key: 'payment_type_id',
                    label: 'Tipo de Pago',
                    type: 'select',
                    placeholder: 'Tipo de Pago',
                    options: [
                        {value: 1, text: 'Contado'},
                        {value: 2, text: 'Crédito'},
                    ],
                },
                {key: 'credit_days', label: 'Días de Crédito', type: 'number', placeholder: 'Días de Crédito'},
                {key: 'credit_limit',label: 'Límite de Crédito', type: 'number', placeholder: 'Límite de Crédito'},
                {key: 'debit_balance', label: 'Saldo pendiente',type: 'number',placeholder: 'Saldo pendiente'},
                {key: 'last_purchase', label: 'Última Compra',type: 'date',placeholder: 'Última Compra'},
                {key: 'decimal_purchase', label: 'Compra Decimal',type: 'input',placeholder: 'Compra Decimal'},
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
                    await ProviderService.update(this.entity);
                } else {
                    await ProviderService.store(this.entity);
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
                const [providerTypes,  documentTypes, economicActivities] = await Promise.all([
                    ProviderTypeService.get(),
                    DocumentProviderTypeService.get(),
                    EconomicActivityService.get(),
                ]);

                // Asigna los datos a las propiedades reactivas
                this.providerTypes = providerTypes.data || [];
                this.documentTypes = documentTypes.data || []; // Asegúrate de que sea un array
                this.economicActivities = economicActivities.data || []; // Asegúrate de que sea un array
            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.documentProviderTypes = [];
                this.documentTypes = [];
                this.economicActivities = [];
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
                await ProviderService.destroy(this.entity.id);
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
                legal_name: '',
                comercial_name: '',
                document_type_id: null,
                document_number: 0,
                economic_activity_id: null,
                provider_type_id: null,
                payment_type_id: null,
                credit_days: 0,
                credit_limit: 0,
                debit_balance: 0,
                last_purchase: 0,
                decimal_purchase: 0,
                is_active: 0,
            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: ProviderService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    provider_type_id: {title: 'Proveedor',
                        render: function (data, type, row) {
                            return type?.provider_type?.description ?? 'S/N';
                        },
                    },
                    document_type_id: {title: 'Tipo Documento',
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