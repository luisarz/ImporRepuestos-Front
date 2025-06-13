<template>
  <!-- Opción para mostrar en iframe -->
  <iframe
      v-if="pdfUrl"
      :src="pdfUrl"
      width="100%"
      height="600"
      style="border: none; margin-top: 20px;"
  ></iframe>
  <div class="grid">

    <div class="card card-grid min-w-full">
      <div class="card-header flex-wrap py-2">
        <div class="flex flex-row flex-wrap w-full">
          <div class="w-full md:w-4/12 p-2">
            <i class="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3">
            </i>
            <input class="input input-md pl-8 w-100 " data-datatable-search="#kt_remote_table"
                   placeholder="Buscar Cliente, vendedor o # documento..."
                   id="search_description"
                   type="text">
          </div>
          <div class="w-full md:w-3/12 p-2">
            <i class="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3">
            </i>
            <input class="input input-md pl-8 w-100 " data-datatable-filter-column="product.code"
                   placeholder="Buscar por código Impor"
                   id="code"
                   type="text">
          </div>
          <!--          <div class="w-full md:w-3/12 p-2">-->
          <!--            <VueDatePicker-->
          <!--                v-model="date"-->
          <!--                range-->
          <!--                :enable-time-picker="false"-->
          <!--                :format="'dd/MM/yyyy'"-->
          <!--                :clearable="true"-->
          <!--                placeholder="Seleccione un rango de fechas"-->
          <!--            />-->
          <!--          </div>-->

          <div class="w-full md:w-2/12 p-2">
            <select class="select min-w-32" data-datatable-filter-column="warehouse_id">
              <option value="">Seleccionar sucursal</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </select></div>
          <div class="w-full md:w-1/12 p-2 ">

            <label class="switch switch-sm">
              <button class="btn btn-success" @click="newSale()" :disabled="loading">
                <i class="ki-filled ki-plus-squared"></i>
                {{ loading ? 'Preparando datos...' : 'Nueva Venta' }}

              </button>
            </label>
          </div>
        </div>
      </div>

      <div class="card-body">

        <div data-datatable="true" data-datatable-page-size="10" id="kt_remote_table" class="datatable-initialized">
          <div class="scrollable-y-auto">

            <table class="table table-border text-gray-700  text-sm" data-datatable-table="true">
              <thead>
              <tr>
                <th class="w-14">
                  <input class="checkbox checkbox-sm" data-datatable-check="true" type="checkbox"/>
                </th>
                <th class="min-w-[225px]">Acciones
                </th>

                <th class="min-w-[40px] text-center" data-datatable-column="sale_date">
                              <span class="sort">
                                  <span class="sort-label">Sucursal</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[80px] text-center" data-datatable-column="sale_date">
                              <span class="sort">
                                  <span class="sort-label">Fecha</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[80px] text-center" data-datatable-column="sale_date">
                              <span class="sort">
                                  <span class="sort-label">Tipo</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-min-[50px] text-center" data-datatable-column="origigal_code">
                              <span class="sort">
                                  <span class="sort-label">#</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>

                <th class="min-w-[75px] text-center" data-datatable-column="category">
                              <span class="sort">
                                  <span class="sort-label">DTE</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[50px] text-center" data-datatable-column="description_measurement_id">
                              <span class="sort">
                                  <span class="sort-label">Facturación</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Vendedor</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[150px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Cliente</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[100px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Condición</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Estado</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[150px] text-right" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Total</span>
                                  <span class="sort-icon"></span>
                              </span>
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

  <LongModal id="kt_modal_log_dte" :title="modalTitle">
    <template #body>

      <div data-datatable="true" data-datatable-page-size="10" id="table_logs" class="datatable-initialized">
        <div class="card  flex flex-col overflow-hidden mt-2">
          <div class="card-header">
            <h3 class="text-sm font-semibold mb-4 border-b pb-2 modal-title ">Bitacora procesos DTE</h3>

          </div>
          <div class="card-body flex-1 overflow-y-auto">
            <div id="">

              <div class="scrollable-x-auto">
                <table class="table table-hover table-auto " data-datatable-table="true">
                  <thead>
                  <tr>

                    <th class="max-w-[100]" data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Ambiente</span>
                                          <span class="sort-icon"></span>
                                      </span>
                    </th>
                    <!--                    <th class="w-[160px] " data-datatable-column="status">-->
                    <!--                                      <span class="sort">-->
                    <!--                                          <span class="sort-label">Version App</span>-->
                    <!--                                          <span class="sort-icon"></span>-->
                    <!--                                      </span>-->
                    <!--                    </th>-->
                    <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Estado</span>
                                          <span class="sort-icon"></span>
                                      </span>
                    </th>
                    <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Código Generación</span>
                                          <span class="sort-icon"></span>
                                      </span>
                    </th>
                    <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Sello Recibido</span>
                                          <span class="sort-icon"></span>
                                      </span>
                    </th>
                    <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Fecha Procesamiento</span>
                                          <span class="sort-icon"></span>
                                      </span>
                    </th>
<!--                    <th class="w-[160px] " data-datatable-column="status">-->
<!--                                      <span class="sort">-->
<!--                                          <span class="sort-label">Clasifica Mensaje</span>-->
<!--                                          <span class="sort-icon"></span>-->
<!--                                      </span>-->
<!--                    </th>-->
<!--                    <th class="w-[160px] " data-datatable-column="status">-->
<!--                                      <span class="sort">-->
<!--                                          <span class="sort-label">Código Mensaje</span>-->
<!--                                          <span class="sort-icon"></span>-->
<!--                                      </span>-->
<!--                    </th>-->
                    <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Descripción Mensaje</span>
                                          <span class="sort-icon"></span>
                                      </span>
                    </th>
                    <th class="w-[160px] " data-datatable-column="status">
                                      <span class="sort">
                                          <span class="sort-label">Observaciones</span>
                                          <span class="sort-icon"></span>
                                      </span>
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
    </template>
  </LongModal>
</template>
<script src="./index.js"></script>
