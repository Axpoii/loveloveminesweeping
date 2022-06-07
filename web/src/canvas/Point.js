export default class Point {
    constructor(x, y, r, color = null) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color ? color : `rgb(${parseInt(Math.random() * 240) + 9},${parseInt(Math.random() * 220) + 18},203)`;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.r -= 0.2;
        return this
    }
}