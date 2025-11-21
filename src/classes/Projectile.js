class Projectile {
    constructor(position, velocity, color = 'white') { // inicializa projétil
        this.position = position; // posição X e Y inicial
        this.width = 2; // largura do projétil
        this.height = 20; // altura do projétil
        
        // velocity pode ser número (só Y) ou objeto {dx, dy} para projéteis inclinados
        if (typeof velocity === 'number') {
            this.velocity = { dx: 0, dy: velocity }; // movimento apenas vertical
        } else {
            this.velocity = velocity; // movimento vetorial {dx, dy}
        }
        this.color = color; // cor do projétil
    }

    draw(ctx) { // renderiza o projétil
        ctx.fillStyle = this.color; // define cor
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // desenha retângulo
    }

    update() { // atualiza posição do projétil
        this.position.x += this.velocity.dx; // move horizontalmente
        this.position.y += this.velocity.dy; // move verticalmente
    }
}

export default Projectile;