<script setup lang="ts">
defineProps<{
    score: number;
}>()
</script>

<template>
    <div id="main">
        {{ score }}
    </div>
</template>

<style scoped>
#main {
    top: 0.3em;
    left: 0.3em;
    letter-spacing: 0.08em;
    font-size: 2em;
    color: white;
    font-weight: 500;
    text-align: left;
    font-family: Arial;
    z-index: 1;
    position: absolute;
    display: flex;
}
</style>