class FireParticle {
    constructor(x, y) {
        // espalhamento horizontal maior
        this.x = x + (Math.random() * 120 - 30); 
        // inicia mais acima do boss
        this.y = y - (Math.random() * 50 + 150);   
        // partículas bem maiores
        this.size = Math.random() * 5 ;      
        // sobe mais rápido
        this.speedY = Math.random() * -3 - 1.5;   
        // movimento horizontal mais visível
        this.speedX = Math.random() * 4 - 2;      
        this.alpha = 1;
        // cor laranja inicial
        this.color = `rgba(255, ${Math.floor(Math.random() * 150)}, 0, ${this.alpha})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.015; // desaparece suavemente
        // cor evolui para amarelo conforme sobe
        const green = Math.min(255, 50 + (1 - this.alpha) * 200);
        this.color = `rgba(255, ${Math.floor(green)}, 0, ${this.alpha})`;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default FireParticle;
