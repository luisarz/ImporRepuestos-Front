import {createRouter, createWebHistory} from 'vue-router';
import Home from '@/views/Home.vue';
import Category from '@/views/category/index.vue';
import MainLayout from '@/views/layouts/MainLayout.vue';
import SignIn from '@/views/authentication/SignIn.vue';
import NotFound from '@/views/layouts/404.vue';
import Module from '@/views/module/index.vue';
import Company from '@/views/company/index.vue';
import Warehouse from "@/views/warehouse/index.vue";
import JobTitle from "@/views/jobtitle/index.vue";
import Brand from "@/views/brand/index.vue";
import UnitMeasurement from "@/views/catalogs/unit_measurements/index.vue";
import DestinationEnviroment from "@/views/catalogs/destinationEnviroment/index.vue";
import ProviderType from "@/views/providers/provider_types/index.vue";
import ProviderDocumentType from "@/views/providers/document_types/index.vue";
import EconomicActivity from "@/views/catalogs/economicActivity/index.vue";
import Rol from "@/views/setting/rol/index.vue";
import Country from "@/views/catalogs/countries/index.vue";
import Provider from "@/views/providers/provider/index.vue"
import Products from "@/views/products/products/index.vue";
import PlateType from "@/views/parque_vehicular/plate_types/index.vue";
import VehicleModel from "@/views/parque_vehicular/vehicles_models/index.vue";
import FuelType from "@/views/parque_vehicular/fuel_types/index.vue";
import Vehicles from "@/views/parque_vehicular/vehicles/index.vue";
import Equivalents from "@/views/products/equivalents/index.vue";
import Interchanges from "@/views/products/interchanges/index.vue";
import Inventory from "@/views/products/inventory/index.vue";
import SaleHeader from "@/views/sales/list/index.vue";
import Lotes from "@/views/products/lotes/index.vue";
import SaleNew from "@/views/sales/new/newsale.vue";
import SaleEdit from "@/views/sales/edit/editSale.vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        history: createWebHistory(),
        children: [
            {
                path: '',
                component: Home,
                meta: {requiresAuth: true}  // Esta ruta requiere autenticación
            },
            {
                path: '/category',
                component: Category,
                meta: {requiresAuth: true}  // Esta ruta requiere autenticación
            },
            {
                path: '/module',
                component: Module,
                meta: {requiresAuth: true}  // Esta ruta requiere autenticación
            },
            {
                path: '/company',
                component: Company,
                meta: {requiresAuth: true}  // Esta ruta requiere autenticación
            },
            {
                path: '/warehouse',
                component: Warehouse,
                meta: {requiresAuth: true}
            },
            {
                path: '/jobtitles',
                component: JobTitle,
                meta: {requiresAuth: true}
            },
            {
                path: '/brands',
                component: Brand,
                meta: {requiresAuth: true}
            },
            {
                path: '/unit-measurements',
                component: UnitMeasurement,
                meta: {requiresAuth: true}
            },
            {
                path: '/cat-ambiente-destino',
                component: DestinationEnviroment,
                meta: {requiresAuth: true}
            },
            {
                path: '/providers-types',
                component: ProviderType,
                meta: {requiresAuth: true}
            },
            {
                path: '/providers-documents-types',
                component: ProviderDocumentType,
                meta: {requiresAuth: true}
            },
            {
                path: '/economic-activities',
                component: EconomicActivity,
                meta: {requiresAuth: true}
            },
            {
                path: '/rols',
                component: Rol,
                meta: {requiresAuth: true}
            },
            {
                path: '/countries',
                component: Country,
                meta: {requiresAuth: true}
            },
            {
                path: '/providers',
                component: Provider,
                meta: {requiresAuth: true}
            },
            {
                path: '/products',
                component: Products,
                meta: {requiresAuth: true}
            },
            {
                path: 'plate-types',
                component: PlateType,
                meta: {requiresAuth: true}
            },
            {
                path: 'vehicle-models',
                component: VehicleModel,
                meta: {requiresAuth: true}

            },
            {
                path: 'fuel-types',
                component: FuelType,
                meta: {requiresAuth: true}

            },
            {
                path: 'vehicles',
                component: Vehicles,
                meta: {requiresAuth: true}

            },
            {
                path: 'equivalents',
                component: Equivalents,
                meta: {requiresAuth: true}

            }, {
                path: 'interchanges',
                component: Interchanges,
                meta: {requiresAuth: true}

            },
            {
                path: 'inventory',
                component: Inventory,
                meta: {requiresAuth: true}

            },

            {
                path: 'sales',
                component: SaleHeader,
                meta: {requiresAuth: true}

            },
            {
                path: 'sales/add',
                component: SaleNew,
                name: 'sale-new',
                // meta: {requiresAuth: true}

            },
            {
                path: 'sales/edit/:id',  // :id es un parámetro dinámico para el ID de la venta
                component: SaleEdit,
                name: 'sale-edit',
                meta: {requiresAuth: true}
            },
            {
                path: '/lotes',
                component: Lotes,
                meta: {requiresAuth: true}

            },
            {
                path: '/printDTETicket/:idVenta',
                component: Lotes,
                meta: {requiresAuth: true}

            }


        ]
    },
    {path: '/sign-in', name: 'sign-in', component: SignIn},
    // Ruta comodín para manejar el error 404
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


// Guard para proteger rutas
router.beforeEach((to, from, next) => {
    // Verifica si la ruta requiere autenticación
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const token = localStorage.getItem('auth_token');  // Obtén el token del almacenamiento

        // Si no hay token, redirige a la página de inicio de sesión
        if (!token) {
            next({path: '/sign-in'});  // Redirige a SignIn si no hay token
        } else {
            next();  // Deja continuar a la ruta si hay un token válido
        }
    } else {
        next();  // Deja continuar a rutas que no requieren autenticación
    }
});

export default router;