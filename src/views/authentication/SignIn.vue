<template>
  <div class="flex items-center justify-center grow bg-center bg-no-repeat page-bg">
    <div class="card max-w-[370px] w-full">
      <form @submit.prevent="handleLogin" class="card-body flex flex-col gap-5 p-10" id="sign_in_form" method="post">
        <div class="text-center mb-2.5">
          <h3 class="text-lg font-medium text-gray-900 leading-none mb-2.5">
            Sign in
          </h3>
        </div>
        <div class="flex items-center gap-2">
          <span class="border-t border-gray-200 w-full">
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="form-label font-normal text-gray-900">
            Email
          </label>
          <input class="input" v-model="username" placeholder="email@email.com" type="text"
            value="johndoe@example.com" />
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between gap-1">
            <label class="form-label font-normal text-gray-900">
              Password
            </label>
            <a class="text-2sm link shrink-0" href="#">
              Forgot Password?
            </a>
          </div>
          <div class="input" data-toggle-password="true">
            <input name="user_password" v-model="password" placeholder="Enter Password" type="password"
              value="password" />
            <button class="btn btn-icon" data-toggle-password-trigger="true" type="button">
              <i class="ki-filled ki-eye text-gray-500 toggle-password-active:hidden">
              </i>
              <i class="ki-filled ki-eye-slash text-gray-500 hidden toggle-password-active:block">
              </i>
            </button>
          </div>
        </div>
        <label class="checkbox-group">
          <input class="checkbox checkbox-sm" name="check" type="checkbox" value="1" />
          <span class="checkbox-label">
            Remember me
          </span>
        </label>
        <button type="submit" class="btn btn-primary flex justify-center grow">
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import authService from '@/services/authService'; // Importa el servicio de autenticación
import KTComponent from './../../metronic/core/index';
import { nextTick, onMounted } from 'vue';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Llama al servicio de login
        const response = await authService.login(this.username, this.password);
        // Almacena el token en el localStorage
        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('warehouse_id', response.warehouse_id);
        localStorage.setItem('warehouse_name', response.warehouse_name);
        localStorage.setItem('employee_name', response.employee_name);
        localStorage.setItem('employee_id', response.employee_id);

        // Redirige al dashboard después de un inicio de sesión exitoso
        this.$router.push('/');
      } catch (error) {
        // Si ocurre un error, muestra un mensaje de error
        this.errorMessage = error.message;
      }
    }
  }
};
onMounted(() => {
      nextTick(() => {
          //KTComponent.init();
      });
  });
</script>
<style>
.page-bg {
      background-image: url('/media/images/2600x1200/bg-10.png');
  }
  .dark .page-bg {
      background-image: url('/media/images/2600x1200/bg-10-dark.png');
  }
</style>