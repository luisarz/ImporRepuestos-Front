import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import vSelect from 'vue-select'
const app = createApp(App);
app.use(router)
app.component('v-select', vSelect)

    .mount("#app");
