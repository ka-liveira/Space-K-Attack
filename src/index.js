import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js
import Projectile from "./classes/Projectile.js"; // Importa a classe Projectile do arquivo Projectile.js
import Grid from "./classes/Grid.js"; // Importa a classe Grid do arquivo Grid.js
import Invader from "./classes/Invader.js"; // Importa a classe Invader do arquivo Invader.js
import Particle from "./classes/Particle.js"; // Importa a classe Particle do arquivo Particle.js
import { GameState } from "./utils/constants.js";
import Obstacle from "./classes/Obstacle.js"; // Importa a classe Obstacle do arquivo Obstacle.js
import SoundEffects from "./classes/SoundEffects.js";
import Boss from "./classes/Boss.js";
import { PATH_BACKGROUND_IMAGE, PATH_BACKGROUND_IMAGE_2, PATH_BACKGROUND_IMAGE_3 } from "./utils/constants.js";


const soundEffects = new SoundEffects();

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const killsUi = document.querySelector(".kills-ui"); // <-- Seleciona o novo container
const killsInvadersElement = killsUi.querySelector(".kills-invaders > span");
const killsBossElement = killsUi.querySelector(".kills-boss > span");

const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");
const settingsScreen = document.querySelector("#settings-screen");
const instructionsScreen = document.querySelector("#instructions-screen");
const optionsBtn = document.querySelector("#options-btn");
const instructionsBtn = document.querySelector("#instructions-btn");
const backToStartButtons = document.querySelectorAll(".button-back-to-start");

const bgDiv1 = document.querySelector("#bg1");
const bgDiv2 = document.querySelector("#bg2");

// 1. PRIMEIRO: Defina a lista de imagens.
//    (Lembre-se de importar as constantes PATH_... no topo do seu arquivo)
const fundosAnimados = [
    PATH_BACKGROUND_IMAGE,
    PATH_BACKGROUND_IMAGE_2,
    PATH_BACKGROUND_IMAGE_3
];


// 2. SEGUNDO: Defina as variáveis de controle.
let intervaloDoFundo;
let bgAtivo = 1; 
let indiceFundoAtual = 0;

// 3. TERCEIRO: Defina as funções auxiliares.
function precarregarImagens() {
    fundosAnimados.forEach(caminhoDaImagem => {
        const img = new Image();
        img.src = caminhoDaImagem;
    });
}

function trocarFundo() {
    // Calcula o índice da PRÓXIMA imagem
    const proximoIndice = (indiceFundoAtual + 1) % fundosAnimados.length;

    // Identifica qual div está na frente e qual está atrás
    const divAtivo = (bgAtivo === 1) ? bgDiv1 : bgDiv2;
    const divInativo = (bgAtivo === 1) ? bgDiv2 : bgDiv1;

    // Define a PRÓXIMA imagem no div que está ESCONDIDO
    divInativo.style.backgroundImage = `url('${fundosAnimados[proximoIndice]}')`;

    // Inverte a opacidade para criar o efeito de fade
    divAtivo.style.opacity = 0;   // Esconde o div antigo
    divInativo.style.opacity = 1; // Mostra o novo div

    // Atualiza as variáveis de controle para a próxima rodada
    indiceFundoAtual = proximoIndice;
    bgAtivo = (bgAtivo === 1) ? 2 : 1; // Alterna entre 1 e 2
}

// 4. QUARTO: Defina a função principal que inicia o processo.
function iniciarFundo() {
    precarregarImagens(); // Agora esta função já existe.
    
    // Define a primeira imagem no primeiro div e o torna visível
    bgDiv1.style.backgroundImage = `url('${fundosAnimados[0]}')`;
    bgDiv1.style.opacity = 1;
    
    // Inicia o loop de troca
    intervaloDoFundo = setInterval(trocarFundo, 4000);
}

const canvas = document.querySelector("canvas"); // Seleciona o canvas
const ctx = canvas.getContext("2d"); // Contexto 2D do canvas

canvas.width = innerWidth; // Define a largura do canvas
canvas.height = innerHeight; // Define a altura do canvas

ctx.imageSmoothingEnabled = false; // Desativa o suavização de imagem para um estilo pixelado

let currentState = GameState.START;

