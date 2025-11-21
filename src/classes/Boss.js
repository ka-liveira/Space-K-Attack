import Projectile from "./Projectile.js";
import FireParticle from "./FireParticle.js";

import { PATH_BOSS_IMAGE } from "../utils/constants.js";


class Boss {
    constructor(canvasWidth, canvasHeight, initialHealth) {
        // --- Dimensões e Posição ---
        this.scale = 5;
        this.baseWidth = 64;
        this.baseHeight = 64;

        this.width = this.baseWidth * this.scale;
        this.height = this.baseHeight * this.scale;

        this.hitboxPadding = {
            x: 16, // 16 pixels de margem na horizontal
            y: 17  // 17 pixels de margem na vertical
        };

        this.position = {
            x: canvasWidth / 2 - this.width / 2, // Começa centralizado no topo
            y: 150
        };

        // Referência às dimensões do canvas para a lógica de movimento
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // --- Atributos do Chefe ---
        this.health = initialHealth; // Vida inicial
        this.maxHealth = initialHealth; //vida máxima
        this.alive = true;
        this.velocity = { x: 3, y: 2 }; // Velocidade de movimento

        // --- Lógica de Ataque ---
        this.attackCooldown = 60; // Atira a cada 60 frames (1 segundo a 60FPS)
        this.framesCounter = 0;

        // --- [NOVO] Atributos do Modo Fúria ---
        this.enraged = false;       // Começa calmo
        this.fireParticles = [];  // Array para as partículas de fogo

        // --- Carregamento da Imagem ---
        this.image = this._getImage(PATH_BOSS_IMAGE);
    }

    _getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx) {
        if (!this.alive) return;

        if (this.enraged) {
            // Cria novas partículas
            for (let i = 0; i < 3; i++) {
                // Certifique-se que a classe 'FireParticle' existe
                this.fireParticles.push(new FireParticle(this.position.x + this.width / 2, this.position.y + this.height));
            }

            // Atualiza e desenha partículas
            for (let i = this.fireParticles.length - 1; i >= 0; i--) {
                const p = this.fireParticles[i];
                p.update();
                p.draw(ctx);
                if (p.alpha <= 0) this.fireParticles.splice(i, 1); // remove partículas "mortas"
            }
        }

        // Desenha o Boss na frente
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(projectiles) {
        if (!this.alive) return;

        // 1. Movimento Horizontal (Patrulha)
        this.position.x += this.velocity.x;

        // Lógica de Movimento em Ciclo:
        // Direita -> Desce | Esquerda -> Sobe

        const verticalStep = 80; // Tamanho da "linha" que ele sobe/desce

        // Borda Direita
        if (this.position.x + this.width >= this.canvasWidth) {
            this.velocity.x = -Math.abs(this.velocity.x); // Força direção para esquerda
            this.position.x = this.canvasWidth - this.width; // Corrige para não ficar preso fora da tela
            this.position.y += verticalStep; // Desce uma linha
        }
        // Borda Esquerda
        else if (this.position.x <= 0) {
            this.velocity.x = Math.abs(this.velocity.x); // Força direção para direita
            this.position.x = 0; // Corrige para não ficar preso fora da tela
            this.position.y -= verticalStep; // Sobe uma linha (volta à posição original)
        }

        // 2. Lógica de Ataque
        this.framesCounter++;

        if (this.framesCounter >= this.attackCooldown) {
            this.shoot(projectiles); // Atira
            this.framesCounter = 0; // Reinicia o contador para o próximo tiro
        }
    }

    shoot(projectiles) {
        // [CORRIGIDO] Define o ponto de origem do tiro
        const shootX = this.position.x + this.width / 2 - 5;
        const shootY = this.position.y + this.height / 1.5;

        // Tiro normal (verde) - dispara sempre
        const p = new Projectile(
            {
                x: shootX,
                y: shootY
            },
            7, // Velocidade do projétil (para baixo)
            '#ADFF2F'
        );
        projectiles.push(p);

        // [CORRIGIDO] Tiro de fúria (vermelho) - dispara ADICIONALMENTE
        if (this.enraged) {
            const types = ['normal', 'spread'];
            const type = types[Math.floor(Math.random() * types.length)];

            if (type === 'normal') {
                const pRage = new Projectile(
                    { x: shootX, y: shootY + 20 }, // +20 para não sobrepor
                    7,
                    '#ff0000' // Cor vermelha
                );
                projectiles.push(pRage);
            }
            else if (type === 'spread') {
                const numProjectiles = 5;
                const spreadAngle = 60;
                const startAngle = -spreadAngle / 2;

                for (let i = 0; i < numProjectiles; i++) {
                    const angle = startAngle + (spreadAngle / (numProjectiles - 1)) * i;
                    const rad = angle * (Math.PI / 180);

                    // [CORRIGIDO] Usando shootX/shootY em vez de centerX/centerY
                    // Assume que seu Projectile.js aceita um objeto de velocidade {dx, dy}
                    const pSpread = new Projectile(
                        { x: shootX, y: shootY },
                        { dx: Math.sin(rad) * 7, dy: Math.cos(rad) * 7 },
                        '#ff0000' // Cor vermelha
                    );
                    projectiles.push(pSpread);
                }
            }
        }
    }

    takeDamage(damageAmount) {
        // Só toma dano se estiver vivo
        if (!this.alive) return;

        this.health -= damageAmount;

        // [CORREÇÃO DE LÓGICA]
        // 1. Checa se deve entrar em fúria (com 50% de vida)
        if (!this.enraged && this.health <= this.maxHealth / 2) {
            this.enterRageMode();
        }

        // 2. DEPOIS, checa se morreu
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    enterRageMode() {
        this.enraged = true;
        this.velocity.x *= 1.5;   // Fica mais rápido horizontalmente
        this.attackCooldown /= 2; // Atira 2x mais rápido
        // Não alteramos position.x ou position.y aqui, garantindo que não haja spawn/teleporte.
    }

    hit(projectile) {
        // Calcula o padding dinamicamente baseado na escala
        const paddingX = this.hitboxPadding.x * this.scale;
        const paddingY = this.hitboxPadding.y * this.scale;

        // O resto do cálculo da hitbox continua igual
        const hitboxX = this.position.x + paddingX;
        const hitboxY = this.position.y + paddingY;
        const hitboxWidth = this.width - (paddingX * 2);
        const hitboxHeight = this.height - (paddingY * 2);

        // Lógica de colisão de retângulo simples
        return (
            projectile.position.y <= hitboxY + hitboxHeight &&
            projectile.position.y + projectile.height >= hitboxY &&
            projectile.position.x <= hitboxX + hitboxWidth &&
            projectile.position.x + projectile.width >= hitboxX
        );
    }

      resize(newWidth, newHeight) {
        this.canvasWidth = newWidth;
        this.canvasHeight = newHeight;
    }
}

export default Boss;