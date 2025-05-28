import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import vSelect from 'vue-select'
const app = createApp(App);
app.use(router)
app.component('v-select', vSelect as any)
app.component('VueDatePicker', VueDatePicker as any)

    .mount("#app");
