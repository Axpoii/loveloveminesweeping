<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import Point from '@/canvas/Point'
import Particle from '@/canvas/Particle'
import Girl from '@/assets/girl.png'
import Boy from '@/assets/boy.png'

const screen = ref(null)
const pointArr = ref([])
const particleArr = ref([])
const screenData = reactive({
    oX: 0,
    oY: 0,
})

const size = 50

// addEventListener('mousemove', (e) => {
//     let { x, y } = e
//     pointArr.value.push(new Point(x, y, Math.random() * 20))
// })`

const handleMouseMove = (e) => {
    let { x, y } = e
    x -= screenData.oX
    y -= screenData.oY
    pointArr.value.push(new Point(x, y, Math.random() * 10, '#f0d373'))
}

onMounted(() => {
    const ctx = screen.value.getContext('2d')
    const { offsetLeft, offsetTop } = screen.value
    screenData.oX = offsetLeft
    screenData.oY = offsetTop
    particleArr.value.push(
        new Particle({
            x: 100,
            y: 800,
            r: 1,
            color: `#fff`,
            endX: 200,
            endY: 300,
        })
    )

    // renderImg(ctx)

    // const BoyImg = new Image()
    // BoyImg.src = Boy

    // BoyImg.onload = (e) => {
    //     console.log(BoyImg.height)
    //     ctx.drawImage(BoyImg, 0, 800 - 11 * size, 4 * size, 11 * size)
    //     // console.log('load', ctx.drawImage)
    // }

    setInterval(() => {
        ctx.clearRect(0, 0, 800, 800)
        if (pointArr.value.length) {
            pointArr.value.forEach((item, index) => {
                let c = item.update()
                if (c.r < 0) {
                    pointArr.value.splice(index, 1)
                } else {
                    item.render(ctx)
                }
            })
        }
        if (particleArr.value.length) {
            particleArr.value.forEach((item, index) => {
                let { x, y, isArrive } = item.update()
                if (!isArrive) {
                    pointArr.value.push(new Point(x, y, Math.random() * 10, '#f0d373'))
                } else {
                    particleArr.value.splice(index, 1)
                }
                item.render(ctx)
            })
        }
    }, 20)
})
</script>

<template>
    <div class="demo-container">
        <canvas ref="screen" class="hanabi" width="800" height="800" @mousemove="handleMouseMove"></canvas>
    </div>
</template>

<style scoped lang="scss">
.demo-container {
    height: 100%;
    background-color: #22272e;
    display: flex;
    align-items: center;
    justify-content: center;

    .hanabi {
        border: 1px solid #efefef;
    }
}
</style>
