<script setup>
import MineItem from '@/components/mine-item.vue'
import { onMounted, reactive } from 'vue'
import { socket } from '@/utils/socket'

socket.on('userCheckGrid', (data) => {
    if (props.id === data.type) {
        // checkMore(data)
    }
})

const props = defineProps({
    id: {
        type: String,
        default: '',
    },
})

const mapLen = 26
const mineList = reactive({
    list: [],
})

const generateMineMap = () => {
    let arr = new Array(mapLen).fill(1).map((item1, x) =>
        new Array(mapLen).fill(1).map((item2, y) => ({
            isShow: false,
            isMine: false,
            isSign: false,
            count: 0,
            x,
            y,
        }))
    )

    // 装填炸弹
    for (let i = 1; i <= 70; i++) {
        while (true) {
            const x = parseInt(Math.random() * mapLen)
            const y = parseInt(Math.random() * mapLen)
            if (!arr[x][y].isMine) {
                arr[x][y].isMine = true
                break
            }
        }
    }

    // 计算九宫格炸弹数量
    arr.forEach((item, x) => {
        item.forEach((item2, y) => {
            const computedIndex = getValidGridIndex(x, y, mapLen, mapLen)
            let count = 0
            computedIndex.forEach((grid) => {
                arr[grid[0]][grid[1]].isMine && count++
            })
            item2.count = count
        })
    })

    console.log(arr)
    mineList.list = arr
}

const getValidGridIndex = (x, y, xMax = 26, yMax = 26) => {
    return [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
    ].filter((item) => {
        return item[0] >= 0 && item[0] < xMax && item[1] >= 0 && item[1] < yMax
    })
}

const getAlongGridIndex = (x, y, xMax = 26, yMax = 26) => {
    return [
        [x, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x, y + 1],
    ].filter((item) => {
        return item[0] >= 0 && item[0] < xMax && item[1] >= 0 && item[1] < yMax
    })
}

const gameOver = () => {
    alert('游戏结束, 你输了')
    mineList.list.forEach((item) => {
        item.forEach((item2) => {
            item2.isShow = true
        })
    })
}

const checkMore = ({ x, y }) => {
    // 只有当点击到空白区域时 才触发递归搜查
    if (mineList.list[x][y].count === 0) {
        const computedIndex = getValidGridIndex(x, y, mapLen, mapLen)
        computedIndex.forEach((item) => {
            const iX = item[0]
            const iY = item[1]
            if (mineList.list[iX][iY].count === 0 && !mineList.list[iX][iY].isShow && !mineList.list[iX][iY].isMine) {
                mineList.list[iX][iY].isShow = true
                checkMore({ x: iX, y: iY })
            }
            if (mineList.list[iX][iY].count > 0 && !mineList.list[iX][iY].isMine) {
                mineList.list[iX][iY].isShow = true
            }
        })
    }
}

onMounted(() => {
    generateMineMap()
})
</script>

<template>
    <div class="mine-container">
        <div class="map">
            <div class="mine-row" v-for="(row, rowIndex) in mineList.list" :key="rowIndex">
                <div class="mine-item" v-for="(item, itemIndex) in row" :key="itemIndex">
                    <MineItem
                        :type="id"
                        :mine="item"
                        v-model:show="item.isShow"
                        v-model:sign="item.isSign"
                        @gameOver="gameOver"
                        @checkMore="checkMore"
                    ></MineItem>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.mine-container {
    .map {
        .mine-row {
            display: flex;
            .mine-item {
            }
        }
    }
}
</style>
