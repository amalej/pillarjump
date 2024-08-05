<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
const emit = defineEmits(['clickPlay']);

const playAgainButtonRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (playAgainButtonRef !== null) {
        const playAgainButtonElement = playAgainButtonRef.value as HTMLDivElement;
        playAgainButtonElement.onclick = () => {
            emit('clickPlay')
        };

    }
})

</script>

<template>
    <div id="main">
        <div class="card">
            <div class="card-content">
                <div class="card-header">Game Over</div>
                <div style="margin-bottom: 0.5em;"></div>
                <!-- <div class="card-body"> -->
                <!-- </div> -->
                <div class="card-footer">
                    <div class="card-button">Trophy</div>
                    <div class="card-button" ref="playAgainButtonRef">Play</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#main {
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
    /* height: 40%; */
    background-color: rgba(0, 0, 0, 0.4);
    position: relative;
    display: flex;
    overflow: hidden;
    border-radius: 8px;
    border: 0.1em solid rgb(112, 85, 90);
}

.card-content {
    padding: 0.75em;
    width: 100%;
    display: flex;
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
    background: green;
    height: 100%;
    display: flex;
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


/* .card::before {
    content: '';
    position: absolute;
    width: 100px;
    background-image: linear-gradient(180deg, rgb(170, 119, 119), rgb(170, 119, 119));
    height: 130%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.2s linear;
}

@keyframes rotBGimg {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
} */
</style>