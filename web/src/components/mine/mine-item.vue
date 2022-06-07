<script setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['handleSweeping'])

const isShowMask = ref(true)

const props = defineProps({
    animate: {
        type: Boolean,
        default: false,
    },
    mine: {
        type: Object,
        default: () => {},
    },
})

const MIMECOUNTTYPE = {
    0: '#fff',
    1: '#a0c1d6',
    2: '#8fd36a',
    3: '#4acccf',
    4: '#3eb0b6',
    5: '#72569b',
    6: '#f4607b',
    7: '#ea425b',
    8: '#4e2770',
}

const mineCount = (count) => {
    return MIMECOUNTTYPE[count]
}

watch(
    () => props.mine.isShow,
    (val) => {
        if (val) {
            setTimeout(() => {
                isShowMask.value = false
            }, 150)
        }
    }
)

const checkGrid = (e) => {
    if (e.button === 0) {
        if (props.mine.isSign) {
            emits('handleSweeping', {
                type: 'sign',
                target: props.mine,
            })
        } else {
            emits('handleSweeping', {
                type: props.mine.isShow ? 'sweepAround' : 'sweep',
                target: props.mine,
            })
        }
    }
    if (e.button === 2) {
        if (props.mine.isShow) return
        emits('handleSweeping', {
            type: 'sign',
            target: props.mine,
        })
    }
}
</script>

<template>
    <div
        class="mine-item-box"
        :class="{ isShow: mine.isShow, pulse: mine.isLove, love: animate && mine.isLove }"
        @mousedown="checkGrid"
        @contextmenu.prevent
        :data-x="mine.x"
        :data-y="mine.y"
    >
        <template v-if="!animate">
            <div class="mine-content">
                <template v-if="mine.isShow">
                    <span v-if="!mine.isMine">
                        <span class="count" :style="{ color: mineCount(mine.count) }">
                            {{ mine.count || '' }}
                        </span>
                    </span>
                    <i class="iconfont icon-a-dileizhadanzhanzheng" v-else style="color: gray"> </i>
                </template>
                <span v-else></span>
            </div>
            <div class="mine-mask" :class="{ hide: mine.isShow, sign: mine.isSign, love: mine.isLove, flash: mine.flash }" v-if="isShowMask"></div>
            <div class="mine-sign" v-if="mine.isSign && isShowMask">!</div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.mine-item-box {
    width: 1.5rem;
    height: 1.5rem;
    position: relative;
    border-radius: 2px;
    overflow: hidden;
    background-color: #e5ebf5;
    box-shadow: 1px 1px 2px #c8d0e7, -1px -1px 2px #fff;
    margin: 0 4px 4px 0;

    &.love {
        background-color: lightcoral;
    }

    &.isShow {
        box-shadow: inset 1px 1px 2px #c8d0e7, inset -1px -1px 2px #fff;
    }

    .mine-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 1.5rem;
        text-align: center;
        font-weight: bold;
        font-size: 1rem;
    }

    .mine-mask {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        height: 100%;
        background-color: #83cdc6;
        transition: all 0.2s linear;
        transform: translate(-50%, -50%);
        // box-shadow: 2px 2px 4px #c8d0e7, -2px -2px 4px #fff;

        &.hide {
            border-radius: 50%;
            width: 2px;
            height: 2px;
        }

        &.sign {
            background-color: lightcoral;
        }

        &.flash {
            background-color: #ebf0ff;
        }
    }

    .mine-sign {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 1.5rem;
        text-align: center;
        color: #fff;
        font-weight: bold;
    }
}
</style>
