<template>
  <div class="grid" id="kt_remote_table" data-datatable="true">
    <div class="card card-grid min-w-full">
      <div class="card-header py-5 flex-wrap">
        <h1 class="card-title">
          Módulos
        </h1>
        <label class="switch switch-sm">
          <button class="btn btn-primary" @click="openStoreModal">
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
      <div class="card">
        <div class="card-header">
          Aperturar Nueva Sucursal
        </div>
        <div class="card-body"></div>
      </div>
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
      <div class="w-full" v-if="modulo.is_padre === 1">
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label class="form-label max-w-32">
            Menú principal
          </label>
          <div class="flex flex-col w-full gap-1">
            <select class="select" @change="validationForm"
                    :class="{ 'border-danger': !form.id_padre.validationSuccess }"
                    name="id_padre" v-model="modulo.id_padre">
              <option v-for="module in modules" :value="module.id">{{ module.nombre }}</option>
            </select>
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
<script src="./index.js"></script>
