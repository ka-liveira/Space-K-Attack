import { PATH_PLAYER_IMAGE, PATH_LIFE_IMAGE} from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player { //define a classe Player
    constructor(canvasWidth, canvasHeight) { // Construtor da classe que inicializa as propriedades do jogador.
        this.width = 48 * 1.7; //define a largura do jogador
        this.height = 48 * 1.7; // Define a altura do jogador
        this.velocity = 6; // Define a velocidade de movimento do jogador
        this.alive = true; // Define o estado de vida do jogador
        this.lives = 3; // Adiciona 3 vidas ao jogador

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

    shoot(Projectiles) { // Método 'shoot' que cria e retorna um novo projétil.
        const p = new Projectile( // Cria uma nova instância do projétil
            { x: this.position.x + this.width / 2 - 1, y: this.position.y + 2 }, // Posição inicial do projétil (centro superior do jogador)
            -10 // Velocidade do projétil
        );
        Projectiles.push(p); // Adiciona o projétil ao array de projéteis
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
        this.lives -= 1; // Diminui uma vida
        if (this.lives <= 0) {
            this.lives = 0; // Garante que as vidas não fiquem negativas
            this.alive = false; // Se as vidas acabarem, o jogador não está mais vivo
        }
    }
}

export default Player; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.

