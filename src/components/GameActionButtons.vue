<template>
    <div class="action-button-container">
        <!-- <div class="action-button" :onclick="() => emit('clickTrophyButton')"> -->
        <div class="action-button" :onclick="() => emit('clickTrophyButton')">
            <v-icon name="bi-trophy-fill" class="icon" />
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits([
    'clickTrophyButton'
])

</script>

<style lang="css" scoped>
.action-button-container {
    position: absolute;
    right: 0px;
    margin: 0.5em;
    padding: 0.25em;
    z-index: 2;
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