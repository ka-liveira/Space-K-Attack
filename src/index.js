import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js
import Projectile from "./classes/Projectile.js"; // Importa a classe Projectile do arquivo Projectile.js
import Grid from "./classes/Grid.js"; // Importa a classe Grid do arquivo Grid.js
import Invader from "./classes/Invader.js"; // Importa a classe Invader do arquivo Invader.js

const canvas = document.querySelector("canvas"); // Seleciona o canvas
const ctx = canvas.getContext("2d"); // Contexto 2D do canvas

canvas.width = innerWidth;  // Define a largura do canvas
canvas.height = innerHeight;  // Define a altura do canvas

ctx.imageSmoothingEnabled = false; // Desativa o suavização de imagem para um estilo pixelado

const player = new Player(canvas.width, canvas.height); // Cria uma nova instância do jogador
const grid = new Grid(3, 6); // Cria uma nova instância da grade de invasores

const playerProjectiles = [];
const invaderProjectiles = [];

const keys = { // Objeto para rastrear o estado das teclas
    left: { pressed: false },
    right: { pressed: false },
    shoot: { pressed: false, released: true },
};

const drawProjectiles = () => { // Função para desenhar os projéteis
   const projectiles = [...playerProjectiles, ...invaderProjectiles];
   projectiles.forEach((projectile) => {
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

    grid.draw(ctx); // Desenha a grade de invasores
   grid.update(); // Atualiza a posição dos invasores

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
   if (key === "enter" || key === ' ') keys.shoot.pressed = true; // Altere a propriedade .pressed
 });      

addEventListener ("keyup", (event) => {
   const key = event.key.toLowerCase();    

   if (key === "a") keys.left.pressed = false; // Altere a propriedade .pressed
   if (key === "d") keys.right.pressed = false; // Altere a propriedade .pressed

   if (key === "enter" || key === ' ') {
         keys.shoot.pressed = false; // Altere a propriedade .pressed
         keys.shoot.released = true; // Altere a propriedade .released 
   }

   // Adiciona o disparo ao pressionar o botão esquerdo do mouse
    addEventListener("mousedown", (event) => {
    // A propriedade 'button' com valor 0 corresponde ao botão esquerdo
    if (event.button === 0) {
        keys.shoot.pressed = true;
    }
    });

    // Para o disparo quando o botão do mouse é solto
    addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        keys.shoot.pressed = false;
        keys.shoot.released = true; // Resetando a lógica para permitir novo tiro
    }
    });
});

    setInterval(() => {
        const invader = grid.getRandomInvader();

        if (invader) {
            invader.shoot(invaderProjectiles);
        }
}, 1000 );

  gameLoop(); // Inicia o loop do jogo

