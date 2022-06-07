<script setup>
import { RouterView, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/mine.js'
import { nextTick, onMounted, watch } from 'vue'
const route = useRoute()
const { changeGameType } = useGameStore()

watch(
    () => route.query,
    (val) => {
        changeGameType(val.type)
    }
)
</script>

<template>
    <RouterView />
</template>

<style>
html,
body {
    width: 100%;
    height: 100%;
    font-size: 14px;
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#app {
    height: 100%;
}
</style>
