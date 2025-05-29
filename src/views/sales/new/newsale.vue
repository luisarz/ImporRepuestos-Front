<template>
  <div class="grid gap-2 shadow-lg
              grid-cols-1 grid-rows-6
              sm:grid-flow-col sm:grid-rows-6 sm:grid-cols-12 min-h-[82vh]">

<!--    items cart-->
    <div class="order-1 sm:order-none row-span-1 sm:col-span-4 sm:row-span-4 border-red-300 shadow-lg">
      <div class="card card-grid min-w-full">
        <div class="card-header flex-wrap py-2">
          Productos en el carrito
        </div>

        <div class="card-body">

          <div data-datatable="true" data-datatable-page-size="10" id="items_cart_table" class="datatable-initialized">
            <div class="scrollable-y-auto max-h-[68vh]">

              <table class="table ki-tab-tablet " data-datatable-table="true">
                <thead>
                <tr>

                  <th class="min-w-[250px] text-center" data-datatable-column="inventory">

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

    </div>
<!--    /Items cart-->
<!--    footer cart-->
    <div class="order-3 sm:order-none row-span-1 sm:col-span-4 sm:row-span-2 shadow-lg">
      <select v-model="sale_header.customer_id"
              class="select select-sm w-full" id="customer_id"
              data-datatable-filter-column="sale_header.customer_id">
        <option value="">Seleccione un cliente</option>
        <option v-for="customer in customers" :key="customer.id" :value="customer.id">
          {{ customer.name }} {{ customer.last_name }}
        </option>
      </select>
      <select v-model="sale_header.seller_id"
              class="select select-sm w-full" id="seller_id"
              data-datatable-filter-column="sale_header.customer_id">
        <option value="">Seleccione un cliente</option>
        <option v-for="selller in sellers" :key="selller.id" :value="selller.id">
          {{ selller.name }}   {{ selller.last_name }}
        </option>
      </select>

    </div>
<!--    /footer cart-->
<!--    Productos disponibles-->
    <div class="order-2 sm:order-none row-span-4 sm:row-span-6 sm:col-span-8 shadow-lg">

      <div class="card card-grid min-w-full">
        <div class="card-header flex-wrap py-2">
          <div class="flex flex-row flex-wrap w-full">
            <div class="w-full md:w-4/12 p-2">
              <i class="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3">
              </i>
              <input class="input input-md pl-8 w-100 " data-datatable-search="#kt_remote_table"
                     placeholder="Buscar producto, descripción o código..."
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

            <div class="w-full md:w-1/12 p-2 ">

              <label class="switch switch-sm">
<!--                <button class="btn btn-success" @click="openStoreModal()" :disabled="loading">-->
<!--                  <i class="ki-filled ki-plus-squared"></i>-->
<!--                  {{ loading ? 'Preparando datos...' : 'Levantar ' }} {{ moduleName }}-->

<!--                </button>-->
              </label>
            </div>
          </div>
        </div>

        <div class="card-body">

          <div data-datatable="true" data-datatable-page-size="10" id="kt_remote_table" class="datatable-initialized">
            <div class="scrollable-y-auto max-h-[68vh]">

              <table class="table ki-tab-tablet " data-datatable-table="true">
                <thead>
                <tr>

                  <th class="min-w-[250px] text-center" data-datatable-column="inventory">

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
<!--  /Productos disponibles-->
  </div>
</template>
<script src="./index.js"></script>
