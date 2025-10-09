class Projectile {
    constructor(position, velocity, color = 'white') {
        this.position = position;
        this.width = 2;
        this.height = 20;
        this.velocity = velocity;
        this.color = color;
    }

    draw(ctx) {
    ctx.fillStyle = this.color; // CORRIGIDO: Use a cor da propriedade da classe
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
}

      update() {
        this.position.y += this.velocity;
    }

}

export default Projectile;