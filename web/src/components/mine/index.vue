<script setup>
import MineItem from '@/components/mine/mine-item.vue'
import { onMounted, reactive } from 'vue'

const emits = defineEmits(['handleMineChange'])

const props = defineProps({
    mineList: {
        type: Array,
        default: [],
    },
    mineLen: {
        type: Number,
        default: 0,
    },
    signCount: {
        type: Number,
        default: 0,
    },
    animate: {
        type: Boolean,
        default: false,
    },
})

const gameOver = () => {}

const checkMore = () => {}

const handleSweeping = (data) => {
    if (!props.animate) {
        emits('handleMineChange', data)
    }
}

// const mineList = reactive({
//     list: [],
// })
</script>

<template>
    <div class="mine-container">
        <div class="score" :class="{ love: animate }">
            <div class="score-card">{{ mineLen - signCount }}</div>
        </div>
        <div class="map">
            <div class="mine-row" v-for="(row, rowIndex) in mineList" :key="rowIndex">
                <div
                    class="mine-item"
                    :class="{ pulse: item.isLove && animate, hide: !item.isLove && animate }"
                    :style="{ animationDelay: `${(item.x * item.y) / 120}s` }"
                    v-for="(item, itemIndex) in row"
                    :key="itemIndex"
                >
                    <MineItem :animate="animate" :mine="item" @handleSweeping="handleSweeping"></MineItem>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.mine-container {
    .score {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.love {
            opacity: 0;
        }
        .score-card {
            position: relative;
            padding: 12px 36px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 2px 2px 4px #c8d0e7, -2px -2px 4px #fff;
            &::after {
                content: '';
                position: absolute;
                width: calc(100% - 8px);
                height: calc(100% - 8px);
                border-radius: 4px;
                box-shadow: inset 2px 2px 4px #c8d0e7, inset -2px -2px 4px #fff;
            }
        }
    }
    .map {
        .mine-row {
            display: flex;
            .mine-item {
                &.pulse {
                    // background-color: lightcoral;
                    // animation-duration: 1s;
                    // animation-fill-mode: both;
                    // animation-name: pulse;
                    // animation-timing-function: ease-in-out;
                    animation: pulse 1s ease-in-out infinite;
                }

                &.hide {
                    opacity: 0.2;
                }
            }
        }
    }

    @keyframes pulse {
        from {
            transform: scale3d(1, 1, 1);
        }

        50% {
            transform: scale3d(1.1, 1.1, 1.1);
        }

        to {
            transform: scale3d(1, 1, 1);
        }
    }
}
</style>
