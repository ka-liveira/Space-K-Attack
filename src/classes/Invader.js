import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile  from "./Projectile.js";
import PowerUp from "./PowerUp.js";

// Chance global de cair poder (0.0 = nunca, 1.0 = sempre)
export const POWER_DROP_RATE = 0.25; // 20% de chance

class Invader { //define a classe Invader
       constructor(position, velocity) { // Construtor da classe que inicializa as propriedades do jogador.
        this.position = position 
        this.velocity = velocity

       // --- AJUSTE DE TAMANHO PARA 50x38 ---
        const scale = 2; // Mude este valor para o tamanho que desejar.

        const originalWidth = 50;  // Largura original da imagem
        const originalHeight = 38; // Altura original da imagem

        // Calcula o novo tamanho mantendo a proporção
        this.width = originalWidth * scale;  // Exemplo com scale = 2.2 -> 110px
        this.height = originalHeight * scale; // Exemplo com scale = 2.2 -> 83.6px
        // ------------------------------------
        
        this.image = this.getImage(PATH_INVADER_IMAGE);
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

   incrementVelocity(boost) { // Método 'incrementVelocity' que aumenta a velocidade do invasor.
       this.velocity += boost;
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
          y: this.position.y + this.height }, // Posição inicial do projétil (centro superior do jogador)
        10, // Velocidade do projétil
        '#ff4040' 
    );
    Projectiles.push(p); // Adiciona o projétil ao array de projéteis
}

hit(projectile) {
    return (
        projectile.position.x >= this.position.x &&
        projectile.position.x <= this.position.x + this.width &&
        projectile.position.y >= this.position.y &&
        projectile.position.y <= this.position.y + this.height
    );
}

// metodo para decidir se cai um poder
    dropPower(player) {
        const chance = Math.random();
        if (chance <= POWER_DROP_RATE) {
            // Cria o poder na posição do invasor
            const power = new PowerUp({
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height,
            }, player);

            return power; // retorna o poder para ser adicionado no jogo
        }
        return null;
    }
}
export default Invader; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.