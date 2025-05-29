<template>
  <header class="header fixed top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-coal-500"
          data-sticky="true" data-sticky-class="shadow-sm dark:border-b dark:border-b-coal-100"
          data-sticky-name="header" id="header">
    <!-- begin: container -->
    <div class="container-fluid flex justify-between items-stretch lg:gap-1" id="header_container">
      <div class="flex gap-1 lg:hidden items-center -ml-1">
        <a class="shrink-0" href="/">
          <img class="max-h-[25px] w-full" src="/media/app/logo-ligth.png"/>

        </a>
        <div class="flex items-center">
          <button class="btn btn-icon btn-light btn-clear btn-sm" data-drawer-toggle="#sidebar">
            <i class="ki-filled ki-menu">
            </i>
          </button>
          <button class="btn btn-icon btn-light btn-clear btn-sm" data-drawer-toggle="#megamenu_wrapper">
            <i class="ki-filled ki-burger-menu-2">
            </i>
          </button>
        </div>

      </div>
      <div class="flex items-center ">
        <span class="badge badge-outline badge-success me-2 ">
  Sucursal/Bodega
  <span class="badge badge-outline badge-warning ms-2">{{ warehouse_name }}</span>
</span>

      </div>
      <div class="flex items-stretch" id="megamenu_container">

        <div class="flex items-stretch" data-reparent="true" data-reparent-mode="prepend|lg:prepend"
             data-reparent-target="body|lg:#megamenu_container">
          <div class="hidden lg:flex lg:items-stretch" data-drawer="true"
               data-drawer-class="drawer drawer-start fixed z-10 top-0 bottom-0 w-full mr-5 max-w-[250px] p-5 lg:p-0 overflow-auto"
               data-drawer-enable="true|lg:false" id="megamenu_wrapper">
            <div class="menu flex-col lg:flex-row gap-5 lg:gap-7.5" data-menu="true" id="megamenu">
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 lg:gap-3.5">
        <div class="menu" data-menu="true">
          <div class="menu-item" data-menu-item-offset="20px, 10px" data-menu-item-placement="bottom-end"
               data-menu-item-toggle="dropdown" data-menu-item-trigger="click|lg:click">
            <div class="menu-toggle btn btn-icon rounded-full">
              <img alt="" class="size-9 rounded-full border-2 border-success shrink-0" src="/media/avatars/300-2.png">
              </img>
            </div>
            <div class="menu-dropdown menu-default light:border-gray-300 w-full max-w-[250px]">
              <div class="flex items-center justify-between px-5 py-1.5 gap-1.5">
                <div class="flex items-center gap-2">
                  <img alt="" class="size-9 rounded-full border-2 border-success" src="/media/avatars/300-2.png">
                  <div class="flex flex-col gap-1.5">
                                <span class="text-sm text-gray-800 font-semibold leading-none">
                                Cody Fisher
                                </span>
                    <a class="text-xs text-gray-600 hover:text-primary font-medium leading-none"
                       href="html/demo1/account/home/get-started.html">
                      c.fisher@gmail.com
                    </a>
                  </div>
                  </img>
                </div>
                <span class="badge badge-xs badge-primary badge-outline">
                            Pro
                            </span>
              </div>
              <div class="menu-separator">
              </div>
              <div class="flex flex-col">
                <div class="menu-item">
                  <a class="menu-link" href="html/demo1/account/home/user-profile.html">
                                <span class="menu-icon">
                                <i class="ki-filled ki-profile-circle">
                                </i>
                                </span>
                    <span class="menu-title">
                                My Profile
                                </span>
                  </a>
                </div>
              </div>
              <div class="menu-separator">
              </div>
              <div class="flex flex-col">
                <div class="menu-item mb-0.5">
                  <div class="menu-link">
                                <span class="menu-icon">
                                <i class="ki-filled ki-moon">
                                </i>
                                </span>
                    <span class="menu-title">
                                Dark Mode
                                </span>
                    <label class="switch switch-sm">
                      <input data-theme-state="dark" data-theme-toggle="true" name="check" type="checkbox" value="1">
                      </input>
                    </label>
                  </div>
                </div>
                <div class="menu-item px-4 py-1.5">
                  <a class="btn btn-sm btn-light justify-center" @click="logout">
                    Log out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import authService from "@/services/authService.js";

export default {
  data() {
    return {
      warehouse_name: ''
    }
  },
  mounted() {
    this.warehouse_name = localStorage.getItem('warehouse_name') || 'Sin sucursal';
  },
  methods: {
    async logout() {
      try {
        await authService.logout();
        this.$router.push('/sign-in');
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
}
</script>
