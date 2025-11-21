import { PATH_PLAYER_IMAGE, PATH_LIFE_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight) { // inicializa o jogador
        this.width = 48 * 1.7; // largura do jogador
        this.height = 48 * 1.7; // altura do jogador
        this.velocity = 6; // velocidade de movimento
        this.alive = true; // status de vida
        this.lives = 3; // vidas restantes
        this.doubleShot = false; // power-up de tiro duplo
        this.shield = false; // power-up de escudo

        this.position = {
            x: canvasWidth / 2 - this.width / 2, // posição X inicial (centralizado)
            y: canvasHeight - this.height - 30 // posição Y inicial (parte inferior)
        };

        this.image = this.getImage(PATH_PLAYER_IMAGE); // sprite do jogador
        this.lifeImage = this.getImage(PATH_LIFE_IMAGE); // ícone de vida
    }

    getImage(path) { // carrega imagem
        const image = new Image();
        image.src = path;
        return image;
    }

    updateSkin(newImagePath) { // troca a skin do jogador
        this.image.src = newImagePath;
    }

    moveLeft() { // move jogador para esquerda
        this.position.x -= this.velocity;
    }

    moveRight() { // move jogador para direita
        this.position.x += this.velocity;
    }

    draw(ctx) { // renderiza o jogador e efeitos visuais
        if (this.image.complete) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height); // desenha sprite
        }

        if (this.shield) { // desenha escudo se ativo
            const centerX = this.position.x + this.width / 2; // centro X do escudo
            const centerY = this.position.y + this.height / 2; // centro Y do escudo
            const radius = Math.max(this.width, this.height) / 1.5; // raio do escudo

            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius); // gradiente radial
            gradient.addColorStop(0, "rgba(0, 255, 255, 1.0)"); // centro opaco
            gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.5)"); // meio transparente
            gradient.addColorStop(1, "rgba(0, 255, 255, 0)"); // borda invisível

            ctx.save();
            const pulse = Math.sin(Date.now() * 0.003) * 1.5 + 4; // efeito de pulsação
            ctx.lineWidth = pulse; // espessura variável
            ctx.strokeStyle = gradient; // cor do escudo
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // desenha círculo
            ctx.stroke();
            ctx.restore();
        }
    }

    gainLife() { // ganha uma vida (máximo 3)
        if (this.lives < 3) {
            this.lives += 1;
        }
    }

    drawLives(ctx) { // desenha ícones de vidas restantes
        const lifeWidth = this.width / 2.1; // largura do ícone
        const lifeHeight = this.height / 2.1; // altura do ícone
        const padding = 15; // margem da borda

        for (let i = 0; i < this.lives; i++) {
            const x = padding + i * (lifeWidth + 5); // posição X de cada ícone
            const y = padding; // posição Y fixa
            if (this.lifeImage.complete) {
                ctx.drawImage(this.lifeImage, x, y, lifeWidth, lifeHeight); // desenha ícone
            }
        }
    }

    shoot(Projectiles) { // dispara projéteis
        if (this.doubleShot) { // tiro duplo ativo
            const offset = 15; // distância dos tiros laterais
            Projectiles.push(
                new Projectile(
                    { x: this.position.x + offset, y: this.position.y }, // tiro esquerdo
                    -10, // velocidade para cima
                    '#F000E8' // cor rosa
                )
            );
            Projectiles.push(
                new Projectile(
                    { x: this.position.x + this.width - offset, y: this.position.y }, // tiro direito
                    -10, // velocidade para cima
                    '#F000E8' // cor rosa
                )
            );
        } else { // tiro simples
            const p = new Projectile(
                { x: this.position.x + this.width / 2 - 1, y: this.position.y + 2 }, // tiro centralizado
                -10, // velocidade para cima
                '#F000E8' // cor rosa
            );
            Projectiles.push(p);
        }
    }

    hit(projectile) { // detecta colisão com projétil inimigo
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            projectile.position.y + projectile.height >= this.position.y + 22 &&
            projectile.position.y + projectile.height <= this.position.y + 22 + this.height - 34
        );
    }

    takeDamage() { // recebe dano e perde vida
        if (this.shield) { // escudo bloqueia dano
            return;
        }
        this.lives -= 1; // reduz vida
        if (this.lives <= 0) {
            this.lives = 0; // garante que não fica negativo
            this.alive = false; // marca como morto
        }
    }

    restart(canvasWidth, canvasHeight) { // reinicia o jogador
        this.alive = true; // revive
        this.lives = 3; // restaura vidas
        this.position = {
            x: canvasWidth / 2 - this.width / 2, // reposiciona no centro
            y: canvasHeight - this.height - 30 // reposiciona na parte inferior
        };
    }

    resize(width, height) { // ajusta ao redimensionar canvas
        this.canvasWidth = width; // nova largura
        this.canvasHeight = height; // nova altura
        if (this.position.x + this.width > this.canvasWidth) { // ajusta se estiver fora da tela
            this.position.x = this.canvasWidth - this.width;
        }
    }
}

export default Player;