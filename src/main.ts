import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import "@keenthemes/ktui/dist/ktui.js";


createApp(App).use(router)
.mount("#app");
