<script setup>
import Mine from '@/components/mine.vue'
import { onMounted } from 'vue'

// onMounted(() => {
//     socket.on('demo', (data) => {
//         console.log('demo')
//         if (data === 'hello world') {
//             alert('hello')
//         }
//     })
// })
</script>

<template>
    <main class="home-container">
        <div class="player">
            <Mine id="left"></Mine>
        </div>
        <!-- <div class="player">
            <Mine id="right"></Mine>
        </div> -->
    </main>
</template>

<style scoped lang="scss">
.home-container {
    display: flex;
    height: 100%;
    background-color: #e5ebf5;
    .player {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
    }
}
</style>
