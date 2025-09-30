import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js

const canvas = document.querySelector("canvas"); // Seleciona o canvas
const ctx = canvas.getContext("2d"); // Contexto 2D do canvas


canvas.width = innerWidth;  // Define a largura do canvas
canvas.height = innerHeight;  // Define a altura do canvas

const player = new Player(canvas.width, canvas.height); // Cria uma nova instância do jogador

player.draw(ctx); // Desenha o jogador no canvas

addEventListener ("keydown", (event) => { // Adiciona um ouvinte de evento para a tecla pressionada
    const key = event.key.toLowerCase(); // Converte a tecla pressionada para minúscula

    if (key === "a") {
        player.position.x -= 20; // Move o jogador para a esquerda
    }

    if (key === "d") {
        player.position.x += 20; // Move o jogador para a direita
    }   
});