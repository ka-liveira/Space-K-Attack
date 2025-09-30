import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js

const canvas = document.querySelector("canvas"); // Seleciona o canvas
const ctx = canvas.getContext("2d"); // Contexto 2D do canvas

canvas.width = innerWidth;  // Define a largura do canvas
canvas.height = innerHeight;  // Define a altura do canvas

const player = new Player(canvas.width, canvas.height); // Cria uma nova instância do jogador

const keys = { // Objeto para rastrear o estado das teclas
    left: { pressed: false },
    right: { pressed: false }
};

const gameLoop = () => { // Função de loop do jogo
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas para redesenhar

   if (keys.left.pressed && player.position.x >= 0) { // Verifique .pressed
       player.moveLeft(); // Move o jogador para a esquerda
   }

   if (keys.right.pressed && player.position.x <= canvas.width - player.width) { // Verifique .pressed
       player.moveRight(); // Move o jogador para a direita
   }

    player.draw(ctx); // Desenha o jogador no canvas

    requestAnimationFrame(gameLoop); // Chama a função novamente para o próximo frame
};

addEventListener ("keydown", (event) => { // Adiciona um ouvinte de evento para a tecla pressionada
   const key = event.key.toLowerCase();

   if (key === "a") keys.left.pressed = true; // Altere a propriedade .pressed
   if (key === "d") keys.right.pressed = true; // Altere a propriedade .pressed
 });      

addEventListener ("keyup", (event) => {
   const key = event.key.toLowerCase();    

   if (key === "a") keys.left.pressed = false; // Altere a propriedade .pressed
   if (key === "d") keys.right.pressed = false; // Altere a propriedade .pressed
 });

  gameLoop(); // Inicia o loop do jogo

