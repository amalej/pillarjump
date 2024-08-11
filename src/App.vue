<script setup lang="ts">
import GamePage from './pages/GamePage.vue';
import Score from './database/score';

// Score.localStorage.reset()
// Score.localStorage.add({
//   uid: 'test',
//   name: "asf2",
//   score: 1
// })
const scores = Score.localStorage.get();
console.log(scores)

</script>

<template>
  <main>
    <GamePage />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}
</style>
