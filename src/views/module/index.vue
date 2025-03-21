<template>
  <div class="grid" id="kt_remote_table" data-datatable="true">
    <div class="card card-grid min-w-full">
      <div class="card-header py-5 flex-wrap">
        <h1 class="card-title">
          Módulos
        </h1>
        <label class="switch switch-sm">
          <button class="btn btn-primary" data-modal-toggle="#modal_store">
            <i class="ki-filled ki-plus-squared"></i>
            Agregar Módulo
          </button>
        </label>
      </div>
      <div class="card-body">
        <div>
          <div class="scrollable-x-auto">
            <table id="#table_modulo" class="table table-auto table-border" data-datatable-table="true">
              <thead>
              <tr>
                <th class="w-[100px] text-center" data-datatable-column="status">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Módulo
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Padre
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Ruta
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Icono
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Orden
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
  <GeneralModal id="modal_store" data-modal-backdrop-static="true" data-modal-autofocus="true" title="Agregar Modulo">
    <template #body>
      <input type="hidden" name="idmodulo" v-model="modulo.id">
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Módulo
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.nombre.validationSuccess }"
                   name="nombre" v-model="modulo.nombre" placeholder="Nombre del modulo" type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.nombre.validationSuccess"> * Campo Obligatorio</span>
          </div>
        </div>
      </div>
      <br>

      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Ruta
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.ruta.validationSuccess }"
                   name="ruta" v-model="modulo.ruta"
                   placeholder="Ruta del menu " type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.ruta.validationSuccess"> * Campo Obligatorio </span>
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Es menú principal
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="is_padre" type="checkbox" v-model="modulo.is_padre" :true-value="1" :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Menú principal
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm"
                   name="id_padre" v-model="modulo.id_padre"
                   placeholder="Modulo padre " type="text" value=""/>
            <!--            <span class="form-hint text-danger" > * Campo Obligatorio </span>-->
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Orden
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.orden.validationSuccess }"
                   name="orden" v-model="modulo.orden"
                   placeholder="Ruta del menu " type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.icono.validationSuccess"> * Campo Obligatorio </span>
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Icono
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.icono.validationSuccess }"
                   name="icono" v-model="modulo.icono"
                   placeholder="Ruta del menu " type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.icono.validationSuccess"> * Campo Obligatorio </span>
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Menu minimizado
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="is_minimazed" type="checkbox" v-model="modulo.is_minimazed" :true-value="1"
                     :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Ventana Nueva
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="target" type="checkbox" v-model="modulo.target" :true-value="1" :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Activo
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="is_active" type="checkbox" v-model="modulo.is_active" :true-value="1" :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-light" data-modal-dismiss="true">
        Cancel
      </button>
      <button class="btn btn-primary" @click="storeModulo()">
        Guardar
      </button>
    </template>
  </GeneralModal>
  <GeneralModal id="modal_edit" data-modal-backdrop-static="true" data-modal-autofocus="true" title="Modificar Modulo">
    <template #body>
      <input type="hidden" name="idmodulo" v-model="modulo.id">
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Módulo
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.nombre.validationSuccess }"
                   name="nombre" v-model="modulo.nombre" placeholder="Nombre del modulo" type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.nombre.validationSuccess"> * Campo Obligatorio</span>
          </div>
        </div>
      </div>
      <br>

      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Ruta
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.ruta.validationSuccess }"
                   name="ruta" v-model="modulo.ruta"
                   placeholder="Ruta del menu " type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.ruta.validationSuccess"> * Campo Obligatorio </span>
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Es menú principal
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="is_padre" type="checkbox" v-model="modulo.is_padre" :true-value="1" :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Menú principal
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm"
                   name="id_padre" v-model="modulo.id_padre"
                   placeholder="Modulo padre " type="text" value=""/>
                        <span class="form-hint text-danger" v-if="!form.validationSuccess"> * Campo Obligatorio </span>
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Orden
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.orden.validationSuccess }"
                   name="orden" v-model="modulo.orden"
                   placeholder="Ruta del menu " type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.icono.validationSuccess"> * Campo Obligatorio </span>
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Icono
          </label>
          <div class="flex flex-col w-full gap-1">
            <input class="input" @change="validationForm" :class="{ 'border-danger': !form.icono.validationSuccess }"
                   name="icono" v-model="modulo.icono"
                   placeholder="Ruta del menu " type="text" value=""/>
            <span class="form-hint text-danger" v-if="!form.icono.validationSuccess"> * Campo Obligatorio </span>
          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Menu minimizado
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="is_minimazed" type="checkbox" v-model="modulo.is_minimazed" :true-value="1"
                     :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Ventana Nueva
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="target" type="checkbox" v-model="modulo.target" :true-value="1" :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
      <br>
      <div class="w-full">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Activo
          </label>
          <div class="flex flex-col w-full gap-1">
            <label class="switch">
              <input name="is_active" type="checkbox" v-model="modulo.is_active" :true-value="1" :false-value="0"/>
            </label>

          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-light" data-modal-dismiss="true">
        Cancel
      </button>
      <button class="btn btn-primary" @click="updateModule()">
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
import {ref, nextTick, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import moduleService from '@/services/moduleService';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../components/QuestionModal.vue';
import ModuleService from "@/services/moduleService";


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
</script>