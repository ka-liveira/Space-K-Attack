// --- FireParticle.js ---
class FireParticle {
    constructor(x, y) {
        this.x = x + (Math.random() * 120 - 30); // posição X com espalhamento horizontal aleatório
        this.y = y - (Math.random() * 50 + 150); // posição Y acima do boss   
        this.size = Math.random() * 5; // tamanho aleatório da partícula      
        this.speedY = Math.random() * -3 - 1.5; // velocidade vertical (sobe)   
        this.speedX = Math.random() * 4 - 2; // velocidade horizontal aleatória      
        this.alpha = 1; // opacidade inicial (totalmente visível)
        this.color = `rgba(255, ${Math.floor(Math.random() * 150)}, 0, ${this.alpha})`; // cor laranja inicial
    }

    update() { // atualiza posição e aparência da partícula
        this.x += this.speedX; // move horizontalmente
        this.y += this.speedY; // move verticalmente
        this.alpha -= 0.015; // reduz opacidade gradualmente
        const green = Math.min(255, 50 + (1 - this.alpha) * 200); // calcula componente verde
        this.color = `rgba(255, ${Math.floor(green)}, 0, ${this.alpha})`; // transição de laranja para amarelo
    }

    draw(ctx) { // renderiza a partícula
        ctx.fillStyle = this.color; // define cor
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // desenha círculo
        ctx.fill();
    }
}

export default FireParticle;