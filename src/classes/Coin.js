export default class Coin {
    constructor(game, x, y, value) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.value = value; // Valor da moeda (1, 25, 50...)
        this.width = 20; // Tamanho visual
        this.height = 20;
        this.speedY = 2; // Velocidade de queda
        this.markedForDeletion = false;
        
        // Se tiver imagem, carregue aqui. Por enquanto faremos um círculo amarelo
    }

    update() {
        this.y += this.speedY;

        // Se sair da tela, remove
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }

        // Checar colisão com o Player (Coleta)
        if (this.checkCollision(this.game.player)) {
            this.markedForDeletion = true;
            this.game.addScore(this.value); // Vamos criar essa função no Game
        }
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.arc(this.x + this.width/2, this.y + this.height/2, 10, 0, Math.PI * 2);
        context.fillStyle = 'gold';
        context.fill();
        context.strokeStyle = 'orange';
        context.stroke();
        
        // Texto do valor (opcional)
        context.fillStyle = 'black';
        context.font = '10px Arial';
        context.fillText(this.value, this.x + 5, this.y + 14);
        context.restore();
    }

    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}