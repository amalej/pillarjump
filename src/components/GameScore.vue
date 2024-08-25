<script setup lang="ts">
import Score, { type UserScore } from '@/database/score';
import { ref, watch } from 'vue';

const props = defineProps<{
    score: number;
}>()

const nextHigherScore = ref<UserScore | null>(getNextHighscore(props.score))

function getNextHighscore(score: number): UserScore | null {
    const higherScores = Score.localStorage.get().filter((userScore) => userScore.score >= score)
    const nextHigherScore: UserScore | null = higherScores[higherScores.length - 1]
    return nextHigherScore
}

watch(() => props.score, () => {
    nextHigherScore.value = getNextHighscore(props.score)
})

</script>

<template>
    <div id="main">
        <div class="next-score" v-if="nextHigherScore">
            {{ nextHigherScore?.name }}: {{ nextHigherScore?.score }}
        </div>
        <div class="new-highest-score" v-else-if="Score.localStorage.get().length > 0">
            New Highest score!
        </div>
        <div class="game-score">
            {{ score }}
        </div>
    </div>
</template>

<style scoped>
#main {
    top: 0.3em;
    left: 0.3em;
    letter-spacing: 0.08em;
    color: white;
    text-align: left;
    font-family: Arial;
    z-index: 1;
    position: absolute;
    display: flex;
    flex-direction: column;
}

.game-score {
    letter-spacing: 0.08em;
    font-size: 2.25em;
    font-weight: 500;
}

.next-score {
    letter-spacing: 0.08em;
    font-size: 0.8em;
    font-weight: 500;
}

.new-highest-score {
    letter-spacing: 0.08em;
    font-size: 0.8em;
    font-weight: 500;
}
</style>