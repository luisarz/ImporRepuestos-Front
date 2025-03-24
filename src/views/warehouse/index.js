import {ref, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../components/QuestionModal.vue';
import warehouseService from '@/services/warehouseService.js';
import EconomicActivityService from '@/services/economicActivityService.js';
import DistricService from '@/services/districService.js';
import CompanyService from '@/services/companyService.js';
import StablishmentTypeService from '@/services/stablishmentTypeService.js';
import LongModal from "@/components/LongModal.vue";

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            warehouse: {
                id: null,
                company_id: null,
                stablishment_type_id: null,
                name: '',
                nrc: '',
                nit: '',
                district_id: null,
                economic_activity_id: null,
                address: '',
                phone: '',
                email: '',
                product_prices: 2,
                logo: '',
                is_active: 0,
            },
            companies: [],
            districts: [],
            economicActivities: [],
            stablishmentTypes: [],
            form: {
                id: {isRequired: true, validationSuccess: true},
                company_id: {isRequired: true, validationSuccess: true},
                stablishment_type_id: {isRequired: true, validationSuccess: true},
                name: {isRequired: true, validationSuccess: true},
                nrc: {isRequired: true, validationSuccess: true},
                nit: {isRequired: true, validationSuccess: true},
                district_id: {isRequired: true, validationSuccess: true},
                economic_activity_id: {isRequired: true, validationSuccess: true},
                address: {isRequired: true, validationSuccess: true},
                phone: {isRequired: true, validationSuccess: true},
                email: {isRequired: true, validationSuccess: true},
                product_prices: {isRequired: true, validationSuccess: true},
                logo: {isRequired: true, validationSuccess: true},
                is_active: {isRequired: true, validationSuccess: true},
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? 'Modificar Sucursal' : 'Aperturar Sucursal';
        },
        modalHeader() {
            return this.isEditing ? 'Modificar Sucursal' : 'Aperturar Nueva Sucursal';
        },
        formFields() {
            return [
                {
                    key: 'company_id',
                    label: 'Empresa',
                    type: 'select',
                    options: this.companies.map(c => ({value: c.id, text: c.company_name}))
                },
                {
                    key: 'stablishment_type_id',
                    label: 'Tipo de Establecimiento',
                    type: 'select',
                    options: this.stablishmentTypes.map(s => ({value: s.id, text: s.description}))
                },
                {key: 'name', label: 'Nombre', type: 'text', placeholder: 'Nombre del almacén'},
                {key: 'nrc', label: 'NRC', type: 'text', placeholder: 'NRC'},
                {key: 'nit', label: 'NIT', type: 'text', placeholder: 'NIT'},
                {
                    key: 'district_id',
                    label: 'Distrito',
                    type: 'select',
                    options: this.districts.map(d => ({value: d.id, text: d.description}))
                },
                {
                    key: 'economic_activity_id',
                    label: 'Actividad Económica',
                    type: 'select',
                    options: this.economicActivities.map(e => ({value: e.id, text: e.description}))
                },
                {key: 'address', label: 'Dirección', type: 'text', placeholder: 'Dirección'},
                {key: 'phone', label: 'Teléfono', type: 'text', placeholder: 'Teléfono'},
                {key: 'email', label: 'Email', type: 'email', placeholder: 'Email'},
                {key: 'product_prices', label: 'Precios de Productos', type: 'number', placeholder: 'Precios'},
                {key: 'logo', label: 'Logo', type: 'text', placeholder: 'URL del logo'},
                {key: 'is_active', label: 'Activo', type: 'checkbox'},
            ];
        },
    },
    methods: {
        async saveWarehouse() {
            if (!this.validationForm()) return;
            this.loading = true;
            try {
                if (this.isEditing) {
                    await warehouseService.update(this.warehouse);
                } else {
                    await warehouseService.store(this.warehouse);
                }
                window.location.reload();
            } catch (error) {
                console.error('Error al guardar el almacén:', error);
            } finally {
                this.loading = false;
            }
        },

        validationForm() {
            Object.keys(this.form).forEach((key) => {
                if (this.form[key].isRequired) {
                    this.form[key].validationSuccess = !!this.warehouse[key];
                }
            });
            return Object.values(this.form).every((field) => field.validationSuccess);
        },
        async destroy() {
            if (this.loading) return;
            this.loading = true;
            try {
                await warehouseService.destroy(this.warehouse.id);
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
            this.resetWarehouse();
            await this.loadOptions();
            KTModal.getInstance(document.querySelector("#modal_store")).show();
            this.loading = false;
        },
        async editModal(data) {
            this.isEditing = true;
            this.warehouse = {...data};
            await this.loadOptions();
            KTModal.getInstance(document.querySelector("#modal_store")).show();
        },
        async loadOptions() {
            try {
                const [stablishmentTypes, districts, economicActivities, companies] = await Promise.all([
                    StablishmentTypeService.get(),
                    DistricService.get(),
                    EconomicActivityService.get(),
                    CompanyService.get(),
                ]);

                // Asigna los datos a las propiedades reactivas
                this.stablishmentTypes = stablishmentTypes.data || [];
                this.districts = districts.data || []; // Asegúrate de que sea un array
                this.economicActivities = economicActivities.data || []; // Asegúrate de que sea un array
                this.companies = companies.data || [];
            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.stablishmentTypes = [];
                this.districts = [];
                this.economicActivities = [];
                this.companies = [];
            }
        },
        resetWarehouse() {
            this.warehouse = {
                id: null,
                company_id: null,
                stablishment_type_id: null,
                name: '',
                nrc: '',
                nit: '',
                district_id: null,
                economic_activity_id: null,
                address: '',
                phone: '',
                email: '',
                product_prices: 2,
                logo: '',
                is_active: 0,
            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: warehouseService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    stablishment_type_id: {
                        title: "Establishment",
                        render: function (data, type, row) {
                            return type?.stablishment_type?.description ?? 'S/N';
                        },
                    },
                    name: {title: 'Sucursal'},
                    nrc: {title: 'NRC'},
                    nit: {title: 'NIT'},
                    phone: {title: 'Teléfono'},
                    edit: {
                        render: () => `<i class="ki-outline ki-notepad-edit text-lg text-primary cursor: pointer" ></i>`,
                        createdCell: (cell, cellData, rowData) => {
                            cell.addEventListener('click', () => this.editModal(rowData));
                        },
                    },
                    delete: {
                        render: () => `<i class="ki-outline ki-trash text-lg text-danger text-center"></i>`,
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
            this.warehouse.id = id;
            KTModal.getInstance(document.querySelector("#modal-question")).show();
        },
    },
    mounted() {
        this.initDataTable();
        window.editModal = this.editModal.bind(this);
    },
};