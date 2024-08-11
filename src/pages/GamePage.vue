<template>
    <div ref="gameComponent">
        <GameOverPopup v-if="showGameOverPopup" @click-play="handleClickPlay" :score="score" />
        <GameScore :score="score" />
        <GameActionButtons @click-trophy-button="handleClickTrophy" />
    </div>
</template>

<script setup lang="ts">
console.log("render game")
import GameActionButtons from '@/components/GameActionButtons.vue';
import GameOverPopup from '@/components/GameOverPopup.vue';
import GameScore from '@/components/GameScore.vue';
import Game from '@/game';
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue';

const router = useRouter()
const route = useRoute();
const score = ref(0)
const showGameOverPopup = ref(false)
const gameComponent = ref<HTMLElement | null>(null);
const game = new Game();

watch(() => route.fullPath,
    async () => {
        if (route.fullPath === "/") {
            game.resume()
        } else {
            game.pause()
        }
    }
);

onMounted(() => {
    const gameComponentElement: HTMLElement | null = gameComponent.value;
    if (gameComponentElement !== null) {
        gameComponentElement.appendChild(game.renderer.domElement);
    }
})

async function handleClickTrophy() {
    await router.push({ path: '/highscores' })
    game.pause()
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

<style scoped></style>