<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { socket } from '@/utils/socket'
import Mine from '@/components/mine/index.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isLove = ref(false)

const loveMode = ref(0)

const mapLen = ref(0)

const mineLen = ref(0)

const love = reactive({
    flag: false,
})

const screen = reactive({
    width: 0,
    height: 0,
})

const screenTarget = ref(null)

let stt = null

onMounted(() => {
    const { clientWidth, clientHeight } = screenTarget.value
    // console.dir(screenTarget.value)
    screen.width = clientWidth
    screen.height = clientHeight
})

watch(
    () => route.query,
    (val) => {
        isLove.value = !!(val.love && val.love == 1)
        mapLen.value = val.maplen
        mineLen.value = val.minelen
    },
    {
        immediate: true,
    }
)

socket.on('init', (data) => {
    // console.log('init', data)
    data.forEach((item) => {
        gameData[item.sit] = item
    })
})

socket.on('joinPlayer', (data) => {
    gameData[data.sit] = data
})

socket.on('startGame', (data) => {
    // console.log(data, gameData)
    data.forEach((item) => {
        gameData[item.sit].mineLen = item.mineLen
        gameData[item.sit].mineMap = item.mineMap
    })
    gameStart.value = true
})

socket.on('setLoveMode', (data) => {
    const { mode } = data
    loveMode.value = mode
})

socket.on('reject', (data) => {
    alert('别调皮')
})

socket.on('finishSweep', (data) => {
    const { sit, map, signCount, signCorrectCount } = data
    gameData[sit].mineMap = map
    gameData[sit].signCount = signCount
    gameData[sit].signCorrectCount = signCorrectCount
})

socket.on('flash', (data) => {
    clearTimeout(stt)
    const { sit, map } = data
    map.forEach((item) => {
        gameData[sit].mineMap[item.x][item.y].flash = true
    })
    stt = setTimeout(() => {
        map.forEach((item) => {
            gameData[sit].mineMap[item.x][item.y].flash = false
        })
    }, 200)
})

socket.on('finishGame', (data) => {
    const { sit, loveMode, map, signCount } = data
    gameData[sit].mineMap = map
    gameData[sit].signCount = signCount
    gameData[sit].animate = loveMode == 1 ? true : false
    love.flag = true
})

socket.on('bomb', (data) => {
    const { sit, map } = data
    gameData[sit].mineMap = map
    alert(`玩家${sit}, 已被炸毁`)
})

socket.on('gameRefresh', (data) => {
    location.reload()
})

socket.on('love', (data) => {
    gameData['leftPlayer'].animate = true
    gameData['rightPlayer'].animate = true
    love.flag = true
    // console.log(love)
})

const gameStart = ref(false)

const gameData = reactive({
    leftPlayer: null,
    rightPlayer: null,
})

const joinGame = (sit, isLove = false) => {
    socket.emit('join', {
        sit: sit,
        isLove,
        mapLen: mapLen.value,
        mineLen: mineLen.value,
    })
    // console.log(mapLen.value, mineLen.value)
}

const handleMineChange = (sit, target) => {
    socket.emit('sweep', { sit, ...target })
}

const handleLove = () => {
    socket.emit('love')
}
</script>

<template>
    <main :class="{ 'mine-sweeping-container': true, love: love.flag && loveMode == 1 }">
        <div ref="screenTarget" class="player left" :class="{ isJoin: gameData.leftPlayer && !gameStart }">
            <template v-if="!gameStart">
                <template v-if="!gameData.leftPlayer">
                    <div class="join-game" @click="joinGame('leftPlayer')">加入游戏</div>
                    <div v-if="isLove" class="join-game" @click="joinGame('leftPlayer', true)">L模式</div>
                </template>
                <div v-else class="tip">等待其余玩家进入游戏</div>
            </template>

            <template v-else>
                <Mine
                    :animate="gameData.leftPlayer.animate"
                    :mine-len="gameData.leftPlayer.mineLen"
                    :sign-count="gameData.leftPlayer.signCount"
                    :mine-list="gameData.leftPlayer.mineMap || []"
                    @handleMineChange="(target) => handleMineChange('leftPlayer', target)"
                ></Mine>
            </template>

            <!-- <canvas class="leftPlayer" :width="screen.width" :height="screen.height"></canvas> -->
        </div>
        <div class="player right" :class="{ isJoin: gameData.rightPlayer && !gameStart }">
            <template v-if="!gameStart">
                <template v-if="!gameData.rightPlayer">
                    <div class="join-game" @click="joinGame('rightPlayer')">加入游戏</div>
                    <div v-if="isLove" class="join-game" @click="joinGame('rightPlayer', true)">L模式</div>
                </template>
                <div v-else class="tip">等待其余玩家进入游戏</div>
            </template>
            <template v-else>
                <Mine
                    :animate="gameData.rightPlayer.animate"
                    :mine-len="gameData.rightPlayer.mineLen"
                    :sign-count="gameData.rightPlayer.signCount"
                    :mine-list="gameData.rightPlayer.mineMap || []"
                    @handleMineChange="(target) => handleMineChange('rightPlayer', target)"
                ></Mine>
            </template>
        </div>

        <div class="admin-btn" v-if="isLove">
            <button @click="handleLove">LOVE</button>
        </div>
    </main>
</template>

<style scoped lang="scss">
.mine-sweeping-container {
    display: flex;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-color: #e5ebf5;
    transition: all 0.4s;

    &.love {
        background-color: #22272e;
    }

    &::after {
        content: '';
        position: absolute;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        background-color: rgb(141, 141, 141);
    }

    .player {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        &.left {
            .join-game {
                border-color: lightcoral;
                color: lightcoral;
            }
            &.isJoin {
                background-color: rgba(240, 128, 128, 0.2);
            }
        }

        &.right {
            &.isJoin {
                background-color: rgba(100, 149, 237, 0.2);
            }
        }

        .join-game {
            width: 12.5rem;
            height: 5rem;
            border: 2px solid #6495ed;
            border-radius: 1.25rem;
            color: #6495ed;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            font-weight: bold;
            cursor: pointer;

            &:not(:last-child) {
                margin-right: 20px;
            }
        }

        .tip {
            font-size: 1.5rem;
            color: darkgrey;
        }
    }

    .admin-btn {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
