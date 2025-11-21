import { PATH_PLAYER_IMAGE, PATH_LIFE_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        this.width = 48 * 1.7;
        this.height = 48 * 1.7;
        this.velocity = 6;
        this.alive = true;
        this.lives = 3;
        this.doubleShot = false;
        this.shield = false;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30
        };

        this.image = this.getImage(PATH_PLAYER_IMAGE);
        this.lifeImage = this.getImage(PATH_LIFE_IMAGE);
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    // [NOVO] Método para trocar a skin dinamicamente
    updateSkin(newImagePath) {
        this.image.src = newImagePath;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveRight() {
        this.position.x += this.velocity;
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }

        if (this.shield) {
            const centerX = this.position.x + this.width / 2;
            const centerY = this.position.y + this.height / 2;
            const radius = Math.max(this.width, this.height) / 1.5;

            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius);
            gradient.addColorStop(0, "rgba(0, 255, 255, 1.0)");
            gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.5)");
            gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

            ctx.save();
            const pulse = Math.sin(Date.now() * 0.003) * 1.5 + 4;
            ctx.lineWidth = pulse;
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    gainLife() {
        if (this.lives < 3) {
            this.lives += 1;
        }
    }

    drawLives(ctx) {
        const lifeWidth = this.width / 2.1;
        const lifeHeight = this.height / 2.1;
        const padding = 15;

        for (let i = 0; i < this.lives; i++) {
            const x = padding + i * (lifeWidth + 5);
            const y = padding;
            if (this.lifeImage.complete) {
                ctx.drawImage(this.lifeImage, x, y, lifeWidth, lifeHeight);
            }
        }
    }

    shoot(Projectiles) {
        if (this.doubleShot) {
            const offset = 15;
            Projectiles.push(
                new Projectile(
                    { x: this.position.x + offset, y: this.position.y },
                    -10,
                    '#F000E8'
                )
            );
            Projectiles.push(
                new Projectile(
                    { x: this.position.x + this.width - offset, y: this.position.y },
                    -10,
                    '#F000E8'
                )
            );
        } else {
            const p = new Projectile(
                { x: this.position.x + this.width / 2 - 1, y: this.position.y + 2 },
                -10,
                '#F000E8'
            );
            Projectiles.push(p);
        }
    }

    hit(projectile) {
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            projectile.position.y + projectile.height >= this.position.y + 22 &&
            projectile.position.y + projectile.height <= this.position.y + 22 + this.height - 34
        );
    }

    takeDamage() {
        if (this.shield) {
            return;
        }
        this.lives -= 1;
        if (this.lives <= 0) {
            this.lives = 0;
            this.alive = false;
        }
    }

    restart(canvasWidth, canvasHeight) {
        this.alive = true;
        this.lives = 3;
        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30
        };
        // Obs: Não resetamos a imagem aqui para manter a skin escolhida
    }
}

export default Player;