<template>
  <div class="grid" id="kt_remote_table" data-datatable="true">
    <div class="card card-grid min-w-full">
      <div class="card-header py-5 flex-wrap">
        <h1 class="card-title">
          Tipos de proveedores
        </h1>
        <label class="switch switch-sm">
          <button class="btn btn-success" @click="openStoreModal()" :disabled="loading">
            <i class="ki-filled ki-plus-squared"></i>
            {{ loading ? 'Preparando datos...' : 'Crear Marca' }}

          </button>
        </label>
      </div>
      <div class="card-body">
        <div>
          <div class="scrollable-x-auto">
            <table id="#table_modulo" class="table table-hover table-border" data-datatable-table="true">
              <thead>
              <tr>
                <th class="w-[160px] text-center" data-datatable-column="status">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Código
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Descripción
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
          <select class="select select-sm w-16" data-datatable-size="true" name="perpage" >
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
  <general-modal id="modal_store" :title="modalTitle">
    <template #body>
      <input type="hidden" name="id" v-model="providerType.id"/>
      <div class="card">
<!--        <div class="card-header">{{ modalHeader }}</div>-->
        <div class="card-body">
          <div class="grid grid-cols-1 gap-4">
            <!-- Campos del formulario -->
            <div class="w-full" v-for="field in formFields" :key="field.key">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">{{ field.label }}</label>
                <div class="flex flex-col w-full gap-1">
                  <input
                      v-if="field.type !== 'select' && field.type !== 'checkbox'"
                      class="input"
                      :class="{ 'border-danger': !form[field.key].validationSuccess }"
                      :type="field.type"
                      v-model="providerType[field.key]"
                      :placeholder="field.placeholder"
                  />
                  <select
                      v-else-if="field.type === 'select'"
                      class="select"
                      data-control="select2"
                      v-model="providerType[field.key]"
                  >
                    <option v-for="option in field.options" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <label v-else-if="field.type === 'checkbox'" class="switch">
                    <input type="checkbox" v-model="providerType[field.key]" :true-value="1" :false-value="0"/>
                  </label>
                  <span class="form-hint text-danger" v-if="!form[field.key].validationSuccess">
                    * Campo Obligatorio
                  </span>
                </div>
              </div>
              <br/>
            </div><!--          /Campos-->
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-light" data-modal-dismiss="true">Cancelar</button>
      <button class="btn btn-primary" @click="save" :disabled="loading">
        {{ isEditing ? 'Modificar Tipo de contribuyente' : 'Crear Tipo de contribuyente' }}
      </button>
    </template>
  </general-modal>
  <QuestionModal title="title" id="modal-question">
    <template #footer>

      <button class="btn btn-danger" @click="destroy()">
        Eliminar
      </button>
    </template>
  </QuestionModal>
</template>
<script src="./index.js"></script>
