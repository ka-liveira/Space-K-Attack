import { POWER_TYPES, POWER_IMAGES } from "../utils/constants.js";

const POWER_SIZES = {
    speed: 45,
    double_shot: 50,
    shield: 60,
    extra_life: 45
};

class PowerUp {
    constructor(position, player) {   // <<< RECEBE O PLAYER
        this.position = position;
        this.velocity = { x: 0, y: 3 };

        const probabilities = {
            speed: 0.4,
            double_shot: 0.25,
            shield: 0.25,
            extra_life: 0.1
        };

        // função para sortear um tipo válido
        const getValidType = () => {
            const rand = Math.random();
            let sum = 0;

            for (const [type, chance] of Object.entries(probabilities)) {
                sum += chance;
                if (rand < sum) {
                    // regra: se sortear vida extra mas o player tem 3 vidas
                    if (type === "extra_life" && player.lives >= 3) {
                        return getValidType(); // sorteia novamente
                    }
                    return type;
                }
            }
        };

        this.type = getValidType();

        // tamanho baseado no tipo
        this.size = POWER_SIZES[this.type] || 30;

        const imagePath = POWER_IMAGES[this.type];
        if (!imagePath) {
            throw new Error(`PowerUp type "${this.type}" não possui imagem definida!`);
        }

        this.image = new Image();
        this.image.src = imagePath;
    }

    draw(ctx) {
        if (!this.image.complete) return;
        ctx.drawImage(
            this.image,
            this.position.x - this.size / 2,
            this.position.y - this.size / 2,
            this.size,
            this.size
        );
    }

    update() {
        this.position.y += this.velocity.y;
    }

    collectedBy(player) {
        return (
            this.position.x >= player.position.x &&
            this.position.x <= player.position.x + player.width &&
            this.position.y >= player.position.y &&
            this.position.y <= player.position.y + player.height
        );
    }
}

export default PowerUp;