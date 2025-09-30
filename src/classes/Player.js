class Player { //define a classe Player
    width; // Declara a propriedade 'width' (largura) para a classe.

       constructor(canvasWidth, canvasHeight) { // Construtor da classe que inicializa as propriedades do jogador.
        this.width = 100; //define a largura do jogador
        this.height = 100;  // Define a altura do jogador

        this.position = {  // Cria um objeto 'position' para armazenar as coordenadas (x, y) do jogador.
            x: canvasWidth / 2 - this.width / 2, 
            y: canvasHeight - this.height - 30 // Posiciona o jogador próximo à parte inferior do canvas
        }
 } 

draw (ctx) { // Método 'draw' que recebe o contexto do canvas como parâmetro.
    ctx.fillStyle = "red"; // Define a cor de preenchimento como vermelho
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Desenha um retângulo representando o jogador na posição (x, y) com a largura e altura definidas.
   }
}

export default Player; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.