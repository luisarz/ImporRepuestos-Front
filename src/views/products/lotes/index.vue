<template>
  <div class="grid">

    <div class="card card-grid min-w-full">
      <div class="card-header flex-wrap py-2">
        <div class="relative  min-w-[450px]">
          <i class="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3">
          </i>
          <input class="input input-md pl-8 w-100 " data-datatable-search="#kt_remote_table"
                 placeholder="Buscar lotes..."
                 id="search_description"
                 type="text">
        </div>


        <div class="flex gap-6">


<!--          <label class="switch switch-sm">-->
<!--            <button class="btn btn-success" @click="openStoreModal()" :disabled="loading">-->
<!--              <i class="ki-filled ki-plus-squared"></i>-->
<!--              {{ loading ? 'Preparando datos...' : 'Crear ' }} {{ moduleName }}-->

<!--            </button>-->
<!--          </label>-->
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
                <th class="min-w-[150px] text-center" data-datatable-column="inventory">
                              <span class="sort">
                                  <span class="sort-label">Inventario</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[50px] text-center" data-datatable-column="barcode">
                              <span class="sort">
                                  <span class="sort-label">Lote</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[50px] text-center" data-datatable-column="origigal_code">
                              <span class="sort">
                                  <span class="sort-label">Codigo</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>

                <th class="min-w-[50px] text-center" data-datatable-column="category">
                              <span class="sort">
                                  <span class="sort-label">Ingreso</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[50px] text-center" data-datatable-column="description_measurement_id">
                              <span class="sort">
                                  <span class="sort-label">Disponible</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>


                <th class="min-w-[150px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Observación</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">F. ingreso</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">F. vencimiento</span>
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
