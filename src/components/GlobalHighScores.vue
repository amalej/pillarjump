<script setup lang="ts">
import Score, { MAX_DATABASE_HIGHER_SCORE_COUNT, MAX_DATABASE_TOP_SCORE_COUNT, type UserScore } from '@/database/score';
import User from '@/database/user';
import { logEvent } from '@/firebase/analytics';
import { generateId } from '@/utils';
import { trace } from '@/firebase/performance';
import { onMounted, ref, watch } from 'vue';
import { VueSpinner } from 'vue3-spinners';


logEvent("render_global_highscores")
const props = defineProps<{
    userScore?: UserScore
}>()

const topScores = ref<UserScore[]>([])
const hasFinishedLoading = ref<boolean>(false)
const higherScores = ref<UserScore[]>([])
const highestScoreLocal: UserScore[] = Score.localStorage.get().slice(0, 3)
const topLocalScore = highestScoreLocal[0]
const highestScoreGlobalPosition = ref<number | null>(null)
const MAX_RENDER_COUNT = MAX_DATABASE_TOP_SCORE_COUNT + MAX_DATABASE_HIGHER_SCORE_COUNT

onMounted(async () => {
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

    await Score.database.syncTopLocalScores();

    /**
     * There are three await calls here, we might want to use Promise.all()
     */

    const getTopScoresTrace = trace('getTopScores')
    getTopScoresTrace.start()
    const _topScores = await Score.database.getTopScores()
    const topScoresSidList = _topScores.map((val) => val.sid)
    getTopScoresTrace.stop()

    if (topLocalScore) {
        const getGlobalPositionTrace = trace('getGlobalPosition')
        getGlobalPositionTrace.start()
        const pos = await Score.database.getGlobalPosition(topLocalScore)
        getGlobalPositionTrace.stop()

        if (pos !== null) {
            if (pos > MAX_DATABASE_TOP_SCORE_COUNT) {
                const getHigherScoresTrace = trace('getHigherScores')
                getHigherScoresTrace.start()
                const _higherScores = await Score.database.getClosestHigherScores(topLocalScore)
                getHigherScoresTrace.stop()
                higherScores.value = _higherScores.filter((val) => !topScoresSidList.includes(val.sid))
            } else if (pos === MAX_DATABASE_TOP_SCORE_COUNT) {
                _topScores.pop();
                _topScores.push(topLocalScore)
            }
        }
        highestScoreGlobalPosition.value = pos
    }
    topScores.value = _topScores
    hasFinishedLoading.value = true
})


watch(() => highestScoreGlobalPosition.value,
    async () => {
        const searchInternal = setInterval(() => {
            const element = document.getElementById("highestScoreGlobalPositionDiv")
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: 'center',
                    inline: "nearest"
                });
                clearInterval(searchInternal)
            }
        }, 100)
    }
)

</script>

<template>
    <div class="main styled-scrollbar">
        <div class="spinner-container" v-if="!hasFinishedLoading">
            <VueSpinner class="spinner" />
        </div>
        <div v-else>
            <div v-for="({ name, score, sid, uid }, index) in topScores" class="score-container"
                :id="topLocalScore?.sid === sid ? 'highestScoreGlobalPositionDiv' : undefined"
                :class="{ 'uid-match': User.localStorage.getId() === uid }" :key="generateId()">
                <div class="high-score-place">
                    {{ index + 1 }}
                </div>
                <div class="high-score-info">
                    <div class="user-name"> {{ name }}</div>
                    <div class="user-score">
                        <v-icon name="bi-trophy-fill" class="trophy-icon" />
                        <div class="score-text"> {{ score }}</div>
                    </div>
                </div>
            </div>
            <div v-if="highestScoreGlobalPosition !== null && (highestScoreGlobalPosition - 1) > MAX_RENDER_COUNT"
                style="margin: 0px 0.25em; letter-spacing: 0.25em;font-size: 1.25em;font-weight: 700;">
                ...
            </div>
            <div v-if="highestScoreGlobalPosition !== null" v-for="({ name, score, sid, uid }, index) in higherScores"
                class="score-container" :id="topLocalScore?.sid === sid ? 'highestScoreGlobalPositionDiv' : undefined"
                :class="{ 'uid-match': User.localStorage.getId() === uid }" :key="generateId()">
                <div class="high-score-place">
                    {{ highestScoreGlobalPosition - higherScores.length + index }}
                </div>
                <div class="high-score-info">
                    <div class="user-name"> {{ name }}</div>
                    <div class="user-score">
                        <v-icon name="bi-trophy-fill" class="trophy-icon" />
                        <div class="score-text"> {{ score }}</div>
                    </div>
                </div>
            </div>
            <div v-if="highestScoreGlobalPosition !== null && highestScoreGlobalPosition > topScores.length"
                id="highestScoreGlobalPositionDiv" class="score-container uid-match" :key="generateId()">
                <div class="high-score-place">
                    {{ highestScoreGlobalPosition }}
                </div>
                <div class="high-score-info">
                    <div class="user-name"> {{ topLocalScore?.name }}</div>
                    <div class="user-score">
                        <v-icon name="bi-trophy-fill" class="trophy-icon" />
                        <div class="score-text"> {{ topLocalScore?.score }}</div>
                    </div>
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

.uid-match {
    border: 3.5px solid var(--game-pink-color-light);
    padding: calc(0.5em - 2.5px);
}

.spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25em;
    font-size: 4em;
    color: var(--game-pink-color-light);
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