<template>
    <div class="action-button-container">
        <div class="action-button" :onclick="handleClickTrophy">
            <v-icon name="bi-trophy-fill" class="icon" />
        </div>
    </div>
    <div ref="gameComponent">
        <GameOverPopup v-if="showGameOverPopup" @click-play="handleClickPlay" :score="score" />
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

function handleClickTrophy(e: PointerEvent) {
    console.log(e)
}

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
.action-button-container {
    position: absolute;
    right: 0px;
    margin: 0.5em;
    padding: 0.25em;
    z-index: 100;
    display: flex;
    justify-content: center;
}

.action-button {
    border: 2px solid white;
    border-radius: 0.5em;
    padding: 0.5em;
}

.action-button>.icon {
    width: 1.25em;
    height: 1.25em;
    color: white;
}
</style>