import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";
import PowerUp from "./PowerUp.js";

export const POWER_DROP_RATE = 0.25; // chance de 25% de dropar power-up

class Invader {
    constructor(position, velocity) { // inicializa invasor com posição e velocidade
        this.position = position; // posição X e Y do invasor
        this.velocity = velocity; // velocidade de movimento

        const scale = 2; // escala de tamanho do sprite
        const originalWidth = 50; // largura base da imagem
        const originalHeight = 38; // altura base da imagem

        this.width = originalWidth * scale; // largura final renderizada
        this.height = originalHeight * scale; // altura final renderizada
        
        this.image = this.getImage(PATH_INVADER_IMAGE); // sprite do invasor
    }

    getImage(path) { // carrega imagem do invasor
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft() { // move invasor para esquerda
        this.position.x -= this.velocity;
    }

    moveRight() { // move invasor para direita
        this.position.x += this.velocity;
    }

    moveDown() { // move invasor para baixo
        this.position.y += this.height;
    }

    incrementVelocity(boost) { // aumenta velocidade do invasor
        this.velocity += boost;
    }

    draw(ctx) { // renderiza o invasor na tela
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    shoot(Projectiles) { // dispara projétil para baixo
        const p = new Projectile(
            { 
                x: this.position.x + this.width / 2 - 1, // posição X centralizada
                y: this.position.y + this.height // posição Y abaixo do invasor
            },
            10, // velocidade do projétil
            '#ff4040' // cor vermelha
        );
        Projectiles.push(p); // adiciona projétil ao array
    }

    hit(projectile) { // detecta colisão com projétil
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }

    dropPower(player) { // decide se dropa power-up ao morrer
        const chance = Math.random(); // número aleatório entre 0 e 1
        if (chance <= POWER_DROP_RATE) {
            const power = new PowerUp({
                x: this.position.x + this.width / 2, // posição X centralizada
                y: this.position.y + this.height, // posição Y abaixo do invasor
            }, player);

            return power; // retorna power-up criado
        }
        return null; // não dropa nada
    }
}

export default Invader;