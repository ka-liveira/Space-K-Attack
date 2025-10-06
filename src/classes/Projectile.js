class Projectile {
    constructor(position, velocity) {
        this.position = position;
        this.width = 2;
        this.height = 20;
        this.velocity = velocity;
    }

    draw(ctx) {
        ctx.fillStyle = "#2a9cd1ff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

      update() {
        this.position.y += this.velocity;
    }

}

export default Projectile;