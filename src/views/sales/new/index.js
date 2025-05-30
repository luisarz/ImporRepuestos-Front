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
import EmployeeService from "@/services/employeeService.js";
import CustomerServices from "@/services/customerService.js";
import MediumModal from "@/components/MediumModal.vue";
import SaleHeader from "@/services/saleService.js";
import SaleItemService from "@/services/saleItemService.js";
import InventoryService from "@/services/inventoryService.js";
// @ts-ignore
// @ts-ignore
export default {
    components: {MediumModal, LongModal, GeneralModal, QuestionModal},
    data() {
        return {
            loading: false,
            warehouses: [],
            customers: [],
            sellers: [],
            documentTypes: [],
            operationConditions: [],
            paymentMethods: [],


            sale_header: {
                id: 0,
                cashbox_open_id: 0,
                sale_date: new Date().toISOString().slice(0, 10),
                document_type_id: 0,
                warehouse_id: 0,
                document_internal_number: '',
                seller_id: 0,
                customer_id: 0,
                operation_condition_id: 0,
                sale_status: 'PENDING',
                net_amount: 0,
                tax: 0,
                discount: 0,
                have_retention: false,
                retention: 0,
                sale_total: 0,
                payment_method_id: 0,
                payment_status: 'PENDING',
                is_order: false,
                is_order_closed_without_invoiced: false,
                is_invoiced_order: false,
                discount_percentage: 0,
                discount_money: 0,
                total_order_after_discount: 0,
                billing_model: 0,
                transmision_type: 0,
                is_dte: 0,
                is_dte_send: 0,
                is_active: 1,
            },

            sale_items: {
                id: 0,
                sale_id: 0,
                inventory_id: 0,
                batch_id: 0,
                saled: false,
                quantity: 0,
                price: 0,
                discount: 0,
                total: 0,
                is_saled: false,
                is_active: false,
            },

        };
    },

    methods: {

        async loadOptions() {
            try {

                const [warehouses,
                    customers,
                    sellers,
                    // documentTypes,
                    // operationConditions,
                    // paymentMethods
                ] = await
                    Promise.all(
                        [
                            WarehouseService.get(),
                            CustomerServices.get(),
                            EmployeeService.get(),
                            // DocumentTypeService.get(),
                            // OperationConditionService.get(),
                            // PaymentMethodService.get()
                        ]);
                this.warehouses = warehouses.data || [];
                this.customers = customers.data || [];

                this.sellers = sellers.data || [];
                // this.documentTypes = documentTypes.data || [];
                // this.operationConditions = operationConditions.data || [];
                // this.paymentMethods = paymentMethods.data || [];


            } catch (error) {
                this.warehouses = [];
                this.customers = [];
                this.sellers = [];
                this.documentTypes = [];
                this.operationConditions = [];
                this.paymentMethods = [];
                // Manejo de errores
                console.error('Error al cargar las opciones:', error);
            }
        },

        async addItemSale(inventoryId) {
            let priceItem = document.getElementById(`price-selected-${inventoryId}`);
            let price = priceItem ? Number(priceItem.value) : 0;





            if (price === 0) {
                const result = await Swal.fire({
                    title: 'Error',
                    text: 'Estás intentando agregar un producto sin precio. ¿Deseas continuar de todas formas?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-secondary'
                    },
                    buttonsStyling: false
                });

                if (!result.isConfirmed) {
                    return; // Usuario canceló
                }
                price = 0; // Confirmó continuar con precio 0
            }

            const cantidadResult = await Swal.fire({
                title: 'Cantidad a vender',
                html: `
        <input id="cantidad" type="number" min="1" step="1" class="swal2-input" placeholder="Cantidad a vender" value="1">
    `,
                showCancelButton: true,
                confirmButtonText: 'Agregar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary',
                    input: 'swal2-input'
                },
                focusConfirm: false, // desactiva el foco automático en el botón
                didOpen: () => {
                    const input = document.getElementById('cantidad');
                    input.focus();
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            Swal.clickConfirm(); // simula clic en "Agregar"
                        }
                    });
                },
                preConfirm: () => {
                    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
                    if (isNaN(cantidad) || cantidad <= 0) {
                        Swal.showValidationMessage('Ingrese una cantidad válida (entero mayor a 0)');
                        return false;
                    }
                    return cantidad;
                }
            });


            // Cancelado
            if (!cantidadResult.isConfirmed) return;

            const quantitySell = cantidadResult.value;


            let message = "";
            try {
                // 1. Crear venta si aún no existe
                try {
                    if (!this.sale_header.id) {
                        const id_warehouse = localStorage.getItem("warehouse_id");
                        this.sale_header.warehouse_id = id_warehouse ? Number(id_warehouse) : 0;
                        this.sale_header.is_dte = false;
                        this.sale_header.document_type_id = 1;
                        this.sale_header.is_dte_send = false;
                        this.sale_header.sale_status = 1;
                        const response = await SaleHeader.store(this.sale_header);
                        this.sale_header.id = response.data.id;
                        message += response.data.message;
                    }
                } catch (error) {
                    console.error('Error al crear la venta:', error);
                    return;
                }

                try {
                    // 2. Crear el ítem de venta
                    this.sale_items.sale_id = this.sale_header.id;
                    this.sale_items.inventory_id = inventoryId; // Aquí deberías asignar el ID del inventario correspondiente
                    this.sale_items.batch_id = 1; // Aquí deberías asignar el ID del lote correspondiente
                    this.sale_items.quantity = quantitySell; // Cantidad por defecto
                    this.sale_items.price = price; // Asignar el primer precio del producto
                    this.sale_items.discount = 0; // Descuento por defecto
                    this.sale_items.total = this.sale_items.quantity * this.sale_items.price; // Calcular el total
                    this.sale_items.is_saled = false; // Marcar como no vendido
                    this.sale_items.is_active = true; // Marcar como activo
                    await SaleItemService.store(this.sale_items);
                    await Swal.fire({
                        text: "Prodúcto agregado a la venta correctamente",
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                    });
                    this.loadSaleItems(this.sale_header.id);

                } catch (error) {
                    console.error('Error al agregar el ítem a la venta:', error);
                }

            } catch (error) {
                await Swal.fire({
                    title: 'Error',
                    icon: 'error',
                });
            }
        },


        loadSaleItems(saleId) {
            const tableElementInterchange = document.querySelector("#items_cart_table");
            try {
                const options = {
                    type: 'remote',
                    apiEndpoint: `${urlApi}/v1/sale-details/${saleId}`,//InterchangesService.getInterchangeByProduct(idProduct),
                    requestHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    columns: {
                        action: {
                            render: (data, type, rowdata) => {
                                return `  <div class="flex items-center">
                                          <button class="btn btn-sm btn-outline btn-danger btn-light ms-2 shrink-0" onclick="removeItem(${type.id})">
                                            <i class="ki-filled ki-handcart"></i>
                                          </button>
                                        </div>
                                        `;

                            }

                        },
                        product: {
                            title: 'Producto',
                            render: function (data, type, row) {
                                return `${type?.inventory?.product?.description}`;
                            },
                            createdCell(cell) {
                                cell.classList.add('font-normal');
                            }
                        },
                        quantity: {
                            title: 'Quantity',
                        },
                        formatted_price: {
                            title: 'Price',
                        },
                        discount: {},
                        formatted_total: {
                            title: 'Total',

                            cellCreated(cell) {
                                cell.classList.add('text-end');
                            }
                        },

                    },
                    layout: {scroll: true},
                    sortable: true,
                    search: {
                        input: document.getElementById('kt_datatable_search_query'), // Elemento input para búsqueda
                        key: 'search', // Parámetro que se enviará al servidor
                        delay: 400, // Retraso en milisegundos después de escribir para realizar la búsqueda
                    },
                };

                if (this.dataTableInterChanges) {
                    this.dataTableInterChanges.reload(options);
                    console.log('Reload equivalents data');
                } else {
                    this.dataTableInterChanges = new KTDataTable(tableElementInterchange, options);
                    console.log('Initialize intercambios data');
                }

            } catch (error) {
                console.error("Error loading intercambios:", error);
            }
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
                apiEndpoint: InventoryService.getUrl(),//`${urlApi}/v1/inventories`,
                requestHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                columns: {
                    product: {
                        title: 'Producto',
                        data: 'product.name',
                        render: function (data, type, row) {
                            const code = type?.product?.description ?? 'S/N';
                            const prices_sale = type?.prices || [];
                            const inventoryId = type?.id

                            // Buscar el precio por defecto
                            const typePrice = prices_sale.find(price => Number(price.is_default) === 1);

                            // Generar las opciones si hay precios
                            const price_sale = prices_sale.length
                                ? prices_sale.map(price => `
                          <option value="${price.price}" ${Number(price.is_default) === 1 ? 'selected' : ''}>
                            $ ${Number(price.price).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })} ${price.price_description}
                          </option>
                        `).join('')
                                : `<option value="" disabled selected>Sin precio</option>`;


                            const inventory =
                                `<div class="card hover:shadow-lg">
                                      <div class="card-content flex items-center flex-wrap justify-between p-1 pe-1 gap-1">
                                       <div class="flex items-center ">
                                        <div class="kt-card flex items-center justify-center bg-accent/50 h-[70px] w-[90px] shadow-none">
                                         <img alt="img" class="h-[70px] cursor-pointer" loading="lazy" data-kt-drawer-toggle="#drawers_shop_product_details" src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/store/client/600x600/11.png">
                                        </div>
                                        <div class="flex flex-col gap-1">
                                         <div class="flex items-center  -mt-1">
                                          <a class="hover:text-primary text-sm font-medium text-mono leading-5.5" data-kt-drawer-toggle="#drawers_shop_product_details" href="#">
                                          ${type.product.description ?? 'S/N'} ${inventoryId ?? 'S/N'}
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
                                       <select class="select w-[150px]" id="price-selected-${type.id}"">
                                            ${price_sale} 
                                         </select>
                                        
                                       <button 
                                          class="btn btn-outline btn-success btn-light ms-2 shrink-0"  
                                          onclick="addItemSale(${inventoryId})">
                                          <i class="ki-filled ki-handcart"></i> Agregar a venta
                                        </button>


                                       </div>
                                      </div>
                                     </div>`;
                            return inventory;
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
        window.addItemSale = this.addItemSale.bind(this);
        this.loadOptions();
        this.loadInventory();
        // this.loadSales();
        // window.editModal = this.editModal.bind(this);
    }
    ,
}
;