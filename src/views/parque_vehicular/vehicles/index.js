import {ref, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '@/components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import VehiclesModelService from "@/services/parque_vehicular/vehicleModelService.js";
import FuelTypeService from "@/services/parque_vehicular/fuelTypeService.js";
import PlateTypeService from "@/services/parque_vehicular/plateTypeService.js";
import VehicleService from "@/services/parque_vehicular/vehiclesService.js";
// import MunicipalityService from "@/services/hacienda//plateTypeService.js";

export default {
    components: {LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            isEditing: false,
            vehicleModels: [],
            fuelTypes: [],
            plateTypes: [],
            municipalities: [],
            entity: {
                id: 0,
                model_id: '',
                model_two: '',
                year: '',
                chassis: '',
                vin: 0,
                motor: 0,
                displacement: 0,
                motor_type: 0,
                fuel_type: 0,
                vehicle_class: 0,
                income_date: '',
                municipality_id: 0,
                antique: 0,
                capacity: 0,
                tonnage: 0,
                is_active: 0
            },
            form: {
                model_id: {isRequired: true, validationSuccess: true},
                model_two: {isRequired: false, validationSuccess: false},
                year: {isRequired: true, validationSuccess: true},
                chassis: {isRequired: true, validationSuccess: true},
                vin: {isRequired: true, validationSuccess: true},
                motor: {isRequired: true, validationSuccess: true},
                displacement: {isRequired: true, validationSuccess: true},
                motor_type: {isRequired: true, validationSuccess: true},
                fuel_type: {isRequired: true, validationSuccess: true},
                vehicle_class: {isRequired: true, validationSuccess: true},
                income_date: {isRequired: false, validationSuccess: false},
                municipality_id: {isRequired: true, validationSuccess: true},
                antique: {isRequired: true, validationSuccess: true},
                plate_type: {isRequired: true, validationSuccess: true},
                capacity: {isRequired: true, validationSuccess: true},
                tonnage: {isRequired: true, validationSuccess: true},
                is_active: {isRequired: true, validationSuccess: true}
            },
        };
    },
    computed: {
        modalTitle() {
            return this.isEditing ? `Modificar -${this.moduleName}` : `Crear - ${this.moduleName}`;
        },
        moduleName() {
            return ' Vehículos';
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
                    key: 'model_id',
                    label: 'Modelo',
                    type: 'select',
                    placeholder: 'Modelo',
                    options: this.vehicleModels.map(v => ({value: v.id, text: v.description}))
                },
                {key: 'model_two', label: 'Modelo 2', type: 'input', placeholder: 'Modelo 2'},
                {key: 'year', label: 'Año', type: 'input', placeholder: 'Año'},
                {key: 'chassis', label: 'Chasis', type: 'input', placeholder: 'Chasis'},
                {key: 'vin', label: 'VIN', type: 'input', placeholder: 'VIN'},
                {key: 'motor', label: 'Motor', type: 'input', placeholder: 'Motor'},
                {key: 'displacement', label: 'Cilindraje', type: 'input', placeholder: 'Cilindraje'},
                {key: 'motor_type', label: 'tipo de motor', type: 'input', placeholder: 'Seleccione una categoría'},
                {
                    key: 'fuel_type',
                    label: 'Tipo Combustible',
                    type: 'select',
                    placeholder: 'Seleccione un combustible',
                    options: this.fuelTypes.map(p => ({value: p.id, text: p.description})),
                },
                {key: 'vehicle_class', label: 'Tipo de vehiculo', type: 'input', placeholder: 'Tipo de vehiculo',},
                {key: 'income_date', label: 'Fecha de ingreso', type: 'date', placeholder: 'Fecha de ingreso'},
                {
                    key: 'municipality_id',
                    label: 'Municipio Ingreso',
                    type: 'input',
                    placeholder: 'Municipio Ingreso',
                    options: this.municipalities.map(m => ({value: m.id, text: m.description}))
                },
                {key: 'antique', label: 'antique', type: 'input', placeholder: 'Antiguedad'},
                {
                    key: 'plate_type',
                    label: 'Tipo Placa',
                    type: 'select',
                    placeholder: 'Seleccione un tipo de placa',
                    options: this.plateTypes.map(p => ({value: p.id, text: p.description}))
                },
                {key: 'capacity', label: 'capacity', type: 'input', placeholder: 'Capacidad'},
                {key: 'tonnage', label: 'tonnage', type: 'input', placeholder: 'Tonelage'},
                {key: 'is_active', label: 'Activo', type: 'checkbox', placeholder: 'Activo'},
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
                    await VehicleService.update(this.entity);
                } else {
                    await VehicleService.store(this.entity);
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

                const [vehicleModels, fuelTypes, plateTypes] = await Promise.all([
                    VehiclesModelService.get(),
                    FuelTypeService.get(),
                    PlateTypeService.get(),
                ]);

                // Asigna los datos a las propiedades reactivas
                this.vehicleModels = vehicleModels.data || [];
                this.fuelTypes = fuelTypes.data || []; // Asegúrate de que sea un array
                this.plateTypes = plateTypes.data || []; // Asegúrate de que sea un array
            } catch (error) {
                console.error('Error al cargar las opciones:', error);
                this.vehicleModels = [];
                this.FuelTypeService = [];
                this.PlateTypeService = [];
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
                await VehicleService.destroy(this.entity.id);
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
                model_id: 0,
                model_two: '',
                year: 0,
                chassis: '',
                vin: 0,
                motor: 0,
                displacement: 0,
                motor_type: 0,
                fuel_type: 0,
                vehicle_class: 0,
                income_date: '',
                municipality_id: 0,
                antique: 0,
                plate_type: 0,
                capacity: 0,
                tonnage: 0,
                is_active: 0


            };
        },
        initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: VehicleService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    Marca: {
                        title: 'Marca',
                        render: function (data, type, row) {
                            return type?.model?.brand?.description ?? 'S/N';
                        }
                    },
                    model_id: {
                        title: 'Modelo',
                        render: function (data, type, row) {
                            return type?.model?.description ?? 'S/N';
                        }
                    },

                    year: {
                        title: 'Año',
                    },
                    chassis: {
                        title: 'Chasis',
                    },
                    vin: {title: 'N° VIN'},
                    motor: {title: 'Motor'},
                    displacement: {title: 'Motor'},
                    motor_type: {title: 'Motor'},
                    vehicle_class: {title: 'Motor'},
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