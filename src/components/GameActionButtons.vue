<template>
    <div class="action-button-container">
        <div class="action-button" :onclick="() => emit('clickTrophyButton')">
            <v-icon name="bi-trophy-fill" class="icon" />
        </div>
        <!-- <div class="action-button" :onclick="() => emit('clickGitHubButton')">
            <v-icon name="bi-github" class="icon" />
        </div> -->
    </div>
</template>

<script setup>
const emit = defineEmits([
    'clickTrophyButton',
    'clickGitHubButton'
])

</script>

<style lang="css" scoped>
.action-button-container {
    position: absolute;
    right: 0px;
    padding: 0.25em;
    z-index: 2;
    margin: 0.25em;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.action-button {
    margin: 0.1em 0.25em;
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