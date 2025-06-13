<template>
  <div
      class="sidebar dark:bg-coal-600 bg-light border-r border-r-gray-200 dark:border-r-coal-100 fixed top-0 bottom-0 z-20 hidden lg:flex flex-col items-stretch shrink-0"
      data-drawer="true" data-drawer-class="drawer drawer-start top-0 bottom-0" data-drawer-enable="true|lg:false"
      id="sidebar">
    <div class="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0 border-2"
         id="sidebar_header">
      <a class="dark:hidden items-center" href="/">
        <img class="default-logo max-h-[50px] max-w-none" src="/media/app/logo-ligth.png" />
        <img class="small-logo max-h-[50px] max-w-none" src="/media/app/logo-ligth.png" />
      </a>
      <a class="hidden dark:block" href="/">
        <img class="default-logo max-h-[50px] max-w-none" src="/media/app/logo-ligth.png" />
        <img class="small-logo max-h-[50px] max-w-none" src="/media/app/logo-ligth.png" />
      </a>
      <button
          class="btn btn-icon btn-icon-md size-[30px] rounded-lg border border-gray-200 dark:border-gray-300 bg-light text-gray-500 hover:text-gray-700 toggle absolute left-full top-2/4 -translate-x-2/4 -translate-y-2/4"
          data-toggle="body" data-toggle-class="sidebar-collapse" id="sidebar_toggle">
        <i class="ki-filled ki-black-left-line toggle-active:rotate-180 transition-all duration-300">
        </i>
      </button>
    </div>
    <div class="sidebar-content flex grow shrink-0 py-5 pr-2" id="sidebar_content">
      <div class="scrollable-y-hover grow shrink-0 flex pl-2 lg:pl-5 pr-1 lg:pr-3" data-scrollable="true"
           data-scrollable-dependencies="#sidebar_header" data-scrollable-height="auto" data-scrollable-offset="0px"
           data-scrollable-wrappers="#sidebar_content" id="sidebar_scrollable">
        <div class="menu flex flex-col grow gap-0.1" data-menu="true" data-menu-accordion-expand-all="false"
             id="sidebar_menu">
          <div v-for="modulo in modulos" :key="modulo.id">
            <div v-if="modulo.is_padre" class="menu-item" data-menu-item-toggle="accordion"
                 data-menu-item-trigger="click">
              <div
                  class="menu-link flex items-center grow cursor-pointer border border-transparent gap-[10px] pl-[10px] pr-[10px] py-[3px]"
                  tabindex="0">
                        <span class="menu-icon items-start text-gray-500 dark:text-white w-[30px]">
                           <i :class="`ki-outline ki-${modulo.icono} text-lg`"></i>
                        </span>
                <span
                    class="menu-title text-sm  text-gray-700 menu-item-active:text-primary menu-link-hover:!text-primary">
                           {{ modulo.nombre }}
                        </span>
                <span class="menu-arrow text-gray-400 w-[25px] shrink-0 justify-end ml-1 mr-[-10px]">
                           <i class="ki-filled ki-plus text-2xs menu-item-show:hidden"></i>
                           <i class="ki-filled ki-minus text-2xs hidden menu-item-show:inline-flex"></i>
                        </span>
              </div>
              <div
                  class="menu-accordion gap-0.1 pl-[10px] relative before:absolute before:left-[20px] before:top-0 before:bottom-0 before:border-l before:border-gray-200">
                <div v-for="moduloHijo in modulos" :key="moduloHijo.id">
                  <div v-if="moduloHijo.id_padre == modulo.id" class="menu-item">
                    <router-link
                        :class="[
                                    'menu-link gap-[14px] pl-[10px] pr-[10px] py-[3px] border border-transparent items-center grow hover:bg-secondary-active dark:hover:bg-coal-300 dark:hover:border-gray-100 hover:rounded-lg',
                                    isActive(moduloHijo.ruta)
                                       ? 'bg-secondary-active dark:bg-coal-300 border-gray-100 rounded-lg text-primary font-semibold'
                                       : ''
                                 ]"
                        :to="moduloHijo.ruta" tabindex="0">
                                 <span
                                     class="menu-bullet flex w-[6px] relative before:absolute before:top-0 before:size-[6px] before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 menu-item-active:before:bg-primary menu-item-hover:before:bg-primary">
                                 </span>
                      <i :class="`ki-outline ki-${moduloHijo.icono} text-lg dark:text-white w-[20px]`"></i>
                      <span class="menu-title text-2sm font-medium text-gray-700">
                                    {{ moduloHijo.nombre }}
                                 </span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!modulo.is_padre && modulo.id_padre == 0" class="menu-item">
              <router-link
                  :class="[
                           'menu-link gap-[14px] pl-[10px] pr-[10px] py-[6px] border border-transparent items-center grow hover:bg-secondary-active dark:hover:bg-coal-300 dark:hover:border-gray-100 hover:rounded-lg',
                           isActive(modulo.ruta)
                              ? 'bg-secondary-active dark:bg-coal-300 border-gray-100 rounded-lg text-primary font-semibold'
                              : ''
                        ]"
                  :to="modulo.ruta" tabindex="0">
                        <span class="menu-icon items-start text-gray-500 dark:text-gray-400 w-[20px]">
                           <i class="ki-filled ki-element-11 text-lg"></i>
                        </span>
                <span class="menu-title text-2sm font-medium text-gray-700">
                           {{ modulo.nombre }}
                        </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduloService from '../services/moduloService';

export default {
  data() {
    return {
      modulos: [],
    };
  },
  methods: {
    isActive(ruta) {
      return this.$route.path === ruta;
    }
  },
  watch: {
    '$route.path'(newPath) {
      const actual = this.modulos.find(m => m.ruta === newPath);
      if (actual) {
        console.log('📌 Módulo actual:', actual.is_minimazed);
        const body = document.body;
        if (actual.is_minimazed === 1) {
          body.classList.add('sidebar-collapse');
        } else {
          body.classList.remove('sidebar-collapse');
        }
      }
    }
  },
  async mounted() {
    try {
      const response = await moduloService.get();
      this.modulos = response;

      const actual = this.modulos.find(m => m.ruta === this.$route.path);
      if (actual) {
        const body = document.body;
        if (actual.is_minimazed === 1) {
          body.classList.add('sidebar-collapse');
        } else {
          body.classList.remove('sidebar-collapse');
        }
      }
    } catch (error) {
      console.error('Error al cargar módulos:', error);
    }
  },


  async created() {
    try {
      const response = await moduloService.get();
      this.modulos = response;
    } catch (error) {
      console.error('Error cargando los módulos:', error);
    }
  },
};
</script>
