import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js
import Projectile from "./classes/Projectile.js"; // Importa a classe Projectile do arquivo Projectile.js
import Grid from "./classes/Grid.js"; // Importa a classe Grid do arquivo Grid.js
import Invader from "./classes/Invader.js"; // Importa a classe Invader do arquivo Invader.js
import Particle from "./classes/Particle.js"; // Importa a classe Particle do arquivo Particle.js
import { GameState } from "./utils/constants.js";
import Obstacle from "./classes/Obstacle.js"; // Importa a classe Obstacle do arquivo Obstacle.js

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.remove();

const canvas = document.querySelector("canvas"); // Seleciona o canvas
const ctx = canvas.getContext("2d"); // Contexto 2D do canvas

canvas.width = innerWidth;  // Define a largura do canvas
canvas.height = innerHeight;  // Define a altura do canvas

ctx.imageSmoothingEnabled = false; // Desativa o suavização de imagem para um estilo pixelado

let currentState = GameState.START;

const gameData = {
    score: 0,
    level: 1,
    high: 0,
};

const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
};

const player = new Player(canvas.width, canvas.height); // Cria uma nova instância do jogador
const grid = new Grid(3, 6); // Cria uma nova instância da grade de invasores

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

const InitObstacles = () => { // Função para inicializar os obstáculos
     const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    const color = "crimson";

    const obstacle1 = new Obstacle({ x: x - offset, y }, 100, 20, color);
    const obstacle2 = new Obstacle({ x: x + offset, y }, 100, 20, color);

    obstacles.push(obstacle1);
    obstacles.push(obstacle2);
};
InitObstacles();

const keys = { // Objeto para rastrear o estado das teclas
    left: { pressed: false },
    right: { pressed: false },
    shoot: { pressed: false, released: true },
};

const incrementScore = (value) => {
    gameData.score += value;

    if (gameData.score > gameData.high) {
        gameData.high = gameData.score;
    }
};


const drawObstacles = () => { // Função para desenhar os obstáculos
    obstacles.forEach((obstacle) => obstacle.draw(ctx));
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

const drawParticles = () => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    });
};

const clearParticles = () => {
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        }
    });
};


const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i += 1) {
        const particle = new Particle(
            {
                x: position.x,
                y: position.y,
            },
            {
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5,
            },
            2,
            "color"
        );

        particles.push(particle);
    }
};

const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectilesIndex) => {
            if (invader.hit(projectile)) {
                createExplosion( {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2,
                    },
                    10,
                    color
                );
                
                incrementScore(10);

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectilesIndex, 1);
            }
        });
    });
};

const checkShootPlayer = () => {
    invaderProjectiles.some((projectile, index) => {
        if (player.hit(projectile)) {
            invaderProjectiles.splice(index, 1);
            gameOver();
        }
    });
};

const checkShootObstacles = () => {
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((projectile, index) => {
            if (obstacle.hit(projectile)) {
                playerProjectiles.splice(index, 1);
                return;
            }
        });

        invaderProjectiles.some((projectile, index) => {
            if (obstacle.hit(projectile)) {
                invaderProjectiles.splice(index, 1);
                return;
            }
        });
    });
};

const spawnGrid = () => {
    if (grid.invaders.length === 0) {
        grid.rows = Math.round(Math.random() * 9 + 1); // Garante pelo menos 1 linha
        grid.cols = Math.round(Math.random() * 9 + 1); // Garante pelo menos 1 coluna
        grid.restart();

        gameData.level += 1;
    };
};

const gameOver = () => {
    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        10,
        "white"
    );

    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        "#4D9BE6"
    );

    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        "crimson"
    );

    player.alive = false;
    currentState = GameState.GAME_OVER;
    document.body.append(gameOverScreen);
};


const gameLoop = () => { // Função de loop do jogo
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas para redesenhar

    if (currentState === GameState.PLAYING) {

    spawnGrid();
    showGameData();

    drawParticles();
    drawProjectiles(); // Desenha os projéteis
    drawObstacles(); // Desenha os obstáculos

    clearProjectiles(); // Limpa os projéteis que saíram da tela
    clearParticles(); // Limpa as partículas que desapareceram

    checkShootInvaders();
    checkShootPlayer();
    checkShootObstacles();

    grid.draw(ctx); // Desenha a grade de invasores
   grid.update(player.alive); // Atualiza a posição dos invasores

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
}

    if (currentState === GameState.GAME_OVER) {
        checkShootObstacles();

        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        grid.draw(ctx);
        grid.update(player.alive);
    }
    requestAnimationFrame(gameLoop);
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

buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    setInterval(() => {
        const invader = grid.getRandomInvader();

        if (invader) {
            invader.shoot(invadersProjectiles);
        }
    }, 1000);
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    player.alive = true;

    grid.invaders.length = 0;
    grid.invadersVelocity = 1;

    invadersProjectiles.length = 0; 
    
    gameData.score = 0
    gameData.level = 0

    gameOverScreen.remove();
});


  gameLoop(); // Inicia o loop do jogo

