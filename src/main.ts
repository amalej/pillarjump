import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  BiTrophyFill,
  FaPlay,
  MdArrowbackRound,
  LaGlobeSolid,
  BiGithub,
  GiClick,
  MdSpacebarRound,
  BiBug,
  HiLightBulb ,
} from "oh-vue-icons/icons";

addIcons(
  BiTrophyFill,
  FaPlay,
  MdArrowbackRound,
  LaGlobeSolid,
  BiGithub,
  GiClick,
  MdSpacebarRound,
  BiBug,
  HiLightBulb 
);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.use(router);
app.mount("#app");
