<template>
    <div class="modal" data-modal="true" :id="id">
        <div class="modal-content   max-w-[600px]">
            <div class="modal-header">
                <h3 class="modal-title">
                </h3>
                <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true">
                    <i class="ki-outline ki-cross">
                    </i>
                </button>
            </div>
            <div class="modal-body">
                <br>
                <center>
                    <i class="ki-duotone ki-information-2 text-warning text-2xl" style="font-size:3.5rem">
                    </i>
                    <h2 class="text-xl font-medium leading-none text-gray-900">¿Deseas Elminiar este Registro?</h2>
                    <div class="flex items-center gap-2 font-medium justify-center">
                        <p class="text-sm text-gray-600">Este registro no podrá ser recuperado cuando se elimine</p>
                    </div>
                </center>
            </div>
            <div class="modal-footer justify-end">
                <div class="flex gap-4">
                <button class="btn btn-light" data-modal-dismiss="true">
                    Cancel
                </button>
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
        id: String,
        show: Boolean
    }
};
</script>