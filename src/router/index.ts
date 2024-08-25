import GitHubPage from "@/pages/GitHubPage.vue";
import HighScorePage from "@/pages/HighScorePage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/highscores",
      component: HighScorePage,
    },
    {
      path: "/github",
      component: GitHubPage,
    },
  ],
});

export default router;
