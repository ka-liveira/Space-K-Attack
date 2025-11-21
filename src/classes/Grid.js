import Invader from "./Invader.js"; //importa a classe Invader

class Grid {
    constructor(rows, cols) { //construtor que inicializa a grade dos invasores

        this.rows = rows; //número de linhas 
        this.cols = cols; //número de colunas

        this.direction = "right"; //direção inicial
        this.moveDown = false; //indica se os invasores devem descer


        this.invadersVelocity = 1; //velocidade inicial 
         this.invaders = []; 
    }

    init() { //método que cria e posiciona os invasores na grade

    const array = []; //array para armazenar os invasores
        for (let row = 0; row < this.rows; row += 1) { //loop para criar as linhas
            for (let col = 0; col < this.cols; col += 1) { //loop para criar as colunas
                const invader = new Invader({  x: col * 50 + 20, y: row * 37 + 100 }, this.invadersVelocity); //cria um novo invasor em uma posição específica

                array.push(invader); //adiciona o invasor ao array
            }
        }
        return array; 
    }

    draw(ctx) { this.invaders.forEach((invader) => invader.draw(ctx)); } //método que desenha os invasores na tela

    update(playerStatus) {
     // A lógica de checar as bordas continua a mesma
    if (this.reachedRightBoundary()) {
        this.direction = "left";
        this.moveDown = true;
    } else if (this.reachedLeftBoundary()) {
        this.direction = "right";
        this.moveDown = true;
    }

    // Loop para mover cada invasor
    this.invaders.forEach((invader) => {
        if (this.moveDown) {
            invader.moveDown();
        }

        // AGORA, O MOVIMENTO USA A VELOCIDADE PRINCIPAL DA GRADE
        if (this.direction === "right") {
            invader.position.x += this.invadersVelocity;
        } else if (this.direction === "left") {
            invader.position.x -= this.invadersVelocity;
        }
    });

    this.moveDown = false;
    }

    reachedRightBoundary() {
       return this.invaders.some((invader) => invader.position.x + invader.width >= innerWidth);
    }
    reachedLeftBoundary() {
       return this.invaders.some((invader) => invader.position.x <= 0);
    }

    getRandomInvader() {
        const index = Math.floor(Math.random() * this.invaders.length);
        return this.invaders[index];
    }

     restart() {
        // O restart agora limpa os invasores antigos e cria novos com base nas novas rows/cols
    this.invaders = [];
    this.direction = "right";

    for (let row = 0; row < this.rows; row += 1) {
        for (let col = 0; col < this.cols; col += 1) {
            // Cria um novo invasor sem passar a velocidade, pois o update da grade vai controlar isso
            const invader = new Invader({ x: col * 50 + 20, y: row * 37 + 100 });
            this.invaders.push(invader);
        }
    }
}

    // [ADICIONAR ESTE MÉTODO NO FINAL DA CLASSE]
    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }

}

export default Grid;