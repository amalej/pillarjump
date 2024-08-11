<script setup lang="ts">
import Score, { type UserScore } from '@/database/score';
import NewHighScorePopup from './NewHighScorePopup.vue';
import PersonalHighScores from './PersonalHighScores.vue';
import { ref } from 'vue';

const props = defineProps<{
    score: number;
}>()
const emit = defineEmits(['clickPlay'])
const userScore = ref<UserScore | undefined>(undefined)
const isHighScore = Score.localStorage.isHighScore(props.score)
const showNewHighScorePopup = ref(isHighScore)

function closeNewHighScorePopup() {
    showNewHighScorePopup.value = false
}

function submitNewHighScore(_userScore: UserScore) {
    userScore.value = _userScore;
    showNewHighScorePopup.value = false
}

function playAgain() {
    emit('clickPlay')
}

</script>

<template>
    <NewHighScorePopup v-if="showNewHighScorePopup" :score="props.score" @close-popup="closeNewHighScorePopup"
        @submit-score="submitNewHighScore" />
    <div id="main" v-else>
        <div class="card">
            <div class="card-header">Game Over</div>
            <div class="card-body">
                <PersonalHighScores :user-score="userScore" />
            </div>
            <div class="card-footer">
                <div class="card-button" :onclick="playAgain">
                    <v-icon name="fa-play" class="play-again-icon"></v-icon>
                    <div class="play-again-text">Play Again</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#main {
    font-family: Arial, Helvetica, sans-serif;
    top: 0px;
    left: 0px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    align-items: center;
    justify-content: center;
    position: absolute;
    display: flex;
    z-index: 100;
}

.card {
    width: clamp(300px, 40%, 40%);
    max-height: 75%;
    background-color: rgba(0, 0, 0, 0.4);
    position: relative;
    display: flex;
    overflow: hidden;
    border-radius: 8px;
    border: 0.1em solid rgb(112, 85, 90);
    padding: 0.75em;
    flex-direction: column;
}

.card-header {
    color: white;
    display: flex;
    width: 100%;
    letter-spacing: 0.05em;
    font-size: 1.75em;
    font-weight: 500;
    text-align: left;
    font-family: Arial;
    justify-content: center;
    align-items: center;
}

.card-body {
    margin: 0.25em 0em;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card-footer {
    display: flex;
    text-align: left;
    font-family: Arial;
    justify-content: center;
}

.card-button {
    color: white;
    border: 0.15em solid white;
    padding: 0.5em;
    margin: 0.5em;
    display: flex;
    width: 100%;
    justify-content: center;
}

.play-again-icon {
    margin: 0em 0.25em;
    display: flex;
    align-items: center;
}

.play-again-text {
    font-size: 0.8em;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-weight: 600;
}
</style>
