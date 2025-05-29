import {KTDataTable, KTModal} from '../../../metronic/core/index.js';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '@/components/QuestionModal.vue';
import LongModal from "@/components/LongModal.vue";
import ProductsService from "@/services/productsService.js";
import CategoryService from "@/services/categoryService.js";
import BrandService from "@/services/brandService.js";
import UnitMeasurementService from "@/services/hacienda/unitMeasurementService.js";
import {urlApi, VUE_APP_STORAGE_URL} from "@/services/config.js";
import EquivalentService from "@/services/equivalentService.js";
import Swal from 'sweetalert2';
import WarehouseService from "@/services/warehouseService.js";
import Inventory from "@/services/inventoryService.js";
import ProviderService from "@/services/providers/providerService.js";
import MediumModal from "@/components/MediumModal.vue";
import PricesService from "@/services/pricesService.js";
import SaleHeader from "@/services/saleService.js";
// @ts-ignore
// @ts-ignore
export default {
    components: {MediumModal, LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            warehouses: [],

            sale: {
                id: 0,
                warehouse_id: 0,
                product_id: 0,
                provider_id: 0,
                last_cost_without_tax: 0,
                last_cost_with_tax: 0,
                stock_actual_quantity: 0,
                stock_min: 0,
                alert_stock_min: 0,
                stock_max: 0,
                alert_stock_max: 0,
                last_purchase: null,
                is_active: false,

            },

        };
    },

    methods: {

        newSale() {
            this.$router.push({name: 'sale-new'});
        },

        async loadWarehouse() {
            try {
                const response = await WarehouseService.get();
                this.warehouses = response.data || [];
            } catch (error) {
                console.error('Error al cargar las sucursales:', error);
                this.warehouses = [];
            }
        },


        loadInventory() {
            const tablePriceElement = document.querySelector("#kt_remote_table");
            const options = {
                apiEndpoint: `${urlApi}/v1/inventories`,
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    product: {
                        title: 'Producto',
                        data: 'product.name',
                        render: function (data, type, row) {
                            const code = type?.product?.description ?? 'S/N';
                            const inventory =
                                `<div class="card">
          <div class="card-content flex items-center flex-wrap justify-between p-1 pe-1 gap-1">
           <div class="flex items-center ">
            <div class="kt-card flex items-center justify-center bg-accent/50 h-[70px] w-[90px] shadow-none">
             <img alt="img" class="h-[70px] cursor-pointer" loading="lazy" data-kt-drawer-toggle="#drawers_shop_product_details" src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/store/client/600x600/11.png">
            </div>
            <div class="flex flex-col gap-1">
             <div class="flex items-center  -mt-1">
              <a class="hover:text-primary text-sm font-medium text-mono leading-5.5" data-kt-drawer-toggle="#drawers_shop_product_details" href="#">
              ${type.product.description ?? 'S/N'}
              </a>
             </div>
             <div class="flex items-center flex-wrap">

              <div class="flex items-center flex-wrap gap-2 lg:gap-4">
               <span class="text-xs font-normal text-secondary-foreground uppercase">
                SKU:
                <span class="text-xs font-medium text-foreground">
                 ${type?.product.code ?? 'S/N'}
                </span>
               </span>
               <span class="text-xs font-normal text-secondary-foreground">
                Category:
                <span class="text-xs font-medium text-foreground">
                 ${type?.product?.category?.description ?? 'S/N'}
                </span>
               </span>
               <span class="text-xs font-normal text-secondary-foreground">
                Medida:
                <span class="text-xs font-medium text-foreground">
                ${type?.product?.description_measurement_id ?? 'S/N'}
                </span>
               </span>
              </div>
             </div>
            </div>
           </div>
           <div class="flex items-center gap-1">
            <span class="text-xs font-normal text-secondary-foreground line-through">
            </span>
            <span class="text-sm font-medium text-mono">
            $ ${type?.default_price}
            </span>
            
            <button class="btn btn-outline btn-success btn-light ms-2 shrink-0" data-kt-drawer-toggle="#drawers_shop_product_details">
             <i class="ki-filled ki-handcart">
             </i>
             Agrear a venta
            </button>
           </div>
          </div>
         </div>`;
                            return inventory;
                        },
                        createdCell: function (cell, data, row) {
                            // cell.classList.add('font-normal', 'text-gray-900');
                        }
                    },

                },


                layout: {scroll: true},
                sortable: true,
                stateSave: true,

                search: {
                    input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                    key: 'search', // Parámetro que se enviará al servidor
                    delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                },
            };
            const dataTable = new KTDataTable(tablePriceElement, options);
            dataTable.showSpinner();


        },


    }
    ,

    mounted() {
        this.loadInventory();
        // this.loadSales();
        // window.editModal = this.editModal.bind(this);
    }
    ,
}
;