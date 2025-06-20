import "uikit/dist/css/uikit.min.css";
import "@/styles/theme.css";
// import './assets/main.css'

import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";

import VCalendar from "v-calendar";
import "v-calendar/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

UIkit.use(Icons);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {});

app.mount("#app");
