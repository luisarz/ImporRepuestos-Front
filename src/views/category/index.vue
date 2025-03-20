<template>
    <div class="grid" id="kt_remote_table" data-datatable="true">
        <div class="card card-grid min-w-full">
            <div class="card-header py-5 flex-wrap">
                <h1 class="card-title">
                    Categorias
                </h1>
                <label class="switch switch-sm">
                    <button class="btn btn-primary" data-modal-toggle="#modal_store">
                        <i class="ki-filled ki-plus-squared"></i>
                        Agregar Categoria
                    </button>
                </label>
            </div>
            <div class="card-body">
                <div>
                    <div class="scrollable-x-auto">
                        <table id="#table_category" class="table table-auto table-border" data-datatable-table="true">
                            <thead>
                                <tr>
                                    <th class="w-[100px] text-center" data-datatable-column="status">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Codigo
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                                    </th>
                                    <th class="min-w-[250px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Descripcion
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                                    </th>
                                    <th class="w-[60px]">
                                    </th>
                                    <th class="w-[60px]">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div
                class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
                <div class="flex items-center gap-2">
                    Mostrar
                    <select class="select select-sm w-16" data-datatable-size="true" name="perpage">
                    </select>
                    por Pagina
                </div>
                <div class="flex items-center gap-4">
                    <span data-datatable-info="true"></span>
                    <div class="pagination" data-datatable-pagination="true"></div>
                </div>
            </div>
        </div>
    </div>
    <GeneralModal id="modal_store" title="Agregar Categoria">
        <template #body>
            <input type="hidden" name="idcategory" v-model="category.id">
            <div class="w-full">
                <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label class="form-label max-w-32">
                        Codigo
                    </label>
                    <div class="flex flex-col w-full gap-1">
                        <input class="input" @change="validationForm"
                            :class="{ 'border-danger': !form.description.validationSuccess }" name="codigo"
                            v-model="category.code" placeholder="Codigo de la Categoria" type="text" value="" />
                        <span class="form-hint text-danger" v-if="!form.code.validationSuccess">
                            * Campo Obligatorio
                        </span>
                    </div>
                </div>
            </div>
            <br>
            <div class="w-full">
                <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label class="form-label max-w-32">
                        Desccripcion
                    </label>
                    <div class="flex flex-col w-full gap-1">
                        <input class="input" @change="validationForm"
                            :class="{ 'border-danger': !form.description.validationSuccess }" name="description"
                            v-model="category.description" placeholder="Descripcion de la Categoria" type="text"
                            value="" />
                        <span class="form-hint text-danger" v-if="!form.description.validationSuccess">
                            * Campo Obligatorio
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <button class="btn btn-light" data-modal-dismiss="true">
                Cancel
            </button>
            <button class="btn btn-primary" @click="storeCategory()">
                Guardar
            </button>
        </template>
    </GeneralModal>

    <GeneralModal id="modal_edit" title="Editar Categoria">
        <template #body>
            <input type="hidden" name="idcategory" v-model="category.id">
            <div class="w-full">
                <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label class="form-label max-w-32">
                        Codigo
                    </label>
                    <div class="flex flex-col w-full gap-1">
                        <input class="input" @change="validationForm"
                            :class="{ 'border-danger': !form.code.validationSuccess }" name="codigo"
                            v-model="category.code" placeholder="Codigo de la Categoria" type="text" value="" />
                        <span class="form-hint text-danger" v-if="!form.code.validationSuccess">
                            * Campo Obligatorio
                        </span>
                    </div>
                </div>
            </div>
            <br>
            <div class="w-full">
                <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label class="form-label max-w-32">
                        Desccripcion
                    </label>
                    <div class="flex flex-col w-full gap-1">
                        <input class="input" @change="validationForm"
                            :class="{ 'border-danger': !form.description.validationSuccess }" name="description"
                            v-model="category.description" placeholder="Descripcion de la Categoria" type="text"
                            value="" />
                        <span class="form-hint text-danger" v-if="!form.description.validationSuccess">
                            * Campo Obligatorio
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <button class="btn btn-light" data-modal-dismiss="true">
                Cancel
            </button>
            <button class="btn btn-primary" @click="updateCategory()">
                Guardar
            </button>
        </template>
    </GeneralModal>
    <QuestionModal title="title" id="modal-question">
        <template #footer>
            <button class="btn btn-danger" @click="destroy()">
                Eliminar
            </button>
        </template>
    </QuestionModal>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue';
import { KTDataTable, KTModal } from './../../metronic/core/index';
import categoryService from '@/services/categoryService';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../components/QuestionModal.vue';

export default {
    components: { GeneralModal, QuestionModal },
    data() {
        return {
            loading: false,
            category: {
                id: 0,
                code: '',
                description: '',
                commission_percentage: 0,
                is_active: 1
            },
            form: {
                code: {
                    isrequired: true,
                    validationSuccess: true,
                },
                description: {
                    isrequired: true,
                    validationSuccess: true,
                }
            }
        };
    },
    methods: {
        async storeCategory() {
            try {
                if (!this.validationForm()) return;
                if (this.loading) return;
                this.loading = true;
                await categoryService.store(this.category)
                this.loading = false;
                window.location.reload()

            } catch (error) {

            }
        },
        async updateCategory() {
            try {
                if (!this.validationForm()) return;
                if (this.loading) return;
                this.loading = true;
                await categoryService.update(this.category)
                this.loading = false;
                window.location.reload()

            } catch (error) {

            }
        },
        validationForm() {
            // Validar cada campo por separado y guardar el estado de validación
            this.form.code.validationSuccess = this.category.code.trim() !== '';
            this.form.description.validationSuccess = this.category.description.trim() !== '';

            // Retornar `true` solo si ambos campos son válidos
            return this.form.code.validationSuccess && this.form.description.validationSuccess;
        },
        async destroy(){
            if (this.loading) return;
            this.loading = true;
            await categoryService.destroy(this.category.id);
            this.loading = false;
            window.location.reload();
        },
        deleteRow(id){
            const modalElement = document.querySelector("#modal-question");
            const modal = KTModal.getInstance(modalElement);
            modal.show();
            this.category.id = id;
        },
        editRow(data){
            const modalElement = document.querySelector("#modal_edit");
            const modal = KTModal.getInstance(modalElement);
            modal.show();
            this.category.id = data.id
            this.category.code = data.code
            this.category.description = data.description
            this.category.commission_percentage= data.commission_percentage
        },
        async initDataTable() {
            const tableElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: categoryService.getUrl(),
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                columns: {
                    code: {
                        title: 'Codigo'
                    },
                    description: {
                        title: 'Descripcion',
                    },
                    edit: {
                        render: (item) => `<i class="ki-outline ki-notepad-edit">
                                        </i>`,
                        createdCell(cell, cellData, rowData) {
                            // Agregar evento de clic
                            cell.addEventListener('click', function () {
                                editRow(rowData)
                            });
                        },
                    },
                    delete: {
                        render: (item) => `<a onclick="destroy(1)"><i class="ki-outline ki-trash" >
                                        </i></a>`,
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
        this.$nextTick(()=>{
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
</script>
