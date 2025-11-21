import { POWER_TYPES, POWER_IMAGES } from "../utils/constants.js";

const POWER_SIZES = {
    speed: 45, // tamanho do power-up de velocidade
    double_shot: 50, // tamanho do power-up de tiro duplo
    shield: 60, // tamanho do power-up de escudo
    extra_life: 45 // tamanho do power-up de vida extra
};

class PowerUp {
    constructor(position, player) { // inicializa power-up
        this.position = position; // posição X e Y inicial
        this.velocity = { x: 0, y: 3 }; // velocidade de queda

        const probabilities = {
            speed: 0.4, // 40% chance de velocidade
            double_shot: 0.25, // 25% chance de tiro duplo
            shield: 0.25, // 25% chance de escudo
            extra_life: 0.1 // 10% chance de vida extra
        };

        const getValidType = () => { // sorteia tipo válido de power-up
            const rand = Math.random(); // número aleatório
            let sum = 0;

            for (const [type, chance] of Object.entries(probabilities)) {
                sum += chance;
                if (rand < sum) {
                    if (type === "extra_life" && player.lives >= 3) { // evita vida extra se já tem 3 vidas
                        return getValidType(); // sorteia novamente
                    }
                    return type;
                }
            }
        };

        this.type = getValidType(); // tipo do power-up
        this.size = POWER_SIZES[this.type] || 30; // tamanho baseado no tipo

        const imagePath = POWER_IMAGES[this.type]; // caminho da imagem
        if (!imagePath) {
            throw new Error(`PowerUp type "${this.type}" não possui imagem definida!`);
        }

        this.image = new Image(); // sprite do power-up
        this.image.src = imagePath;
    }

    draw(ctx) { // renderiza o power-up
        if (!this.image.complete) return;
        ctx.drawImage(
            this.image,
            this.position.x - this.size / 2, // centraliza horizontalmente
            this.position.y - this.size / 2, // centraliza verticalmente
            this.size,
            this.size
        );
    }

    update() { // atualiza posição (cai)
        this.position.y += this.velocity.y;
    }

    collectedBy(player) { // detecta colisão com jogador
        return (
            this.position.x >= player.position.x &&
            this.position.x <= player.position.x + player.width &&
            this.position.y >= player.position.y &&
            this.position.y <= player.position.y + player.height
        );
    }
}

export default PowerUp;