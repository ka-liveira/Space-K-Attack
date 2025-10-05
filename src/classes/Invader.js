import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile  from "./Projectile.js";

class Invader { //define a classe Invader
       constructor(position, velocity) { // Construtor da classe que inicializa as propriedades do jogador.
        this.position = position 
        this.width = 50 * 0.8; //define a largura do invasor
        this.height = 37 * 0.8;  // Define a altura do invasor
        this.velocity = velocity; // Define a velocidade de movimento do invasor
        

        this.image = this.getImage(PATH_INVADER_IMAGE); // Carrega a imagem do invasor
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

   moveDown() { // Método 'moveDown' que move o jogador para baixo.
    this.position.y += this.height;
}    

draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

  shoot(Projectiles) { // Método 'shoot' que cria e retorna um novo projétil.
    const p = new Projectile( // Cria uma nova instância do projétil
        { x: this.position.x + this.width / 2 - 1, 
          y: this.position.y + 2 }, // Posição inicial do projétil (centro superior do jogador)
        10 // Velocidade do projétil
    );
    Projectiles.push(p); // Adiciona o projétil ao array de projéteis
}
}

export default Invader; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.