import "./style.css";
import {createApp} from "vue";
import App from "./App.vue";
import router from './router';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
// import {MultiSelect} from "@syncfusion/ej2-vue-dropdowns";
import '@syncfusion/ej2-vue-dropdowns/styles/material.css';
import Vue3Toastify, {type ToastContainerOptions} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Multiselect from '@vueform/multiselect'


import vSelect from 'vue-select'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

function resolveGLobalComponents(instance: App<Element>) {
    instance.use(Antd);
}
const app = createApp(App);
app.use(router)
app.component('v-select', vSelect as any)
app.component('VueDatePicker', VueDatePicker as any)
app.use(Vue3Toastify, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    useHandler: resolveGLobalComponents,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
} as ToastContainerOptions)

    .mount("#app");
