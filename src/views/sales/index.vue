<template>
  <div class="grid">

    <div class="card card-grid min-w-full">
      <div class="card-header flex-wrap py-2">
        <div class="relative  min-w-[450px]">
          <i class="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3">
          </i>
          <input class="input input-md pl-8 w-100 " data-datatable-search="#kt_remote_table"
                 placeholder="Buscar inventarios"
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
                                  <span class="sort-label">Fecha</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="min-w-[110px] text-center" data-datatable-column="barcode">
                              <span class="sort">
                                  <span class="sort-label">Tipo</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-min-[150px] text-center" data-datatable-column="origigal_code">
                              <span class="sort">
                                  <span class="sort-label">#</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>

                <th class="w-[100px] text-center" data-datatable-column="category">
                              <span class="sort">
                                  <span class="sort-label">DTE</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[100px] text-center" data-datatable-column="description_measurement_id">
                              <span class="sort">
                                  <span class="sort-label">Facturación</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[100px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Vendedor</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Cliente</span>
                                  <span class="sort-icon"></span>
                              </span>
                </th>
                <th class="w-[120px] text-center" data-datatable-column="brand">
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
                <th class="w-[120px] text-center" data-datatable-column="brand">
                              <span class="sort">
                                  <span class="sort-label">Total</span>
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


</template>
<script src="./index.js"></script>
