import Projectile from "./Projectile.js";
import FireParticle from "./FireParticle.js";

import { PATH_BOSS_IMAGE } from "../utils/constants.js";


class Boss {
    constructor(canvasWidth, canvasHeight, initialHealth) {
        // --- Dimensões e Posição ---
        this.scale = 5; // escala de tamanho do sprite
        this.baseWidth = 64; // largura base do sprite
        this.baseHeight = 64; // altura base do sprite

        this.width = this.baseWidth * this.scale; // largura final renderizada
        this.height = this.baseHeight * this.scale; // altura final renderizada

        this.hitboxPadding = {
            x: 16, // margem horizontal da hitbox
            y: 17  // margem vertical da hitbox
        };

        this.position = {
            x: canvasWidth / 2 - this.width / 2, // posição inicial X (centralizado)
            y: 150 // posição inicial Y (topo da tela)
        };

        this.canvasWidth = canvasWidth; // largura do canvas para limites
        this.canvasHeight = canvasHeight; // altura do canvas para limites

        // --- Atributos do Chefe ---
        this.health = initialHealth; // vida atual do boss
        this.maxHealth = initialHealth; // vida máxima do boss
        this.alive = true; // status de vida do boss
        this.velocity = { x: 3, y: 2 }; // velocidade de movimento horizontal e vertical

        // --- Lógica de Ataque ---
        this.attackCooldown = 60; // intervalo entre ataques em frames
        this.framesCounter = 0; // contador de frames para cooldown

        // --- [NOVO] Atributos do Modo Fúria ---
        this.enraged = false; // indica se está em modo fúria
        this.fireParticles = []; // array de partículas de fogo ao redor do boss

        // --- Carregamento da Imagem ---
        this.image = this._getImage(PATH_BOSS_IMAGE); // sprite do boss
    }

    _getImage(path) { // carrega imagem do boss
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx) { // renderiza o boss e efeitos visuais
        if (!this.alive) return;

        if (this.enraged) {
            // Cria novas partículas de fogo
            for (let i = 0; i < 3; i++) {
                this.fireParticles.push(new FireParticle(this.position.x + this.width / 2, this.position.y + this.height));
            }

            // Atualiza e desenha partículas
            for (let i = this.fireParticles.length - 1; i >= 0; i--) {
                const p = this.fireParticles[i];
                p.update();
                p.draw(ctx);
                if (p.alpha <= 0) this.fireParticles.splice(i, 1); // remove partículas transparentes
            }
        }

        // Desenha o Boss na frente
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(projectiles) { // atualiza posição e lógica de ataque
        if (!this.alive) return;

        // 1. Movimento Horizontal (Patrulha)
        this.position.x += this.velocity.x;

        const verticalStep = 80; // distância vertical ao mudar de direção

        // Borda Direita
        if (this.position.x + this.width >= this.canvasWidth) {
            this.velocity.x = -Math.abs(this.velocity.x); // inverte para esquerda
            this.position.x = this.canvasWidth - this.width; // ajusta posição na borda
            this.position.y += verticalStep; // desce uma linha
        }
        // Borda Esquerda
        else if (this.position.x <= 0) {
            this.velocity.x = Math.abs(this.velocity.x); // inverte para direita
            this.position.x = 0; // ajusta posição na borda
            this.position.y -= verticalStep; // sobe uma linha
        }

        // 2. Lógica de Ataque
        this.framesCounter++;

        if (this.framesCounter >= this.attackCooldown) {
            this.shoot(projectiles); // dispara projéteis
            this.framesCounter = 0; // reseta contador de cooldown
        }
    }

    shoot(projectiles) { // dispara projéteis do boss
        const shootX = this.position.x + this.width / 2 - 5; // posição X do tiro
        const shootY = this.position.y + this.height / 1.5; // posição Y do tiro

        // Tiro normal (verde)
        const p = new Projectile(
            {
                x: shootX,
                y: shootY
            },
            7, // velocidade do projétil
            '#ADFF2F' // cor verde
        );
        projectiles.push(p);

        // Tiro de fúria (vermelho) - dispara adicionalmente
        if (this.enraged) {
            const types = ['normal', 'spread']; // tipos de ataque especial
            const type = types[Math.floor(Math.random() * types.length)]; // escolhe tipo aleatório

            if (type === 'normal') {
                const pRage = new Projectile(
                    { x: shootX, y: shootY + 20 }, // offset vertical para não sobrepor
                    7, // velocidade
                    '#ff0000' // cor vermelha
                );
                projectiles.push(pRage);
            }
            else if (type === 'spread') {
                const numProjectiles = 5; // quantidade de projéteis no spread
                const spreadAngle = 60; // ângulo total do leque
                const startAngle = -spreadAngle / 2; // ângulo inicial

                for (let i = 0; i < numProjectiles; i++) {
                    const angle = startAngle + (spreadAngle / (numProjectiles - 1)) * i; // calcula ângulo de cada projétil
                    const rad = angle * (Math.PI / 180); // converte para radianos

                    const pSpread = new Projectile(
                        { x: shootX, y: shootY },
                        { dx: Math.sin(rad) * 7, dy: Math.cos(rad) * 7 }, // velocidade vetorial
                        '#ff0000' // cor vermelha
                    );
                    projectiles.push(pSpread);
                }
            }
        }
    }

    takeDamage(damageAmount) { // aplica dano ao boss
        if (!this.alive) return;

        this.health -= damageAmount; // reduz vida

        // Ativa modo fúria ao chegar em 50% de vida
        if (!this.enraged && this.health <= this.maxHealth / 2) {
            this.enterRageMode();
        }

        // Verifica morte
        if (this.health <= 0) {
            this.health = 0; // garante que não fica negativo
            this.alive = false; // marca como morto
        }
    }

    enterRageMode() { // ativa o modo fúria do boss
        this.enraged = true; // marca como enfurecido
        this.velocity.x *= 1.5; // aumenta velocidade em 50%
        this.attackCooldown /= 2; // atira 2x mais rápido
    }

    hit(projectile) { // detecta colisão com projétil do jogador
        const paddingX = this.hitboxPadding.x * this.scale; // padding horizontal escalado
        const paddingY = this.hitboxPadding.y * this.scale; // padding vertical escalado

        const hitboxX = this.position.x + paddingX; // posição X da hitbox ajustada
        const hitboxY = this.position.y + paddingY; // posição Y da hitbox ajustada
        const hitboxWidth = this.width - (paddingX * 2); // largura da hitbox
        const hitboxHeight = this.height - (paddingY * 2); // altura da hitbox

        // Retorna true se houver colisão
        return (
            projectile.position.y <= hitboxY + hitboxHeight &&
            projectile.position.y + projectile.height >= hitboxY &&
            projectile.position.x <= hitboxX + hitboxWidth &&
            projectile.position.x + projectile.width >= hitboxX
        );
    }

    resize(newWidth, newHeight) { // atualiza dimensões do canvas
        this.canvasWidth = newWidth; // nova largura
        this.canvasHeight = newHeight; // nova altura
    }
}

export default Boss;