const gameData = {
score: 0,
level: 0,
high: 0,
invadersKilled: 0,
bossesKilled: 0
};

const showGameData = () => {
scoreElement.textContent = gameData.score;
levelElement.textContent = gameData.level;
highElement.textContent = gameData.high;
killsInvadersElement.textContent = gameData.invadersKilled; 
killsBossElement.textContent = gameData.bossesKilled;
};

const player = new Player(canvas.width, canvas.height); // Cria uma nova instância do jogador
const grid = new Grid(3, 6); // Cria uma nova instância da grade de invasores


const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

let invaderShootInterval;
let invaderShootTime = 1000;

// [BOSS] Variáveis para controlar o chefe
let boss = null;
let bossFightActive = false;

// Paletas de partículas para as explosões
const PLAYER_DEATH_PARTICLES = [
{ color: '#cccccc', radius: 5 }, 
{ color: '#FFD700', radius: 4 }, 
{ color: '#87CEEB', radius: 3 }
];

const PLAYER_HIT_PARTICLES = [
    { color: 'lightgray',    radius: 4 },
    { color: '#87CEEB', radius: 4 } // Azul céu, para combinar com o jogador
];

const INVADER_DEATH_PARTICLES = [
{ color: 'crimson', radius: 3 },
{ color: '#ff4040', radius: 3 }
];

const BOSS_HIT_PARTICLES = [
{ color: 'lightgray',  radius: 2 },
{ color: 'crimson', radius: 3 }
];

const BOSS_DEATH_PARTICLES = [
{ color: 'crimson', radius: 14 },
{ color: 'orange', radius: 12 },
{ color: 'yellow', radius: 10 }
];



