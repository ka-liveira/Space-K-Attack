import Projectile from "./Projectile.js";
import { PATH_BOSS_IMAGE } from "../utils/constants.js"; // Certifique-se que este caminho está correto

class Boss {
    constructor(canvasWidth, canvasHeight) {
        // --- Dimensões e Posição ---
        // Mesmo que a imagem seja 25x25, vamos desenhá-la maior para que o chefe seja imponente.
        // O drawImage vai esticar a imagem para este tamanho.
        this.width = 150;
        this.height = 100;

        this.position = {
            x: canvasWidth / 2 - this.width / 2, // Começa centralizado no topo
            y: 150
        };

        // Referência às dimensões do canvas para a lógica de movimento
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // --- Atributos do Chefe ---
        this.health = 100; // Vida inicial
        this.alive = true;
        this.velocity = { x: 3, y: 2 }; // Velocidade de movimento

        // --- Lógica de Ataque ---
        this.attackCooldown = 60; // Atira a cada 60 frames (1 segundo a 60FPS)
        this.framesCounter = 0;

        // --- Carregamento da Imagem ---
        this.image = this._getImage(PATH_BOSS_IMAGE);
    }

    _getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx) {
        if (!this.alive) return; // Não desenha o chefe se ele já foi derrotado

        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(projectiles) {
        if (!this.alive) return;

        // 1. Movimento Horizontal (Patrulha)
        this.position.x += this.velocity.x;

        // Inverte a direção se atingir as bordas da tela
        if (this.position.x <= 0 || this.position.x + this.width >= this.canvasWidth) {
            this.velocity.x *= -1; // Inverte a direção
        }

        // 2. Lógica de Ataque
        this.framesCounter++;

        if (this.framesCounter >= this.attackCooldown) {
            this.shoot(projectiles); // Atira
            this.framesCounter = 0; // Reinicia o contador para o próximo tiro
        }
    }

    shoot(projectiles) {
        const p = new Projectile(
            {
                x: this.position.x + this.width / 2 - 5, // Posição x do tiro (centro do boss)
                y: this.position.y + this.height         // Posição y do tiro (base do boss)
            },
            7 // Velocidade do projétil (para baixo)
        );
        projectiles.push(p);
    }

    takeDamage(damageAmount) {
        this.health -= damageAmount;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            console.log("CHEFE DERROTADO!");
            // Aqui você pode adicionar lógica para o que acontece quando o chefe morre
            // (ex: tocar um som de explosão, dar pontos extras, etc.)
        }
    }

     hit(projectile) {
        // Lógica de colisão de retângulo simples
        return (
            projectile.position.y <= this.position.y + this.height &&
            projectile.position.y + projectile.height >= this.position.y &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.x + projectile.width >= this.position.x
        );
    }
}

export default Boss;