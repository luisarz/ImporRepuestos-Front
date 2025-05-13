<div class="card">
    <div class="card-header">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2 modal-title ">Prod. Equivalentes</h3>
    </div>
    <div class="card-body">
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
        <div id="table_equivalente">
            <div class="scrollable-x-auto">
                <table class="table table-hover " data-datatable-table="true">
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
                        <th class="w-[60px]">
                        </th>


                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
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
