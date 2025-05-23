<template>
  <div class="grid">

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
        <div class="relative  min-w-[450px]">
          <i class="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3">
          </i>
          <input class="kt-input" data-datatable-search="#kt_remote_table"
                 placeholder="Buscar código"
                 id="search_code"
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

        <div data-datatable="true" data-datatable-page-size="10" id="kt_remote_table" class="datatable-initialized">
          <div class="scrollable-y-auto">

            <table class="table table-border text-gray-700 font-medium text-sm" data-datatable-table="true">
              <thead>
              <tr>
                <th class="w-14">
                  <input class="checkbox checkbox-sm" data-datatable-check="true" type="checkbox"/>
                </th>
                <th class="min-w-[180px] text-center" data-datatable-column="inventory">
                              <span class="sort">
                                  <span class="sort-label">Inventario</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[110px] text-center" data-datatable-column="barcode">
                              <span class="sort">
                                  <span class="sort-label">Cod Barras</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-min-[150px] text-center" data-datatable-column="origigal_code">
                              <span class="sort">
                                  <span class="sort-label">Cod Original</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>

                <th class="w-[100px] text-center" data-datatable-column="category">
                              <span class="sort">
                                  <span class="sort-label">Categoria</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[100px] text-center" data-datatable-column="description_measurement_id">
                              <span class="sort">
                                  <span class="sort-label">Medida</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[100px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Stock</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">PV</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Ultima Compra</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>


                <th class="w-[160px]">
                </th>



              </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
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
  </div>

  <MediumModal id="modal_store" :title="modalTitle">
    <template #body>
      <input type="hidden" name="id" v-model="entity.id"/>
      <div class="card">
        <div class="card-body">
          <div class="grid grid-cols-3 gap-2">


            <!-- Campos del formulario -->
            <div v-for="(group, groupIndex) in formFields()" :key="groupIndex"
                 :class="[ group.group === 'Configuraciones' ? 'col-span-3 gap-15' : 'col-span-3 gap-3',]">
              <!-- Título del grupo -->
              <h3 class="text-lg font-semibold mb-2 border-b pb-1 modal-title ">{{ group.group }}</h3>

              <!-- Campos del grupo -->
              <div class="grid gap-2"
                   :class="group.group === 'Configuraciones'
                           ? 'grid grid-cols-2 gap-2 sm:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2'
                           : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'">
                <div class="w-full" v-for="field in group.fields" :key="field.key">
                  <div class="flex items-baseline flex-wrap lg:flex-nowrap">
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


                          <v-select
                              v-else-if="field.type === 'select'"
                              v-model="entity[field.key]"
                              :options="field.options"
                              transition="fade"
                              label="text"
                              :placeholder="`Buscar ${field.placeholder}`"
                              :reduce="option => option.value"
                          />


                          <!-- Select -->
                          <!--                          <select-->
                          <!--                              v-else-if="field.type === 'select'"-->
                          <!--                              class="select"-->
                          <!--                              data-control="select2"-->
                          <!--                              v-model="entity[field.key]"-->
                          <!--                              @change="validationForm"-->
                          <!--                          >-->

                          <!--                            <option v-for="option in field.options" :key="option.value" :value="option.value">-->
                          <!--                              {{ option.text }}-->
                          <!--                            </option>-->
                          <!--                          </select>-->

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
                          <span class="form-hint text-danger" v-if="!form[field.key].validationSuccess">*El  Campo <b> {{
                              field.label
                            }}</b> es obligatorio</span>
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
        <div data-datatable="true" data-datatable-page-size="10" id="table_prices" class="datatable-initialized">
      <div class="card h-[400px] flex flex-col overflow-hidden mt-2">
        <div class="card-header">
          <h3 class="text-sm font-semibold mb-4 border-b pb-2 modal-title ">Precios de Venta</h3>
          <label class="switch switch-sm">
            <button class="btn btn-success btn-sm" @click="openPriceStore(null)" :disabled="loading">
              <i class="ki-filled ki-plus-squared"></i>
              Agregar precio

            </button>
          </label>
        </div>
        <div class="card-body flex-1 overflow-y-auto">
          <div id="">

            <div class="scrollable-x-auto">
              <table class="table table-hover table-auto " data-datatable-table="true">
                <thead>
                <tr>
                  <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label"> Descripcion</span>
                                          <span class="sort-icon"></span>
                                      </span>
                  </th>
                  <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Precio</span>
                                          <span class="sort-icon"></span>
                                      </span>
                  </th>
                  <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Utilidad</span>
                                          <span class="sort-icon"></span>
                                      </span>
                  </th>
                  <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Predeterminado</span>
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


    </template>
    <template #footer>
      <button class="btn btn-light" data-modal-dismiss="true">Cancelar</button>
      <button class="btn btn-primary" @click="save" :disabled="loading">
        {{ isEditing ? `Modificar ${moduleName}` : `Crear ${moduleName}` }}
      </button>
    </template>
  </MediumModal>

</template>
<script src="./index.js"></script>
