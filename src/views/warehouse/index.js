import {ref, nextTick, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../components/QuestionModal.vue';
import LongModal from "@/components/longModal.vue";
import warehouseService from "@/services/warehouseService.js";
import EconomicActivityService from "@/services/economicActivityService.js";
import DistricService from "@/services/districService.js";
import CompanyService from "@/services/companyService.js";
import StablishmentTypeService from "@/services/stablishmentTypeService.js";
import companyService from "@/services/companyService.js";
import categoryService from "@/services/categoryService.js";

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            warehouse: {
                id: 0,
                company_id: 0,
                stablishment_type: 0,
                name: '',
                nrc: '',
                nit: '',
                district_id: 0,
                economic_activity_id: 0,
                address: '',
                phone: '',
                email: '',
                product_prices: 0,
                logo: '',
                is_active: 0,
            },
            companies: [],
            districts: [],
            economicActivities: [],
            stablishmentTypes: [],
            form: Object.fromEntries(
                Object.keys({
                    id: 0,
                    company_id: 0,
                    stablishment_type: 0,
                    name: '',
                    nrc: '',
                    nit: '',
                    district_id: 0,
                    economic_activity_id: 0,
                    address: '',
                    phone: '',
                    email: '',
                    product_prices: 0,
                    logo: '',
                    is_active: 0,
                }).map(field => [field, {isrequired: true, validationSuccess: true}])
            )
        };


    },
    methods: {
        async store() {
            try {
                if (!this.validationForm()) return;
                if (this.loading) return;
                this.loading = true;
                await warehouseService.store(this.warehouse)
                this.loading = false;
                window.location.reload()

            } catch (error) {

            } finally {
                this.loading = false;
            }
        },
        async updateModule() {
            try {
                if (!this.validationForm()) return;
                if (this.loading) return;
                this.loading = true;
                await companyService.update(this.warehouse)
                this.loading = false;
                window.location.reload()
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        validationForm() {
            this.form.id.validationSuccess = Number.isInteger(this.warehouse.id);
            this.form.company_id.validationSuccess = Number.isInteger(this.warehouse.company_id);
            this.form.stablishment_type.validationSuccess = Number.isInteger(this.warehouse.stablishment_type);
            this.form.name.validationSuccess = this.warehouse.name.trim() !== '';
            this.form.nrc.validationSuccess = this.warehouse.nrc.trim() !== '';
            this.form.nit.validationSuccess = this.warehouse.nit.trim() !== '';
            this.form.district_id.validationSuccess = Number.isInteger(this.warehouse.district_id);
            this.form.economic_activity_id.validationSuccess = Number.isInteger(this.warehouse.economic_activity_id);
            this.form.email.validationSuccess = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.warehouse.email); // Validación de address
            this.form.address.validationSuccess = this.warehouse.address.trim() !== '';
            this.form.product_prices.validationSuccess = Number.isInteger(this.warehouse.product_prices);
            this.form.logo.validationSuccess = this.warehouse.logo.trim() !== '';
            // this.form.is_active.validationSuccess = typeof this.warehouse.is_active === 'boolean';
            return Object.values(this.form).every(field => field.validationSuccess);

        },
        async destroy() {
            if (this.loading) return;
            this.loading = true;
            await companyService.destroy(this.warehouse.id);
            this.loading = false;
            window.location.reload();
        },
        deleteRow(id) {
            const modalElement = document.querySelector("#modal-question");
            const modal = KTModal.getInstance(modalElement);
            modal.show();
            this.warehouse.id = id;
        },
        async openStoreModal() {
            const modalElement = document.querySelector("#modal_store");
            const modal = KTModal.getInstance(modalElement);
            modal.show();
            const stablismentTypesResponse = await StablishmentTypeService.get();
            this.stablishmentTypes = stablismentTypesResponse.data; // Adjust based on API response structure
            const districtsResponse = await DistricService.get();
            this.districts = districtsResponse.data; // Adjust based on API response structure
            const economicActivitiesResponse = await EconomicActivityService.get();
            this.economicActivities = economicActivitiesResponse.data; // Adjust based on API response structure
            const companyResponse = await CompanyService.get();
            this.companies = companyResponse.data; // Adjust based on API response structure
            console.log(this.companies);

        },
        async editRow(data) {
            const modalElement = document.querySelector("#modal_edit");
            const modal = KTModal.getInstance(modalElement);
            modal.show();
            const company = await CompanyService.getOne(data.id);
            this.districts = data.district;
            this.economicActivities = company.data.economic_activity;

            this.warehouse.id = data.id;
            this.warehouse.company_id = data.company_id;
            this.warehouse.stablishment_type = data.stablishment_type;
            this.warehouse.name = data.name;
            this.warehouse.nrc = data.nrc;
            this.warehouse.nit = data.nit;
            this.warehouse.district_id = data.district_id;
            this.warehouse.economic_activity_id = data.economic_activity_id;
            this.warehouse.address = data.address;
            this.warehouse.address = data.address;
            this.warehouse.email = data.email;
            this.warehouse.product_prices = data.product_prices;
            this.warehouse.logo = data.logo;
            // this.warehouse.is_active = data.is_active;

        },
        async initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: warehouseService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                columns: {
                    stablishment_type: {
                        title: "Establishment",
                        render: function (data, type, row) {
                            return row._data[0]?.stablishment_type?.description ?? 'S/N';
                        },
                    },
                    name: {
                        title: 'warehouse'
                    },

                    nrc: {
                        title: 'NRC',
                    },
                    nit: {
                        title: 'NIT',
                    },
                    district_id: {
                        title: 'Teléfono',
                    },
                    economic_activity_id: {
                        title: 'economic_activity_id',
                    },


                    edit: {
                        render: (item) => `<i class="ki-outline ki-notepad-edit"> </i>`,
                        createdCell(cell, cellData, rowData) {
                            cell.addEventListener('click', function () {
                                editRow(rowData);
                            });
                        },
                    },

                },

                layout: {
                    scroll: false,
                },
                sortable: true,
            };
            new KTDataTable(tableElement, options);
        }

    },
    async mounted() {
        window.editRow = this.editRow.bind(this);
        this.$nextTick(() => {
            this.initDataTable();
        });
    },
};
onMounted(async () => { // Cargamos las categorías al montar el componente
    nextTick(() => {
        KTDataTable.init();
        KTModal.init();
    });
});
