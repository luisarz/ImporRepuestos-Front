<template>
  <!-- Begin::POS System -->
  <div class="kt-portlet">
    <div class="kt-portlet__head">
      <div class="kt-portlet__head-label">
        <h3 class="kt-portlet__head-title">
          <i class="flaticon2-shopping-cart-1 kt-font-success"></i> Punto de Venta
        </h3>
      </div>
    </div>

    <div class="kt-portlet__body">
      <div class="row">
        <!-- Product List Column -->
        <div class="col-md-7">
          <div class="kt-portlet kt-portlet--height-fluid">
            <div class="kt-portlet__head">
              <div class="kt-portlet__head-label">
                <h3 class="kt-portlet__head-title">
                  Lista de Productos
                </h3>
              </div>
              <div class="kt-portlet__head-toolbar">
                <div class="kt-input-icon kt-input-icon--left">
                  <input
                      type="text"
                      class="form-control"
                      placeholder="Buscar producto..."
                      v-model="searchQuery"
                      @input="filterProducts"
                  >
                  <span class="kt-input-icon__icon kt-input-icon__icon--left">
                    <span><i class="la la-search"></i></span>
                  </span>
                </div>
              </div>
            </div>

            <div class="kt-portlet__body kt-portlet__body--fit">
              <div class="row">
                <!-- Product Item -->
                <div
                    class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                    v-for="product in filteredProducts"
                    :key="product.id"
                >
                  <div class="kt-portlet kt-portlet--product">
                    <div
                        class="kt-portlet__head"
                        :style="{ backgroundImage: `url(${product.image})` }"
                    >
                      <div class="kt-portlet__head-label">
                        <span class="kt-badge kt-badge--warning">${{ product.price.toFixed(2) }}</span>
                      </div>
                    </div>
                    <div class="kt-portlet__body">
                      <h4 class="kt-portlet__body-title">{{ product.name }}</h4>
                      <p class="kt-portlet__body-desc">{{ product.description }}</p>
                    </div>
                    <div class="kt-portlet__foot">
                      <button
                          class="btn btn-sm btn-brand btn-block btn-upper"
                          @click="addToCart(product)"
                      >
                        <i class="la la-cart-plus"></i> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Column -->
        <div class="col-md-5">
          <div class="kt-portlet kt-portlet--invoice">
            <div class="kt-portlet__head">
              <div class="kt-portlet__head-label">
                <h3 class="kt-portlet__head-title">
                  Factura #{{ invoiceNumber }}
                </h3>
              </div>
              <div class="kt-portlet__head-toolbar">
                <div class="dropdown dropdown-inline">
                  <button type="button" class="btn btn-sm btn-clean btn-icon" data-toggle="dropdown">
                    <i class="la la-ellipsis-h"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" href="#" @click.prevent="printInvoice">
                      <i class="la la-print"></i> Imprimir
                    </a>
                    <a class="dropdown-item" href="#" @click.prevent="exportToPDF">
                      <i class="la la-file-pdf"></i> Exportar PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="kt-portlet__body">
              <!-- Customer Info -->
              <div class="kt-form kt-form--label-right">
                <div class="form-group row">
                  <label class="col-form-label col-lg-3">Cliente:</label>
                  <div class="col-lg-9">
                    <select
                        class="form-control form-control-sm"
                        v-model="selectedCustomer"
                    >
                      <option
                          v-for="customer in customers"
                          :key="customer.id"
                          :value="customer.id"
                      >
                        {{ customer.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Invoice Items -->
              <div class="table-responsive">
                <table class="table table-sm table-hover">
                  <thead class="thead-light">
                  <tr>
                    <th>Producto</th>
                    <th width="80">Cant.</th>
                    <th width="100">Precio</th>
                    <th width="100">Total</th>
                    <th width="40"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-if="cartItems.length > 0">
                    <tr v-for="item in cartItems" :key="item.id">
                      <td>{{ item.name }}</td>
                      <td>
                        <input
                            type="number"
                            class="form-control form-control-sm"
                            v-model.number="item.quantity"
                            min="1"
                            @change="updateCartItem(item)"
                        >
                      </td>
                      <td>${{ item.price.toFixed(2) }}</td>
                      <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
                      <td>
                        <button
                            class="btn btn-sm btn-icon btn-clean"
                            @click="removeFromCart(item.id)"
                        >
                          <i class="la la-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </template>
                  <tr v-else class="empty-row">
                    <td colspan="5" class="text-center text-muted">No hay productos agregados</td>
                  </tr>
                  </tbody>
                  <tfoot>
                  <tr>
                    <td colspan="3" class="text-right kt-font-bold">Subtotal:</td>
                    <td class="kt-font-bold">${{ subtotal.toFixed(2) }}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-right kt-font-bold">IVA (12%):</td>
                    <td class="kt-font-bold">${{ tax.toFixed(2) }}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-right kt-font-boldest kt-font-success">TOTAL:</td>
                    <td class="kt-font-boldest kt-font-success">${{ total.toFixed(2) }}</td>
                    <td></td>
                  </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div class="kt-portlet__foot">
              <div class="row align-items-center">
                <div class="col-lg-6">
                  <div class="input-group">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Código de descuento"
                        v-model="discountCode"
                    >
                    <div class="input-group-append">
                      <button
                          class="btn btn-brand"
                          type="button"
                          @click="applyDiscount"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 kt-align-right">
                  <button
                      class="btn btn-success btn-bold btn-upper"
                      :disabled="cartItems.length === 0"
                      @click="completeSale"
                  >
                    <i class="la la-check-circle"></i> Completar Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export default defineComponent({
  name: 'PointOfSale',
  setup() {
    // Datos de productos
    const products = ref<Product[]>([
      {
        id: 1,
        name: 'Laptop HP EliteBook',
        description: 'Core i7, 16GB RAM',
        price: 12.99,
        image: 'assets/media/products/product1.jpg',
        category: 'Tecnología'
      }

    ]);

    // Datos de clientes
    const customers = ref<Customer[]>([
      { id: 3, name: 'María García', email: 'maria@example.com', phone: '555-5678' }
    ]);

    // Estado del componente
    const searchQuery = ref('');
    const filteredProducts = ref<Product[]>([]);
    const selectedCustomer = ref(1);
    const cartItems = ref<CartItem[]>([]);
    const discountCode = ref('');
    const discountApplied = ref(false);
    const discountPercentage = ref(0);
    const invoiceNumber = ref('001-001');

    // Computed properties
    const subtotal = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });

    const tax = computed(() => {
      return subtotal.value * 0.12;
    });

    const total = computed(() => {
      return subtotal.value + tax.value - (subtotal.value * discountPercentage.value / 100);
    });

    // Métodos
    const filterProducts = () => {
      if (!searchQuery.value) {
        filteredProducts.value = products.value;
        return;
      }

      const query = searchQuery.value.toLowerCase();
      filteredProducts.value = products.value.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    };

    const addToCart = (product: Product) => {
      const existingItem = cartItems.value.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.value.push({
          ...product,
          quantity: 1
        });
      }
    };

    const removeFromCart = (productId: number) => {
      cartItems.value = cartItems.value.filter(item => item.id !== productId);
    };

    const updateCartItem = (item: CartItem) => {
      if (item.quantity < 1) {
        item.quantity = 1;
      }
    };

    const applyDiscount = () => {
      // Lógica para validar códigos de descuento
      if (discountCode.value === 'DESCUENTO10') {
        discountPercentage.value = 10;
        discountApplied.value = true;
      } else if (discountCode.value === 'DESCUENTO20') {
        discountPercentage.value = 20;
        discountApplied.value = true;
      } else {
        discountPercentage.value = 0;
        discountApplied.value = false;
      }
    };

    const completeSale = () => {
      // Lógica para completar la venta
      console.log('Venta completada:', {
        customer: selectedCustomer.value,
        items: cartItems.value,
        subtotal: subtotal.value,
        tax: tax.value,
        discount: discountPercentage.value,
        total: total.value
      });

      // Generar nuevo número de factura
      const [prefix, number] = invoiceNumber.value.split('-');
      const newNumber = parseInt(number) + 1;
      invoiceNumber.value = `${prefix}-${newNumber.toString().padStart(3, '0')}`;

      // Resetear carrito
      cartItems.value = [];
      discountCode.value = '';
      discountPercentage.value = 0;
      discountApplied.value = false;
    };

    const printInvoice = () => {
      window.print();
    };

    const exportToPDF = () => {
      // Lógica para exportar a PDF
      console.log('Exportando a PDF...');
    };

    // Inicialización
    onMounted(() => {
      filteredProducts.value = products.value;
    });

    return {
      products,
      customers,
      searchQuery,
      filteredProducts,
      selectedCustomer,
      cartItems,
      discountCode,
      invoiceNumber,
      subtotal,
      tax,
      total,
      filterProducts,
      addToCart,
      removeFromCart,
      updateCartItem,
      applyDiscount,
      completeSale,
      printInvoice,
      exportToPDF
    };
  }
});
</script>

<style scoped>
/* Estilos específicos del componente */
.kt-portlet--product .kt-portlet__head {
  height: 150px;
  background-size: cover;
  background-position: center;
}

.empty-row td {
  padding: 20px 0;
}

input[type="number"] {
  width: 60px;
  text-align: center;
}
</style>