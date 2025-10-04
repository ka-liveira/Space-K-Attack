import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js
import Projectile from "./classes/Projectile.js";

const canvas = document.querySelector("canvas"); // Seleciona o canvas
const ctx = canvas.getContext("2d"); // Contexto 2D do canvas

canvas.width = innerWidth;  // Define a largura do canvas
canvas.height = innerHeight;  // Define a altura do canvas

ctx.imageSmoothingEnabled = false; // Desativa o suavização de imagem para um estilo pixelado

const player = new Player(canvas.width, canvas.height); // Cria uma nova instância do jogador
const playerProjectiles = [];

const keys = { // Objeto para rastrear o estado das teclas
    left: { pressed: false },
    right: { pressed: false },
    shoot: { pressed: false, released: true },
};

const drawProjectiles = () => { // Função para desenhar os projéteis
   playerProjectiles.forEach((projectile) => {
    projectile.draw(ctx); // Desenha o projétil
    projectile.update(); // Atualiza a posição do projétil
   });
};

const clearProjectiles = () => { // Função para limpar projéteis que saíram da tela
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0) {
            playerProjectiles.splice(index, 1);
        }
    });
};

const gameLoop = () => { // Função de loop do jogo
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas para redesenhar

    drawProjectiles(); // Desenha os projéteis
    clearProjectiles(); // Limpa os projéteis que saíram da tela

    ctx.save(); // Salva o estado atual do canvas

    ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2); // Move o ponto de origem para o centro do jogador

    if (keys.shoot.pressed && keys.shoot.released) { // Verifique .pressed e .released
        player.shoot(playerProjectiles); // O jogador atira
        keys.shoot.released = false;
    }

   if (keys.left.pressed && player.position.x >= 0) { // Verifique .pressed
       player.moveLeft(); // Move o jogador para a esquerda
       ctx.rotate(-0.15); // Rotaciona o canvas para a esquerda
   }

   if (keys.right.pressed && player.position.x <= canvas.width - player.width) { // Verifique .pressed
       player.moveRight(); // Move o jogador para a direita
       ctx.rotate(0.15); // Rotaciona o canvas para a direita
   }

   ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2); // Move o ponto de origem para o centro do jogador

    player.draw(ctx); // Desenha o jogador no canvas 

    ctx.restore(); // Restaura o estado salvo do canvas

    requestAnimationFrame(gameLoop); // Chama a função novamente para o próximo frame
};

addEventListener ("keydown", (event) => { // Adiciona um ouvinte de evento para a tecla pressionada
   const key = event.key.toLowerCase();

   if (key === "a") keys.left.pressed = true; // Altere a propriedade .pressed
   if (key === "d") keys.right.pressed = true; // Altere a propriedade .pressed
   if (key === "enter") keys.shoot.pressed = true; // Altere a propriedade .pressed
 });      

addEventListener ("keyup", (event) => {
   const key = event.key.toLowerCase();    

   if (key === "a") keys.left.pressed = false; // Altere a propriedade .pressed
   if (key === "d") keys.right.pressed = false; // Altere a propriedade .pressed

   if (key === "enter") {
         keys.shoot.pressed = false; // Altere a propriedade .pressed
         keys.shoot.released = true; // Altere a propriedade .released 
   }
 });

  gameLoop(); // Inicia o loop do jogo

