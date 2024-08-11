<template>
    <div id="main">
        <div class="card">
            <div class="card-header">High Scores</div>
            <div class="card-body">
                <div class="score-tab-selector">
                    <div class="score-tab" :onclick="() => scoreTab = 'global'"
                        :class="{ 'active-score-tab': scoreTab === 'global' }">Global</div>
                    <div class="score-tab" :onclick="() => scoreTab = 'personal'"
                        :class="{ 'active-score-tab': scoreTab === 'personal' }">Personal</div>
                </div>
                <PersonalHighScores v-if="scoreTab === 'personal'" />
                <GlobalHighScores v-else-if="scoreTab === 'global'" />
            </div>
            <div class="card-footer">
                <div class="card-button" :onclick="async () => await router.push({ path: '/' })">
                    <v-icon name="md-arrowback-round" class="return-icon"></v-icon>
                    <div class="Return-text">Return</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PersonalHighScores from '@/components/PersonalHighScores.vue';
import { logEvent } from '@/firebase/analytics';
import GlobalHighScores from '@/components/GlobalHighScores.vue';
import { ref } from 'vue';

const scoreTab = ref<'personal' | 'global'>('personal')

logEvent("render_high_score_page")
const router = useRouter()
</script>

<style scoped>
#main {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1000;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
}


.card {
    width: clamp(300px, 40%, 512px);
    max-height: 75%;
    background-color: rgba(0, 0, 0, 0.4);
    position: relative;
    display: flex;
    overflow: hidden;
    border-radius: 8px;
    border: 0.1em solid var(--game-pink-color-dark);
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
    align-items: center;
    text-transform: uppercase;
}

.return-icon {
    margin: 0em 0.25em;
    display: flex;
    align-items: center;
}

.score-tab-selector {
    margin: 0.5em;
    display: flex;
    flex-direction: row;
    width: calc(100% - 1em);
}

.score-tab {
    color: white;
    text-transform: uppercase;
    width: auto;
    width: 100%;
    margin: 0px 0.1em;
    display: flex;
    padding: 0.5em;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
}

.active-score-tab {
    border: 3.5px solid var(--game-pink-color-light);
    padding: calc(0.5em - 2.5px);
}
</style>