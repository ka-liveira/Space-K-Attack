class Player { //define a classe Player
    width; // Declara a propriedade 'width' (largura) para a classe.

       constructor() {
        this.width = 100; //define a largura do jogador
        this.height = 100;  // Define a altura do jogador
        this.position = {  // Cria um objeto 'position' para armazenar as coordenadas (x, y) do jogador.
            x: 0, //define a posição inicial do jogador no eixo x (horinzontal)
            y: 0 // Define a posição inicial no eixo Y (vertical) 
        }
 } 
}

export default Player; // Exporta a classe 'Player' como padrão para que possa ser importada em outros arquivos.