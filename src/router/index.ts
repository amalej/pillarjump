import GamePage from "@/pages/GamePage.vue";
import HighScorePage from "@/pages/HighScorePage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: GamePage,
    },
    {
      path: "/highscore",
      component: HighScorePage,
    },
  ],
});

export default router;
