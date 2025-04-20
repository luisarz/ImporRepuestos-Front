<template>
<!--    <div class="modal" data-modal="true" :id="id" data-backdrop="static" role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">-->
      <div class="modal fade" data-modal="true" :id="id" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">

      <div class="modal-content lg:max-w-[1600px] top-[10%]">

        <div class="modal-header">
                <h3 class="modal-title">
                    {{ title }}
                </h3>
                <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true">
                    <i class="ki-outline ki-cross">
                    </i>
                </button>
            </div>
            <div class="modal-body">
                <slot name="body"></slot> <!-- Aquí se renderiza el contenido -->
            </div>
            <div class="modal-footer justify-end">
                <div class="flex gap-4">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    title: String,
    id:String,
    show: Boolean
  }
};
</script>