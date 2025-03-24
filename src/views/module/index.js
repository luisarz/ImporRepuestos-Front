import {nextTick, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import moduleService from '@/services/moduleService';
import ModuleService from '@/services/moduleService';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../components/QuestionModal.vue';
import StablishmentTypeService from "@/services/stablishmentTypeService.js";
import DistricService from "@/services/districService.js";
import EconomicActivityService from "@/services/economicActivityService.js";
import CompanyService from "@/services/companyService.js";


export default {
    components: {GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            modulo: {
                id: 0,
                nombre: '',
                icono: '',
                ruta: '',
                id_padre: 0,
                is_padre: 0,
                orden: 0,
                is_minimazed: 0,
                target: 0,
                is_active: 0,
            },
            modules:[],
            form: Object.fromEntries(
                Object.keys({
                    id: 0,
                    nombre: '',
                    icono: '',
                    ruta: '',
                    id_padre: 0,
                    is_padre: 0,
                    orden: 0,
                    is_minimazed: 0,
                    target: 0,
                    is_active: 0,
                }).map(field => [field, {isrequired: true, validationSuccess: true}])
            )
        };

    },
    methods: {
       async loadModules() {
           try {
              const modules_response = await moduleService.get();
               this.modules = modules_response.data.data || [];
               // console.log(this.modules.data.data);
           } catch (error) {
               console.error('Error al cargar las opciones:', error);
               this.modules = [];
           }
        },
        async openStoreModal() {
            const modalElement = document.querySelector("#modal_store");
            const modal = KTModal.getInstance(modalElement);
            await this.loadModules();
            modal.show();
        },
        async storeModulo() {
            try {
                if (!this.validationForm()) return;
                if (this.loading) return;
                this.loading = true;
                await moduleService.store(this.modulo)
                this.loading = false;
                window.location.reload()

            } catch (error) {
                console.log(error)
            }
        },
        async updateModule() {
            try {
                if (!this.validationForm()) return;
                if (this.loading) return;
                this.loading = true;
                await moduleService.update(this.modulo)
                this.loading = false;
                window.location.reload()

            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        validationForm() {
            this.form.nombre.validationSuccess = this.modulo.nombre.trim() !== '';
            this.form.ruta.validationSuccess = this.modulo.ruta.trim() !== '';
            this.form.is_padre.validationSuccess = Number.isInteger(this.modulo.is_padre);
            this.form.orden.validationSuccess = Number.isInteger(this.modulo.orden);
            this.form.icono.validationSuccess = this.modulo.icono.trim() !== '';
            this.form.is_minimazed.validationSuccess = Number.isInteger(this.modulo.is_minimazed);
            this.form.target.validationSuccess = Number.isInteger(this.modulo.is_minimazed);
            return this.form.nombre.validationSuccess && this.form.ruta.validationSuccess;
        },
        async destroy() {
            if (this.loading) return;
            this.loading = true;
            await ModuleService.destroy(this.modulo.id);
            this.loading = false;
            window.location.reload();
        },
        deleteRow(id) {
            const modalElement = document.querySelector("#modal-question");
            const modal = KTModal.getInstance(modalElement);
            modal.show();
            this.modulo.id = id;
        },
        editRow(data) {
            const modalElement = document.querySelector("#modal_edit");
            const modal = KTModal.getInstance(modalElement);
            modal.show();
            this.modulo.id = data.id
            this.modulo.nombre = data.nombre
            this.modulo.icono = data.icono
            this.modulo.ruta = data.ruta
            this.modulo.id_padre = data.id_padre
            this.modulo.is_padre = data.is_padre
            this.modulo.orden = data.orden
            this.modulo.is_minimazed = data.is_minimazed
            this.modulo.target = data.target
        },
        async initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: moduleService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                columns: {
                    nombre: {
                        title: 'Modulo'
                    },
                    id_padre: {
                        title: 'Padre',
                    },
                    ruta: {
                        title: 'Ruta',
                    },
                    icono: {
                        title: 'Icono',
                        render: (data, type, row) => {
                            return `<i class="ki-outline ki-${data} text-lg"></i>`; // Suponiendo que `data` es la clase del icono
                        }
                    },
                    orden: {
                        title: 'Orden',
                    },
                    edit: {
                        render: (item) => `<i class="ki-outline ki-notepad-edit"> </i>`,
                        createdCell(cell, cellData, rowData) {
                            cell.addEventListener('click', function () {
                                editRow(rowData)
                            });
                        },
                    },
                    delete: {
                        render: (item) => `<a onclick="destroy(1)"><i class="ki-outline ki-trash" ></i></a>`,
                        createdCell(cell, cellData, rowData) {
                            // Agregar evento de clic
                            cell.addEventListener('click', function () {
                                console.log(rowData.id)
                                deleteRow(rowData.id)
                            });
                        },
                    }
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
        window.deleteRow = this.deleteRow.bind(this);
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