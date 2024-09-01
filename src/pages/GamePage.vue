<template>
    <div ref="gameComponent">
        <Instructions v-if="game.gameState === 'idle'" />
        <GameOverPopup v-if="showGameOverPopup" @click-play="handleClickPlay" :score="score" />
        <GameScore :score="score" />
        <DebugComponent v-if="showDebug" :ave-delay="averageDelay" />
        <GameActionButtons @click-trophy-button="handleClickTrophy" @click-git-hub-button="handleClickGitHub" />
    </div>
</template>

<script setup lang="ts">
import GameActionButtons from '@/components/GameActionButtons.vue';
import GameOverPopup from '@/components/GameOverPopup.vue';
import GameScore from '@/components/GameScore.vue';
import Game from '@/game';
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue';
import { logEvent } from '@/firebase/analytics';
import DebugComponent from '@/components/DebugComponent.vue';
import Instructions from '@/components/Instructions.vue';

logEvent("render_game_page")
const router = useRouter()
const route = useRoute()
const score = ref(0)
const showGameOverPopup = ref(false)
const gameComponent = ref<HTMLElement | null>(null)
const averageDelay = ref<number | undefined>(undefined)
const showDebug = ref(false)
const game = new Game()

setInterval(() => {
    averageDelay.value = game.getAverageDeltaTime();
}, 500)

watch(() => route.fullPath,
    async () => {
        if (route.query["debug"] === 'true') {
            showDebug.value = true
        }

        if (route.path === "/") {
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

async function handleClickGitHub() {
    await router.push({ path: '/github' })
    game.pause()
}

function handleClickPlay() {
    logEvent("play_game")
    showGameOverPopup.value = false;
    game.start()
}

game.onScoreChange = (_score) => {
    score.value = _score
}

game.onGameOver = async (_score) => {
    logEvent("game_over", {
        score: _score
    })
    setTimeout(() => {
        showGameOverPopup.value = true;
    }, 750)
}
game.start()
</script>

<style scoped></style>