const InitObstacles = () => { // Função para inicializar os obstáculos
const x = canvas.width / 2 - 50;
const y = canvas.height - 220;
const offset = canvas.width * 0.15;
const color = "white";

const obstacle1 = new Obstacle({ x: x - offset, y }, 150, 15, color);
const obstacle2 = new Obstacle({ x: x + offset, y }, 150, 15, color);

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

function drawBossHealthBar(ctx) {
  if (!boss) return; // Garante que a função não execute se não houver chefe
  
  const barWidth = canvas.width * 0.4;
  const barHeight = 30;
  const barX = (canvas.width - barWidth) / 2;
  const barY = 100;
  const healthPercentage = boss.health / boss.maxHealth;

  ctx.fillStyle = '#444';
  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = 'crimson';
  ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
  
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = 'white';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BOSS', barX + barWidth / 2, barY + barHeight / 2 + 7);
}

const drawObstacles = () => {
  obstacles.forEach((obstacle) => obstacle.draw(ctx));
};

const drawProjectiles = () => {
  const projectiles = [...playerProjectiles, ...invaderProjectiles];
  projectiles.forEach((projectile) => {
    projectile.draw(ctx);
    projectile.update();
  });
};

const clearProjectiles = () => {
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

// [ALTERADO] Função createExplosion corrigida e melhorada
const createExplosion = (position, radius, color) => {
    // A quantidade de partículas será proporcional ao raio
    const particleCount = radius * 2;

    for (let i = 0; i < particleCount; i += 1) {
        const particle = new Particle(
            { // Posição
                x: position.x,
                y: position.y,
            },
            { // Velocidade aleatória
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
            },
            // O tamanho de cada partícula agora é aleatório, até o raio máximo
            Math.random() * radius,
            color // Cor corrigida (sem aspas)
        );

        particles.push(particle);
    }
};

// [ALTERADO] Nova função reutilizável para criar os efeitos de explosão
function createExplosionEffect(target, particleDefinitions) {
    const targetCenter = {
        x: target.position.x + target.width / 2,
        y: target.position.y + target.height / 2,
    };

    particleDefinitions.forEach(particle => {
        createExplosion(
            targetCenter,
            particle.radius,
            particle.color
        );
    });
}

const checkShootInvaders = () => {
  grid.invaders.forEach((invader, invaderIndex) => {
    playerProjectiles.some((projectile, projectilesIndex) => {
      if (invader.hit(projectile)) {
        soundEffects.playHitSound();

        // [ALTERADO] Usa a nova função de efeito com a paleta de invasores
                createExplosionEffect(invader, INVADER_DEATH_PARTICLES);
        
        incrementScore(10);
        gameData.invadersKilled += 1;

        grid.invaders.splice(invaderIndex, 1);
        playerProjectiles.splice(projectilesIndex, 1);
      }
    });
  });
};

const checkShootBoss = () => {
  if (!boss) return;
  playerProjectiles.some((projectile, projectilesIndex) => {
    if (boss.hit(projectile)) {
      soundEffects.playHitSound();

            // [ALTERADO] Usa a nova função com a paleta de dano do chefe
            // Criamos um "alvo falso" na posição do projétil para o efeito acontecer no local do impacto
            const hitMarker = { position: projectile.position, width: 0, height: 0 };
            createExplosionEffect(hitMarker, BOSS_HIT_PARTICLES);

      incrementScore(50);
      boss.takeDamage(10);
      playerProjectiles.splice(projectilesIndex, 1);
    }
  });
};

const checkShootPlayer = () => {
  invaderProjectiles.some((projectile, index) => {
    if (player.hit(projectile)) {
      soundEffects.playExplosionSound();
      invaderProjectiles.splice(index, 1);

      createExplosionEffect(player, PLAYER_HIT_PARTICLES);
      player.takeDamage();
    }
  });
};

const checkShootObstacles = () => {
  obstacles.forEach((obstacle) => {
    playerProjectiles.some((projectile, index) => {
      if (obstacle.hit(projectile)) {
        playerProjectiles.splice(index, 1);
        return true;
      }
    });

    invaderProjectiles.some((projectile, index) => {
      if (obstacle.hit(projectile)) {
        invaderProjectiles.splice(index, 1);
        return true;
      }
    });
  });
};

const startInvaderShooting = () => {
    // Limpa qualquer timer antigo para evitar que múltiplos rodem ao mesmo tempo
    if (invaderShootInterval) {
        clearInterval(invaderShootInterval);
    }

    // Cria um novo timer com o tempo atualizado
    invaderShootInterval = setInterval(() => {
        // Só atira se não for uma luta de chefe e o jogo estiver rodando
        if (!bossFightActive && currentState === GameState.PLAYING) {
            const invader = grid.getRandomInvader();
            if (invader) {
                invader.shoot(invaderProjectiles);
            }
        }
    }, invaderShootTime);
};

const spawnGrid = () => {
  if (grid.invaders.length === 0 && !bossFightActive) {
    soundEffects.playNextLevelSound();
    gameData.level += 1;

    if (gameData.level > 0 && gameData.level % 3 === 0) {
            // Define um limite para não ficar impossível (ex: mínimo de 250ms)
            if (invaderShootTime > 250) {
                invaderShootTime -= 100; // Diminui o tempo em 100ms
                startInvaderShooting(); // Reinicia o timer com a nova velocidade
                console.log(`Nível ${gameData.level}! Frequência de tiro aumentada. Intervalo: ${invaderShootTime}ms`);
            }
        }

    if (gameData.level > 0 && gameData.level % 3 === 0) {
            grid.invadersVelocity += 0.5; // Adiciona 0.5 à velocidade atual
        }

  if (gameData.level > 0 && gameData.level % 5 === 0) {
            let bossHealth; // 1. Declara uma variável para a vida do chefe

            // 2. Verifica se o nível é um múltiplo de 10
            if (gameData.level % 10 === 0) {
                bossHealth = 1000; // Níveis 10, 20, 30... chefe tem 1000 de vida
            } else {
                bossHealth = 500; // Níveis 5, 15, 25... chefe tem 500 de vida
            }

            bossFightActive = true;
            // 3. Passa a vida calculada ao criar o novo chefe
            boss = new Boss(canvas.width, canvas.height, bossHealth);

        } else {
            // Lógica para níveis normais (continua a mesma)
            grid.rows = Math.round(Math.random() * 4 + 1);
            grid.cols = Math.round(Math.random() * 4 + 1);
            grid.restart();
  };
}
};

// [ALTERADO] Função gameOver agora usa a nova lógica e paleta do jogador
const gameOver = () => {
    // Primeiro, altera o estado do jogo e do jogador
    player.alive = false;
    currentState = GameState.GAME_OVER;
   
    // Em vez de 'append', nós ADICIONAMOS a classe '.show'
    if (gameOverScreen) {
        gameOverScreen.classList.add('show');
    }

    // Depois, cria o efeito visual da morte
    createExplosionEffect(player, PLAYER_DEATH_PARTICLES);
};


const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentState === GameState.PLAYING) {

     if (!player.alive) {
      gameOver();
    }

    showGameData();

    drawParticles();
    drawProjectiles();
    drawObstacles();

    player.draw(ctx);
    player.drawLives(ctx);

    clearProjectiles();
    clearParticles();

    checkShootPlayer();
    checkShootObstacles();
    
    if (bossFightActive) {
      if (boss && boss.alive) {
        boss.update(invaderProjectiles);
        boss.draw(ctx);
        checkShootBoss();
        drawBossHealthBar(ctx);
      } else if (boss) {
                // [ALTERADO] Adiciona a explosão de morte do chefe antes de removê-lo
                createExplosionEffect(boss, BOSS_DEATH_PARTICLES);

        bossFightActive = false;
        boss = null;
        incrementScore(1000);
        gameData.bossesKilled += 1;
        spawnGrid();
      }
    } else {
      spawnGrid();
      checkShootInvaders();
      grid.draw(ctx);
      grid.update(player.alive);
    }

    ctx.save();
    ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);

    if (keys.shoot.pressed && keys.shoot.released) {
      player.shoot(playerProjectiles);
      soundEffects.playShootSound();
      keys.shoot.released = false;
    }

    if (keys.left.pressed && player.position.x >= 0) {
      player.moveLeft();
      ctx.rotate(-0.15);
    }

    if (keys.right.pressed && player.position.x <= canvas.width - player.width) {
      player.moveRight();
      ctx.rotate(0.15);
    }

    ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);
    player.draw(ctx);
    ctx.restore();
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

