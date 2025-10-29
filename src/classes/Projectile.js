class Projectile {
    constructor(position, velocity, color = 'white') {
        this.position = position;
        this.width = 2;
        this.height = 20;
        // velocity pode ser um número (somente y) ou um objeto {dx, dy} para projéteis inclinados
        if (typeof velocity === 'number') {
            this.velocity = { dx: 0, dy: velocity };
        } else {
            this.velocity = velocity; // {dx, dy}
        }
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.position.x += this.velocity.dx;
        this.position.y += this.velocity.dy;
    }
}

export default Projectile;
