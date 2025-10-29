import { POWER_TYPES, POWER_IMAGES } from "../utils/constants.js";

const POWER_SIZES = {
    speed: 45,
    double_shot: 50,
    shield: 60
};

class PowerUp {
    constructor(position) {
        this.position = position;
        this.velocity = { x: 0, y: 3 };

        this.type = POWER_TYPES[Math.floor(Math.random() * POWER_TYPES.length)];

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
        if (!this.image.complete) return; // espera carregar
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

export default PowerUp;
