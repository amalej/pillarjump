<script setup lang="ts">
import Score, { MAX_GLOBAL_HIGHSCORE_COUNT, type UserScore } from '@/database/score';
import { logEvent } from '@/firebase/analytics';
import { generateId } from '@/utils';
import { onMounted, ref } from 'vue';

logEvent("render_personal_highscores")
const props = defineProps<{
    userScore?: UserScore
}>()

const scores = ref(Score.localStorage.get());

onMounted(() => {
    const highScoreDiv = document.getElementsByClassName('sid-match')[0]
    if (highScoreDiv) {
        setTimeout(() => {
            highScoreDiv.scrollIntoView({
                behavior: "smooth",
                block: 'center',
                inline: "nearest"
            })
        }, 100)
    }

})

</script>

<template>
    <div class="main styled-scrollbar">
        <div v-for="({ name, score, sid }, index) in scores" class="score-container"
            :class="{ 'sid-match': props.userScore?.sid === sid }" :key="generateId()">
            <div class="high-score-place">
                {{ index + 1 }}
            </div>
            <div class="high-score-info">
                <div class="user-name"> {{ name }}</div>
                <div class="user-score">
                    <v-icon v-if="index + 1 <= MAX_GLOBAL_HIGHSCORE_COUNT" name="la-globe-solid" class="trophy-icon" />
                    <v-icon name="bi-trophy-fill" class="trophy-icon" />
                    <div class="score-text"> {{ score }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    color: white;
    display: flex;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    flex-direction: column;
    scroll-behavior: smooth;
}

.score-container {
    display: flex;
    padding: 0.5em;
    border: 1px solid white;
    margin: 2.5px 2.5px;
}

.high-score-place {
    margin-left: 0.75em;
    margin-right: 1.125em;
    display: flex;
    align-items: center;
    font-weight: 600;
}

.user-name {
    margin: 0.25em 0em;
    font-weight: 500;
    font-size: 1em;
}

.trophy-icon {
    margin-right: 0.25em;
}

.user-score {
    font-size: 0.9em;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.sid-match {
    border: 3.5px solid var(--game-pink-color-light);
    padding: calc(0.5em - 2.5px);
}
</style>

<style scoped>
.styled-scrollbar::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: transparent;
}

.styled-scrollbar::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
}

.styled-scrollbar::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: rgb(189, 104, 104);
}
</style>