addEventListener ("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a") keys.left.pressed = true;
  if (key === "d") keys.right.pressed = true;
  if (key === "enter" || key === ' ') keys.shoot.pressed = true;
});    

addEventListener ("keyup", (event) => {
  const key = event.key.toLowerCase();  

  if (key === "a") keys.left.pressed = false;
if (key === "d") keys.right.pressed = false;

if (key === "enter" || key === ' ') {
keys.shoot.pressed = false;
keys.shoot.released = true; }
});

addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        keys.shoot.pressed = true;
    }
});

addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});


buttonPlay.addEventListener("click", () => {
startScreen.remove();
scoreUi.style.display = "block";
killsUi.style.display = "flex";
currentState = GameState.PLAYING;
startInvaderShooting();

});

// 1. Botão "Opções"
optionsBtn.addEventListener("click", () => {
    startScreen.style.display = "none";  // Esconde a tela inicial
    settingsScreen.style.display = "flex"; // Mostra a tela de opções
});

// 2. Botão "Instruções"
instructionsBtn.addEventListener("click", () => {
    startScreen.style.display = "none";     // Esconde a tela inicial
    instructionsScreen.style.display = "flex"; // Mostra a tela de instruções
});

// 3. Botões de "Voltar"
backToStartButtons.forEach(button => {
    button.addEventListener("click", () => {
        startScreen.style.display = "flex"; // Mostra a tela inicial

        // Esconde a tela de menu atual
        button.closest(".menu-screen").style.display = "none";
    });
});

buttonRestart.addEventListener("click", () => {
    player.restart(canvas.width, canvas.height);
    currentState = GameState.PLAYING;
    
    killsUi.style.display = "flex";

    grid.restart();
    grid.invadersVelocity = 1;

    boss = null; 
    bossFightActive = false;

    invaderProjectiles.length = 0; 

    gameData.score = 0;
    gameData.level = 1;
    gameData.invadersKilled = 0;
    gameData.bossesKilled = 0;

    invaderShootTime = 1000;
    startInvaderShooting();

    // [CORREÇÃO AQUI]
    // Em vez de 'remove', nós REMOVEMOS a classe '.show' para escondê-la
    if (gameOverScreen) {
        gameOverScreen.classList.remove('show');
    }
    // [REMOVIDO] gameOverScreen.remove();
});

iniciarFundo();
gameLoop();