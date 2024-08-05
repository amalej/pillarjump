<template>
    <div ref="gameComponent">
        <GameOverPopup v-if="showGameOverPopup" @click-play="handleClickPlay" />
        <GameScore :score="score" />
    </div>
</template>

<script setup lang="ts">
import GameOverPopup from '@/components/GameOverPopup.vue';
import GameScore from '@/components/GameScore.vue';
import Game from '@/game';
import { ref, onMounted } from 'vue';

const score = ref(0)
const showGameOverPopup = ref(false)
const gameComponent = ref<HTMLElement | null>(null);
const game = new Game();

onMounted(() => {
    const gameComponentElement: HTMLElement | null = gameComponent.value;
    if (gameComponentElement !== null) {
        gameComponentElement.appendChild(game.renderer.domElement);
    }
})

function handleClickPlay() {
    console.log("PLAY")
    showGameOverPopup.value = false;
    game.start()
}

game.onScoreChange = (_score) => {
    score.value = _score
}

game.onGameOver = async (_score) => {
    console.log("Final Score: " + _score)
    showGameOverPopup.value = true;
}

game.start()
</script>

<style scoped>
div {
    color: green;
}
</style>