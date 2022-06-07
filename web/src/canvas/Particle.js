export default class Point {
    constructor({ x, y, r, color, endX, endY }) {
        this.x = x
        this.y = y
        this.r = r
        this.endX = endX
        this.endY = endY
        this.dx = (Math.random() - 0.5) * 4
        this.dy = (Math.random() - 0.5) * 4
        this.color = color || `rgba(${parseInt(Math.random() * 240) + 9},${parseInt(Math.random() * 220) + 18},203)`
    }

    render(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,0,0,0)`
        ctx.fill()
    }

    update() {
        this.x += ((this.endX - this.x) / 20)
        this.y += ((this.endY - this.y) / 20)
        return {
            x: this.x,
            y: this.y,
            isArrive: this.endX - this.x < 1 && this.endY - this.y < 1
        }
    }

}
