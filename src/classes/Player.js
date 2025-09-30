import { PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITES, PATH_SPACESHIP_IMAGE } from "../utils/constants.js";

class Player { //define a classe Player
    width; // Declara a propriedade 'width' (largura) para a classe.

       constructor(canvasWidth, canvasHeight) { // Construtor da classe que inicializa as propriedades do jogador.
        this.width = 48 * 5; //define a largura do jogador
        this.height = 48 * 5;  // Define a altura do jogador
        this.velocity = 6; // Define a velocidade de movimento do jogador

        this.position = {  // Cria um objeto 'position' para armazenar as coordenadas (x, y) do jogador.
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30 // Posiciona o jogador próximo à parte inferior do canvas
        };

        this.image = this.getImage(PATH_SPACESHIP_IMAGE); // Carrega a imagem do jogador
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE); // Carrega a imagem do motor do jogador
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES); // Carrega a imagem dos sprites do motor do jogador
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
    ctx.drawImage(this.engineImage, this.position.x, this.position.y +8, this.width, this.height ); // Desenha a imagem do motor do jogador
    ctx.drawImage(this.engineSprites, 0, 0, 48,48, this.position.x, this.position.y, this.width, this.height ); // Desenha os sprites do motor do jogador
}
}

export default Player; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.