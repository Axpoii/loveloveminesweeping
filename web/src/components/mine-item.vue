<script setup>
import { ref } from 'vue'
import { socket } from '@/utils/socket'
import { useGameStore } from '@/stores/mine.js'

const { gameType } = useGameStore()

const props = defineProps({
    mine: {
        type: Object,
        default: () => {},
    },
    type: {
        type: String,
        default: '',
    },
})
const emits = defineEmits(['gameOver', 'checkMore', 'update:show', 'update:sign'])

const checkGrid = (e) => {
    // if (gameType !== props.type) {
    //     alert('别调皮')
    //     return
    // }
    if (e.button === 0) {
        if (props.mine.isSign) {
            emits('update:sign', false)
            // 发出- 标记修改
            socket.emit('signGrid', { ...props.mine, type: props.type, flag: false })
        } else {
            emits('update:show', true)
            // 发出- 点击扫雷
            socket.emit('checkGrid', { ...props.mine, type: props.type })
            if (props.mine.isMine) {
                emits('gameOver')
            } else {
                emits('checkMore', props.mine)
            }
        }
    }
    if (e.button === 2) {
        if (props.mine.isShow) return
        if (props.mine.isSign) {
            emits('update:sign', false)
            // 发出- 标记修改
            socket.emit('signGrid', { ...props.mine, type: props.type, flag: false })
        } else {
            emits('update:sign', true)
            // 发出- 标记修改
            socket.emit('signGrid', { ...props.mine, type: props.type, flag: true })
        }
    }
}
</script>

<template>
    <div class="mine-item-box" @mousedown="checkGrid" @contextmenu.prevent>
        <div class="mine-content">
            <span v-if="!mine.isMine">
                {{ mine.count || '' }}
            </span>
            <i class="iconfont icon-a-dileizhadanzhanzheng" v-else> </i>
        </div>
        <div class="mine-mask" v-if="!mine.isShow"></div>
        <div class="mine-sign" v-if="mine.isSign && !mine.show">标</div>
    </div>
</template>

<style scoped lang="scss">
.mine-item-box {
    width: 20px;
    height: 20px;
    border: 1px solid #efefef;
    position: relative;
    border-radius: 2px;
    overflow: hidden;

    .mine-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 20px;
        text-align: center;
    }

    .mine-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: lightseagreen;
    }

    .mine-sign {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 20px;
        text-align: center;
    }
}
</style>
