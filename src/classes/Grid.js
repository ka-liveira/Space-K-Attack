import Invader from "./Invader.js"; // importa a classe Invader

class Grid {
    constructor(rows, cols) { // construtor que inicializa a grade dos invasores
        this.rows = rows; // número de linhas da grade
        this.cols = cols; // número de colunas da grade
        this.direction = "right"; // direção inicial do movimento
        this.moveDown = false; // indica se deve descer uma linha
        this.invadersVelocity = 1; // velocidade de movimento da grade
        this.invaders = []; // array de invasores
    }

    init() { // cria e posiciona os invasores na grade
        const array = []; // array temporário para armazenar invasores
        for (let row = 0; row < this.rows; row += 1) { // loop pelas linhas
            for (let col = 0; col < this.cols; col += 1) { // loop pelas colunas
                const invader = new Invader({ x: col * 50 + 20, y: row * 37 + 100 }, this.invadersVelocity); // cria invasor com posição calculada
                array.push(invader); // adiciona ao array
            }
        }
        return array; // retorna array de invasores
    }

    draw(ctx) { // renderiza todos os invasores
        this.invaders.forEach((invader) => invader.draw(ctx)); // desenha cada invasor
    }

    update(playerStatus) { // atualiza posição e movimento da grade
        // Verifica colisão com bordas
        if (this.reachedRightBoundary()) {
            this.direction = "left"; // inverte para esquerda
            this.moveDown = true; // marca para descer
        } else if (this.reachedLeftBoundary()) {
            this.direction = "right"; // inverte para direita
            this.moveDown = true; // marca para descer
        }

        // Move cada invasor
        this.invaders.forEach((invader) => {
            if (this.moveDown) {
                invader.moveDown(); // desce uma linha
            }

            // Move horizontalmente baseado na direção
            if (this.direction === "right") {
                invader.position.x += this.invadersVelocity; // move para direita
            } else if (this.direction === "left") {
                invader.position.x -= this.invadersVelocity; // move para esquerda
            }
        });

        this.moveDown = false; // reseta flag de descida
    }

    reachedRightBoundary() { // verifica se algum invasor atingiu borda direita
        return this.invaders.some((invader) => invader.position.x + invader.width >= innerWidth);
    }

    reachedLeftBoundary() { // verifica se algum invasor atingiu borda esquerda
        return this.invaders.some((invader) => invader.position.x <= 0);
    }

    getRandomInvader() { // retorna um invasor aleatório da grade
        const index = Math.floor(Math.random() * this.invaders.length); // índice aleatório
        return this.invaders[index]; // retorna invasor
    }

    restart() { // reinicia a grade com novos invasores
        this.invaders = []; // limpa array de invasores
        this.direction = "right"; // reseta direção

        for (let row = 0; row < this.rows; row += 1) { // loop pelas linhas
            for (let col = 0; col < this.cols; col += 1) { // loop pelas colunas
                const invader = new Invader({ x: col * 50 + 20, y: row * 37 + 100 }); // cria novo invasor
                this.invaders.push(invader); // adiciona ao array
            }
        }
    }

    resize(width, height) { // atualiza dimensões do canvas
        this.canvasWidth = width; // nova largura
        this.canvasHeight = height; // nova altura
    }
}

export default Grid;