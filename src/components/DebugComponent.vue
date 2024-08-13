<template>
    <div class="main">
        <div>
            ave delay: {{ aveDelay }}
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    aveDelay?: number;
}>()
</script>

<style lang="css" scoped>
.main {
    bottom: 0.3em;
    left: 0.3em;
    letter-spacing: 0.08em;
    font-size: 0.8em;
    color: white;
    font-weight: 500;
    text-align: left;
    font-family: Arial;
    z-index: 1;
    position: absolute;
    display: flex;
}
</style>