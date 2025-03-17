<template>
  <footer class="footer">
    <div class="container-fixed">
      <div class="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5">
        <div class="flex order-2 md:order-1 gap-2 font-normal text-2sm">
          <span class="text-gray-500">{{ currentYear }}©</span>
          <a class="text-gray-600 hover:text-primary" href="https://keenthemes.com">
            ImporRepuestos.
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>