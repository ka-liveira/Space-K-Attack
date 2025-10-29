
import { PATH_PLAYER_IMAGE, PATH_LIFE_IMAGE} from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player { //define a classe Player
    constructor(canvasWidth, canvasHeight) { // Construtor da classe que inicializa as propriedades do jogador.
        this.width = 48 * 1.7; //define a largura do jogador
        this.height = 48 * 1.7; // Define a altura do jogador
        this.velocity = 6; // Define a velocidade de movimento do jogador
        this.alive = true; // Define o estado de vida do jogador
        this.lives = 3; // Adiciona 3 vidas ao jogador
        this.doubleShot = false;
        this.shield = false;


        this.position = { // Cria um objeto 'position' para armazenar as coordenadas (x, y) do jogador.
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30 // Posiciona o jogador próximo à parte inferior do canvas
        };

        this.image = this.getImage(PATH_PLAYER_IMAGE); // Carrega a imagem do jogador
        this.lifeImage = this.getImage(PATH_LIFE_IMAGE); // Carrega a imagem para usar como ícone de vida
    }

    getImage(path) { // Método 'getImage' que retorna a imagem do jogador.
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft() { // Método 'moveLeft' que move o jogador para a esquerda.
        this.position.x -= this.velocity;
    }

    moveRight() { // Método 'moveRight' que move o jogador para a direita.
        this.position.x += this.velocity;
    }

    draw(ctx) { // Método 'draw' que recebe o contexto do canvas como parâmetro.
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height); // Desenha a imagem do jogador no canvas na posição (x, y) com a largura e altura especificadas.
    
if (this.shield) {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    const radius = Math.max(this.width, this.height) / 1.5;

    // Gradiente radial azul-ciano mais opaco
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius);
    gradient.addColorStop(0, "rgba(0, 255, 255, 1.0)");  // mais visível
    gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.5)");
    gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

    ctx.save();

    // Pulsação mais lenta e suave
    const pulse = Math.sin(Date.now() * 0.003) * 1.5 + 4; // variação de 2.5 a 5.5
    ctx.lineWidth = pulse;

    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}


    }

    // Novo método para desenhar as vidas na tela
    drawLives(ctx) {
        const lifeWidth = this.width / 2.1; // Define uma largura menor para o ícone de vida
        const lifeHeight = this.height / 2.1; // Define uma altura menor para o ícone de vida
        const padding = 15; // Espaçamento da borda do canvas

        for (let i = 0; i < this.lives; i++) {
            // Calcula a posição de cada ícone de vida no canto superior esquerdo
            const x = padding + i * (lifeWidth + 5); // 5 é o espaço entre os ícones
            const y = padding;
            ctx.drawImage(this.lifeImage, x, y, lifeWidth, lifeHeight);
        }
    }

    shoot(Projectiles) {
  if (this.doubleShot) {
    const offset = 15;

    // Dois projéteis — um mais à esquerda e outro à direita
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
    // Tiro único normal
    const p = new Projectile(
      { x: this.position.x + this.width / 2 - 1, y: this.position.y + 2 },
      -10,
      '#F000E8'
    );
    Projectiles.push(p);
  }
}


    // Este método verifica se o projétil atingiu o jogador.
    hit(projectile) {
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            projectile.position.y + projectile.height >= this.position.y + 22 &&
            projectile.position.y + projectile.height <= this.position.y + 22 + this.height - 34
        );
    }

    // Método para quando o jogador é atingido
    takeDamage() {
        if (this.shield) {
        return; // Não perde vida enquanto o escudo estiver ativo
    }
        this.lives -= 1; // Diminui uma vida
        if (this.lives <= 0) {
            this.lives = 0; // Garante que as vidas não fiquem negativas
            this.alive = false; // Se as vidas acabarem, o jogador não está mais vivo
        }
    }

     restart(canvasWidth, canvasHeight) {
        this.alive = true;
        this.lives = 3;
        this.position = { // Reposiciona o jogador no centro da tela
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30
        };
    }
}

export default Player; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.

