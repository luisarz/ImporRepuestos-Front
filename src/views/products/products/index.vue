<template>
  <div class="grid" id="kt_remote_table">
    <div class="card card-grid min-w-full">
      <div class="card-header flex-wrap py-2">
        <div class="relative  min-w-[450px]">
          <i class="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3">
          </i>
          <input class="input input-md pl-8 w-100 " data-datatable-search="#kt_remote_table"
                 placeholder="Buscar inventarios"
                 id="search_description"
                 type="text">
        </div>



        <div class="flex gap-6">


          <label class="switch switch-sm">
            <button class="btn btn-success" @click="openStoreModal()" :disabled="loading">
              <i class="ki-filled ki-plus-squared"></i>
              {{ loading ? 'Preparando datos...' : 'Crear ' }} {{ moduleName }}

            </button>
          </label>
        </div>
      </div>
      <div class="card-body">

        <div class="scrollable-x-auto">

          <table class="table table-sm table-border align-middle text-sm"
                 data-datatable-table="true"  data-datatable-search="true">
            <thead>
            <tr>
              <th class="min-w-[60px] text-center" data-datatable-column="code">
                              <span class="sort">
                                  <span class="sort-label"> Código</span>
                                  <span class="sort-icon"></span>
                              </span>
              </th>
              <th class="min-w-[60px] text-center" data-datatable-column="original_code">
                              <span class="sort">
                                  <span class="sort-label">Cod. Orig</span>
                                  <span class="sort-icon"></span>
                              </span>
              </th>
              <th class="min-w-[160px] text-center" data-datatable-column="barcode">
                              <span class="sort">
                                  <span class="sort-label"> Cod.Barra</span>
                                  <span class="sort-icon"></span>
                              </span>
              </th>
              <th class="min-w-[160px] text-center" data-datatable-column="category">
                              <span class="sort">
                                  <span class="sort-label">Categoría</span>
                                  <span class="sort-icon"></span>
                              </span>
              </th>
              <th class="min-w-[260px] text-center" data-datatable-column="description">
                              <span class="sort">
                                  <span class="sort-label">Descripción</span>
                                  <span class="sort-icon"></span>
                              </span>
              </th>
              <th class="w-[160px] text-center" data-datatable-column="description_measurement_id">
                              <span class="sort">
                                  <span class="sort-label">Medida</span>
                                  <span class="sort-icon"></span>
                              </span>
              </th>
              <th class="w-[160px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Marca</span>
                                  <span class="sort-icon"></span>
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

  <LongModal id="modal_store" :title="modalTitle">
    <template #body>
      <input type="hidden" name="id" v-model="entity.id"/>
      <div class="card">
        <!--                <div class="card-header">{{ modalHeader }}</div>-->
        <div class="card-body">
          <div class="grid grid-cols-4 gap-3">


            <!-- Campos del formulario -->
            <div v-for="(group, groupIndex) in formFields()" :key="groupIndex"
                 :class="[ group.group === 'Configuraciones' ? 'col-span-1 gap-4' : 'col-span-3 gap-4',]">
              <!-- Título del grupo -->
              <h3 class="text-lg font-semibold mb-3 border-b pb-2 modal-title ">{{ group.group }}</h3>

              <!-- Campos del grupo -->
              <div class="grid gap-3"
                   :class="group.group === 'Configuraciones'
                           ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2'
                           : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'">
                <div class="w-full" v-for="field in group.fields" :key="field.key">
                  <div class="flex items-baseline flex-wrap lg:flex-nowrap">
                    <!--                    <label class="form-label max-w-32">{{ field.label }}</label>-->
                    <div class="flex flex-col w-full gap-1">
                      <!-- Input de texto/number -->


                      <div v-if="field.type !== 'custom'" class="flex items-baseline flex-wrap lg:flex-nowrap">
                        <label class="form-label max-w-32">{{ field.label }}</label>
                        <div class="flex flex-col w-full gap-1">
                          <input
                              v-if="field.type !== 'select' && field.type !== 'checkbox' && field.type !== 'date' && field.type !== 'file'"
                              class="input"
                              :class=" { 'border-danger': !form[field.key].validationSuccess }"
                              @change="validationForm"
                              :type="field.type"
                              v-model="entity[field.key]"
                              :placeholder="field.placeholder"
                          />


                          <input
                              v-if="field.type === 'file'"
                              type="file"
                              class="file-input"
                              :id="field.key"
                              :placeholder="field.placeholder"
                              @change="onFileChange($event, field.key)"
                          />


                          <!-- Select -->
                          <select
                              v-else-if="field.type === 'select'"
                              class="select"
                              data-control="select2"
                              v-model="entity[field.key]"
                              @change="validationForm"
                          >
                            <option v-for="option in field.options" :key="option.value" :value="option.value">
                              {{ option.text }}
                            </option>
                          </select>

                          <!-- Checkbox -->
                          <label v-else-if="field.type === 'checkbox'" class="switch">
                            <input
                                type="checkbox"
                                v-model="entity[field.key]"
                                :true-value="1"
                                :false-value="0"
                                :checked="entity[field.key] == 1"
                            />
                          </label>

                          <!-- Mensaje de validación -->
                          <span class="form-hint text-danger" v-if="!form[field.key].validationSuccess">* Campo Obligatorio</span>
                        </div>
                      </div>

                      <!-- Mostrar componente personalizado para la imagen -->
                      <div v-else-if="field.component === 'image-preview' && (entity.image)"
                           class="image-preview-container">
                        <div class="rounded-sm">
                          <img :src=" getImagePreview(entity.image)"
                               alt="Vista previa del producto"
                               class="h-55 w-55 object-fill">
                          <button v-if="entity.image"
                                  @click="cleanupImagePreview"
                                  class="btn btn-sm btn-danger image-remove-btn">
                            Eliminar Imagen
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div class="grid grid-flow-col grid-col-3 gap-4 mt-2">
        <div class="row-span-3">
          <div class="card h-[500px] flex flex-col overflow-hidden">
            <div class="card-header">
              <h3 class="text-lg font-semibold mb-4 border-b pb-2 modal-title ">Aplicaciones</h3>
              <label class="switch switch-sm">
                <button class="btn btn-success" @click="openStoreModal()" :disabled="loading">
                  <i class="ki-filled ki-plus-squared"></i>
                  Agregar Aplicación

                </button>
              </label>
            </div>
            <div class="card-body flex-1 overflow-y-auto">
              <div class="scrollable-x-auto">
                <table id="#table_aplicacion" class="table table-hover table-auto " data-datatable-table="true">
                  <thead>
                  <tr>
                    <th class="w-[160px] text-center" data-datatable-column="status">
                              <span class="sort">
                                  <span class="sort-label"> Aplicación</span>
                                  <span class="sort-icon"></span>
                              </span>
                    </th>
                    <th class="w-[160px] text-center" data-datatable-column="status">
                              <span class="sort">
                                  <span class="sort-label">Marca</span>
                                  <span class="sort-icon"></span>
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
        </div>


        <div class="row-span-3 ...">
          <div id="table_equivalente">
            <div class="card h-[500px] flex flex-col overflow-hidden">
              <div class="card-header">
                <h3 class="text-lg font-semibold mb-4 border-b pb-2 modal-title ">Prod. Equivalentes</h3>
              </div>
              <div class="card-body flex-1 overflow-y-auto">
                <label class="switch switch-sm">
                  <select v-model="product_id_equivalent" name="products" class="select">
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.code }} {{ product.description }} {{ product.brand?.description }}
                    </option>
                  </select>


                  <button class="btn btn-success" @click="addEquivalente()" :disabled="loading">
                    <i class="ki-filled ki-plus-squared"></i>
                    Agregar Equivalente

                  </button>
                </label>
                <div id="">
                  <div class="scrollable-x-auto">
                    <table class="table table-auto table-border align-middle text-gray-700 font-medium text-sm"
                           data-datatable-table="true">
                      <thead>
                      <tr>
                        <th class="w-[160px] text-center" data-datatable-column="status">
                              <span class="sort">
                                  <span class="sort-label"> Equivalente</span>
                                  <span class="sort-icon"></span>
                              </span>
                        </th>
                        <th class="w-[160px] text-center" data-datatable-column="status">
                              <span class="sort">
                                  <span class="sort-label">Marca</span>
                                  <span class="sort-icon"></span>
                              </span>
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
        </div>


        <div class="row-span-3  ...">
          <div id="table_intercambio">

            <div class="card h-[500px] flex flex-col overflow-hidden">
              <div class="card-header">
                <h3 class="text-lg font-semibold mb-4 border-b pb-2 modal-title">Intercambios</h3>
                <button class="btn btn-success" @click="showIntercambioModal()" :disabled="loading">
                  <i class="ki-filled ki-plus-squared"></i> Agregar Intercambio
                </button>
              </div>

              <div class="card-body flex-1 overflow-y-auto">
                <div class="scrollable-x-auto">
                  <table class="table table-sm table-border align-middle text-gray-700 font-medium text-sm"
                         data-datatable-table="true">
                    <thead>
                    <tr>
                      <th class="w-[160px] text-center" data-datatable-column="code">
              <span class="sort">
                <span class="sort-label"> Intercambio</span>
                <span class="sort-icon"></span>
              </span>
                      </th>
                      <th class="w-[160px] text-center" data-datatable-column="reference">
              <span class="sort">
                <span class="sort-label">Referencia</span>
                <span class="sort-icon"></span>
              </span>
                      </th>
                      <th class="w-[60px]"></th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                  class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
                <div class="flex items-center gap-2">
                  Mostrar
                  <select class="select select-sm w-16" data-datatable-size="true" name="perpage"></select>
                  por Página
                </div>
                <div class="flex items-center gap-4">
                  <span data-datatable-info="true"></span>
                  <div class="pagination" data-datatable-pagination="true"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </template>
    <template #footer>
      <button class="btn btn-light" data-modal-dismiss="true">Cancelar</button>
      <button class="btn btn-primary" @click="save" :disabled="loading">
        {{ isEditing ? `Modificar ${moduleName}` : `Crear ${moduleName}` }}
      </button>
    </template>
  </LongModal>

</template>
<script src="./index.js"></script>
