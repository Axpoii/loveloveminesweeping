const e = require('cors');
const experss = require('express')
const app = experss()
const http = require('http');
const server = http.createServer(app);
// const { initGame } = require('./game/mine')


const { Server } = require("socket.io");
const io = new Server(server, { transports: ['websocket'] });

class Mine {
    Users
    Visitors
    mapLen = 27
    mineLen = 120
    constructor() {
        this.Users = []
        this.Visitors = []
        this.loveMode = 0
    }
    initGame(love = false) {
        this.Users.forEach(item => {
            item.mineLen = this.mineLen
            item.status = 'playing'
            if (love) {
                item.mineMap = item.isLove ? this.generateMineMap() : this.loveloveGenerateMineMap()
            } else[
                item.mineMap = this.generateMineMap()
            ]
        })
        return this.Users
    }
    generateMineMap() {
        let arr = new Array(this.mapLen).fill(1).map((item1, x) =>
            new Array(this.mapLen).fill(1).map((item2, y) => ({
                isShow: false,
                isMine: false,
                isSign: false,
                count: 0,
                x,
                y,
            }))
        )

        // 装填炸弹
        for (let i = 1; i <= this.mineLen; i++) {
            while (true) {
                const x = parseInt(Math.random() * this.mapLen)
                const y = parseInt(Math.random() * this.mapLen)
                if (!arr[x][y].isMine) {
                    arr[x][y].isMine = true
                    break
                }
            }
        }

        // 计算九宫格炸弹数量
        arr.forEach((item, x) => {
            item.forEach((item2, y) => {
                const computedIndex = this.getValidGridIndex(x, y, this.mapLen, this.mapLen)
                let count = 0
                computedIndex.forEach((grid) => {
                    arr[grid[0]][grid[1]].isMine && count++
                })
                item2.count = count
            })
        })

        return arr
    }
    loveloveGenerateMineMap() {
        let arr = new Array(this.mapLen).fill(1).map((item1, x) =>
            new Array(this.mapLen).fill(1).map((item2, y) => ({
                isShow: false,
                isMine: false,
                isSign: false,
                count: 0,
                x,
                y,
            }))
        )

        const loveMines = [
            [11, 13],
            [10, 12],
            [9, 11],
            [9, 10],
            [10, 9],
            [11, 8],
            [12, 8],
            [13, 8],
            [14, 9],
            [15, 10],
            [16, 11],
            [17, 12],
            [18, 13],
            [17, 14],
            [16, 15],
            [15, 16],
            [14, 17],
            [13, 18],
            [12, 18],
            [11, 18],
            [10, 17],
            [9, 16],
            [9, 15],
            [10, 14],
            [10, 10],
            [10, 11],
            [10, 15],
            [10, 16],
            [11, 9],
            [11, 10],
            [11, 11],
            [11, 12],
            [11, 14],
            [11, 15],
            [11, 16],
            [11, 17],
            [12, 9],
            [12, 10],
            [12, 11],
            [12, 12],
            [12, 13],
            [12, 14],
            [12, 15],
            [12, 16],
            [12, 17],
            [13, 9],
            [13, 10],
            [13, 11],
            [13, 12],
            [13, 13],
            [13, 14],
            [13, 15],
            [13, 16],
            [13, 17],
            [14, 10],
            [14, 11],
            [14, 12],
            [14, 13],
            [14, 14],
            [14, 15],
            [14, 16],
            [15, 11],
            [15, 12],
            [15, 13],
            [15, 14],
            [15, 15],
            [16, 12],
            [16, 13],
            [16, 14],
            [17, 13]
        ]
        // const loveMines = [
        //     [11, 13],
        //     [10, 12],
        //     [10, 11],
        //     [11, 10],
        //     [12, 10],
        //     [13, 11],
        //     [14, 12],
        //     [15, 13],
        //     [14, 14],
        //     [13, 15],
        //     [12, 16],
        //     [11, 16],
        //     [10, 15],
        //     [10, 14],
        //     [11, 12],
        //     [11, 11],
        //     [11, 14],
        //     [11, 15],
        //     [12, 11],
        //     [12, 12],
        //     [12, 13],
        //     [12, 14],
        //     [12, 15],
        //     [13, 12],
        //     [13, 13],
        //     [13, 14],
        //     [14, 13],
        //     [9, 11],
        //     [10, 10],
        //     [11, 9],
        //     [12, 9],
        //     [13, 10],
        //     [14, 11],
        //     [15, 12],
        //     [16, 13],
        //     [15, 14],
        //     [14, 15],
        //     [13, 16],
        //     [12, 17],
        //     [11, 17],
        //     [10, 16],
        //     [9, 15]
        // ]

        loveMines.forEach(item => {
            arr[item[0]][item[1]].isMine = true
            arr[item[0]][item[1]].isLove = true
        })

        // 装填炸弹
        for (let i = 1; i <= (this.mineLen - loveMines.length); i++) {
            while (true) {
                const x = parseInt(Math.random() * this.mapLen)
                const y = parseInt(Math.random() * this.mapLen)
                if (this.isRightArea(x, y)) {
                    if (!arr[x][y].isMine) {
                        arr[x][y].isMine = true
                        break
                    }
                }
            }
        }

        // 计算九宫格炸弹数量
        arr.forEach((item, x) => {
            item.forEach((item2, y) => {
                const computedIndex = this.getValidGridIndex(x, y, this.mapLen, this.mapLen)
                let count = 0
                computedIndex.forEach((grid) => {
                    arr[grid[0]][grid[1]].isMine && count++
                })
                item2.count = count
            })
        })

        return arr
    }
    isRightArea(x, y, minX = 7, maxX = 19, minY = 8, maxY = 19) {
        return (x < minX) ||
            (x > maxX) ||
            (y < minY) ||
            (y > maxY) ||
            (x > minX && x < maxX && (y < minY || y > maxY)) ||
            (y > minY && y < maxY && (x < minX || x > maxX))
    }
    getValidGridIndex(x, y, xMax = 27, yMax = 27) {
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
    getAlongGridIndex(x, y, xMax = 27, yMax = 27) {
        return [
            [x, y - 1],
            [x - 1, y],
            [x + 1, y],
            [x, y + 1],
        ].filter((item) => {
            return item[0] >= 0 && item[0] < xMax && item[1] >= 0 && item[1] < yMax
        })
    }
    sweepGrid(index, target) {
        const { x, y, isSign, isMine } = target
        if (isSign) {
            this.signGrid(index, target)
        } else {
            this.Users[index].mineMap[x][y].isShow = true
            if (isMine) {
                return false
            } else {
                this.checkMore(index, target)
            }
        }
        return true
    }
    sweepAroundGrid(index, target) {
        const aroundGrid = this.getValidGridIndex(target.x, target.y, this.mapLen, this.mapLen).map(item => this.Users[index].mineMap[item[0]][item[1]])
        const signCount = aroundGrid.filter(item => item.isSign).length
        const mineLen = aroundGrid.filter(item => item.isMine).length
        if (signCount < mineLen) {
            // 不满足快捷扫雷条件
            return {
                type: 'flash',
                data: aroundGrid.filter(item => !item.isSign)
            }
        } else {
            if (signCount > mineLen) {
                // 标记数 大于 雷数
                return {
                    type: 'bomb',
                    data: []
                }
            } else {
                const signCorrectCount = aroundGrid.filter(item => (item.isMine && item.isSign)).length
                if (signCorrectCount === mineLen) {
                    // const t = this.Users[index].mineMap
                    aroundGrid.forEach(item => {
                        if (!item.isMine) {
                            this.Users[index].mineMap[item.x][item.y].isShow = true
                            this.checkMore(index, item)
                        }
                    })
                    return {
                        type: 'sweep',
                        data: this.Users[index].mineMap
                    }
                } else {
                    return {
                        type: 'bomb',
                        data: []
                    }
                }
            }
        }
    }
    signGrid(index, target) {
        const { x, y } = target
        const flag = this.Users[index].mineMap[x][y].isSign
        if (!flag) {
            this.Users[index].mineMap[x][y].isSign = true
            this.Users[index].signCount++
            if (this.Users[index].mineMap[x][y].isMine) this.Users[index].signCorrectCount++
        } else {
            this.Users[index].mineMap[x][y].isSign = false
            this.Users[index].signCount--
            if (this.Users[index].mineMap[x][y].isMine) this.Users[index].signCorrectCount--
        }
        if (this.Users[index].signCorrectCount === this.mineLen) {
            let showCount = 0
            this.Users[index].mineMap.forEach(item => {
                item.forEach(item2 => {
                    if (item2.isShow) showCount++
                })
            })
            return showCount === (this.mapLen * this.mapLen - this.mineLen)
        }
        return false
    }
    checkMore(index, { x, y }) {
        // 只有当点击到空白区域时 才触发递归搜查
        const target = this.Users[index].mineMap
        if (target[x][y].count === 0) {
            const computedIndex = this.getValidGridIndex(x, y, this.mapLen, this.mapLen)
            computedIndex.forEach((item) => {
                const iX = item[0]
                const iY = item[1]
                if (target[iX][iY].count === 0 && !target[iX][iY].isShow && !target[iX][iY].isMine) {
                    target[iX][iY].isShow = true
                    this.checkMore(index, { x: iX, y: iY })
                }
                if (target[iX][iY].count > 0 && !target[iX][iY].isMine) {
                    target[iX][iY].isShow = true
                }
            })
        }
    }
}

const loveMine = new Mine()

io.on('connection', (socket) => {
    console.log(`user join with ${socket.id}`);
    io.sockets.emit('init', loveMine.Users)

    socket.on('checkGrid', (data) => {
        socket.broadcast.emit('userCheckGrid', {
            ...data
        });
    })

    socket.on('join', (data) => {
        let user = loveMine.Users.find(item => item.id === socket.id)
        if (data.mineLen && parseInt(data.mineLen) > 0) {
            loveMine.mineLen = parseInt(data.mineLen)
        }
        if (data.mapLen && parseInt(data.mapLen) > 0) {
            loveMine.mapLen = parseInt(data.mapLen)
        }
        if (!user) {
            user = {
                player: true,
                id: socket.id,
                isReady: false,
                sit: data.sit,
                mineMap: [],
                mineLen: 0,
                signCount: 0,
                signCorrectCount: 0,
                isLove: data.isLove,
                status: 'ready'
            }
            loveMine.Users.push(user)
        }
        io.emit('joinPlayer', user)
        if (loveMine.Users.length === 2) {
            const isLoveMode = loveMine.Users.filter(item => item.isLove).length > 0
            loveMine.loveMode = isLoveMode ? 1 : 0
            // loveMine.mineLen = isLoveMode ? 90 : 120
            const users = loveMine.initGame(isLoveMode)
            setTimeout(() => {
                io.emit('setLoveMode', { mode: isLoveMode ? 1 : 0 })
                io.emit('startGame', users)
            }, 0);
        }
    })

    socket.on('sweep', data => {
        const { type, target, sit } = data
        const index = loveMine.Users.findIndex(item => item.id === socket.id)
        if (loveMine.Users[index].sit && sit !== loveMine.Users[index].sit) {
            socket.emit('reject')
            return
        }
        if (loveMine.Users[index].status !== 'playing') {
            return
        }
        switch (type) {
            case 'sweep': {
                const res = loveMine.sweepGrid(index, target)
                if (res) {
                    io.emit('finishSweep', { sit, map: loveMine.Users[index].mineMap, signCount: loveMine.Users[index].signCount, signCorrectCount: loveMine.Users[index].signCorrectCount })
                } else {
                    loveMine.Users[index].status = 'bomb'
                    io.emit('bomb', { sit, map: loveMine.Users[index].mineMap, signCount: loveMine.Users[index].signCount, signCorrectCount: loveMine.Users[index].signCorrectCount })
                }
                break;
            }
            case 'sweepAround': {
                const { type, data } = loveMine.sweepAroundGrid(index, target)
                if (type === 'flash') {
                    io.emit('flash', { sit, map: data })
                }
                if (type === 'sweep') {
                    io.emit('finishSweep', { sit, map: data, signCount: loveMine.Users[index].signCount, signCorrectCount: loveMine.Users[index].signCorrectCount })
                }
                if (type === 'bomb') {
                    loveMine.Users[index].status = 'bomb'
                    io.emit('bomb', { sit, map: loveMine.Users[index].mineMap })
                }
                break;
            }
            case 'sign': {
                const res = loveMine.signGrid(index, target)
                if (!res) {
                    io.emit('finishSweep', { sit, map: loveMine.Users[index].mineMap, signCount: loveMine.Users[index].signCount, signCorrectCount: loveMine.Users[index].signCorrectCount })
                } else {
                    loveMine.Users[index].status = 'finishGame'
                    io.emit('finishGame', { sit, map: loveMine.Users[index].mineMap, loveMode: loveMine.loveMode, signCount: loveMine.Users[index].signCount })
                }
                break;
            }
        }
    })

    socket.on('love', data => {
        io.emit('love')
    })

    // 退出
    socket.on('disconnect', () => {
        const index = loveMine.Users.findIndex(item => item.id === socket.id)
        if (index >= 0) {
            loveMine.Users.splice(index, 1)
            socket.disconnect(true)
            io.emit('gameRefresh')
        }
    })
});


server.listen(2222, () => {
    console.log('server started on port 2222');
})




