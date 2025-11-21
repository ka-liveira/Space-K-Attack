class Particle {
    constructor(position, velocity, radius, color) { // inicializa partícula de explosão
        this.position = position; // posição X e Y
        this.velocity = velocity; // velocidade de movimento
        this.radius = radius; // tamanho da partícula
        this.color = color; // cor da partícula
        this.opacity = 1; // opacidade inicial (totalmente visível)
    }

    draw(ctx) { // renderiza a partícula
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.opacity; // define transparência
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // desenha círculo
        ctx.fillStyle = this.color; // define cor
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update() { // atualiza posição e opacidade
        this.position.x += this.velocity.x; // move horizontalmente
        this.position.y += this.velocity.y; // move verticalmente
        this.opacity = this.opacity - 0.008 <= 0 ? 0 : this.opacity - 0.008; // reduz opacidade gradualmente
    }
}

export default Particle;
