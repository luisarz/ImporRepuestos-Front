<template>
  <div id="kt_app_footer" class="app-footer">
    <div class="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
      <!-- Copyright -->
      <div class="text-gray-900 order-2 order-md-1">
        <span class="text-muted fw-semibold me-1">{{ currentYear }}&copy;</span>
        <a href="https://keenthemes.com" target="_blank" class="text-gray-800 text-hover-primary">Keenthemes</a>
      </div>

      <!-- Footer menu -->
      <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
        <li class="menu-item">
          <a href="https://keenthemes.com" target="_blank" class="menu-link px-2">About</a>
        </li>
        <li class="menu-item">
          <a href="https://devs.keenthemes.com" target="_blank" class="menu-link px-2">Support</a>
        </li>
        <li class="menu-item">
          <a href="https://1.envato.market/Vm7VRE" target="_blank" class="menu-link px-2">Purchase</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>