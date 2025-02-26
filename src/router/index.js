import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MainLayout from '../views/layouts/MainLayout.vue';
import SignIn from '../views/authentication/SignIn.vue';

const routes = [
  { 
    path: '/', 
    component: MainLayout,
    children : [{
        path: '',
        component: Home,
        meta: { requiresAuth: true }  // Esta ruta requiere autenticación
    }]
},
  { path: '/sign-in', name: 'sign-in', component: SignIn }
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
        next({ path: '/sign-in' });  // Redirige a SignIn si no hay token
      } else {
        next();  // Deja continuar a la ruta si hay un token válido
      }
    } else {
      next();  // Deja continuar a rutas que no requieren autenticación
    }
  });

export default router;