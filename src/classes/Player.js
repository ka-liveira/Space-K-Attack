import { INITIAL_FRAMES, PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITES, PATH_SPACESHIP_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player { //define a classe Player
       constructor(canvasWidth, canvasHeight) { // Construtor da classe que inicializa as propriedades do jogador.
        this.width = 48 * 2; //define a largura do jogador
        this.height = 48 * 2;  // Define a altura do jogador
        this.velocity = 6; // Define a velocidade de movimento do jogador

        this.position = {  // Cria um objeto 'position' para armazenar as coordenadas (x, y) do jogador.
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30 // Posiciona o jogador próximo à parte inferior do canvas
        };

        this.image = this.getImage(PATH_SPACESHIP_IMAGE); // Carrega a imagem do jogador
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE); // Carrega a imagem do motor do jogador
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES); // Carrega a imagem dos sprites do motor do jogador

        this.sx = 0; // Posição x inicial do sprite
        this.framesCounter = INITIAL_FRAMES; // Contador de frames para animação do motor
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

draw (ctx) { // Método 'draw' que recebe o contexto do canvas como parâmetro.
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height ); // Desenha a imagem do jogador no canvas na posição (x, y) com a largura e altura especificadas.
    ctx.drawImage(this.engineSprites, this.sx, 0, 48,48, this.position.x, this.position.y +10, this.width, this.height ); // Desenha os sprites do motor do jogador
    ctx.drawImage(this.engineImage, this.position.x, this.position.y +8, this.width, this.height ); // Desenha a imagem do motor do jogador

    this.update(); // Atualiza o estado do jogador
  }

    update() { // Método 'update' que pode ser usado para atualizar o estado do jogador.
       if (this.framesCounter === 0) {
        this.sx = this.sx === 96 ? 0 : this.sx + 48; // Alterna entre os sprites do motor
        this.framesCounter = INITIAL_FRAMES; // Reinicia o contador de frames
    }
        this.framesCounter--; // Decrementa o contador de frames
}

  shoot(Projectiles) { // Método 'shoot' que cria e retorna um novo projétil.
    const p = new Projectile( // Cria uma nova instância do projétil
        { x: this.position.x + this.width / 2 - 1, 
          y: this.position.y + 2 }, // Posição inicial do projétil (centro superior do jogador)
        -10 // Velocidade do projétil
    );
    Projectiles.push(p); // Adiciona o projétil ao array de projéteis
}
}

export default Player; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.