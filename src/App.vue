<script setup lang="ts">
import { logEvent } from './firebase/analytics';
import GamePage from './pages/GamePage.vue';

logEvent("render_app")
</script>

<template>
  <main>
    <GamePage />
    <RouterView />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}
</style>
