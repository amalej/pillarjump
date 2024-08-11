import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { OhVueIcon } from "oh-vue-icons";
import { addIcons } from "oh-vue-icons";
import { BiTrophyFill } from "oh-vue-icons/icons";
import { FaPlay } from "oh-vue-icons/icons";
import { MdArrowbackRound } from "oh-vue-icons/icons";
import { LaGlobeSolid } from "oh-vue-icons/icons";

addIcons(BiTrophyFill, FaPlay, MdArrowbackRound, LaGlobeSolid);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.use(router);
app.mount("#app");
