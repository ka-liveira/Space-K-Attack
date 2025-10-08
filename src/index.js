import Player from "./classes/Player.js"; // Importa a classe Player do arquivo Player.js
import Projectile from "./classes/Projectile.js"; // Importa a classe Projectile do arquivo Projectile.js
import Grid from "./classes/Grid.js"; // Importa a classe Grid do arquivo Grid.js
import Invader from "./classes/Invader.js"; // Importa a classe Invader do arquivo Invader.js
import Particle from "./classes/Particle.js"; // Importa a classe Particle do arquivo Particle.js
import { GameState } from "./utils/constants.js";
import Obstacle from "./classes/Obstacle.js"; // Importa a classe Obstacle do arquivo Obstacle.js
import SoundEffects from "./classes/SoundEffects.js";
import Boss from "./classes/Boss.js";

const soundEffects = new SoundEffects();

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

// [BOSS] Variáveis para controlar o chefe
let boss = null;
let bossFightActive = false;

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

function drawBossHealthBar(ctx) {
    console.log("Vida do Chefe:", boss.health, "Vida Máxima:", boss.maxHealth);

    // Posição e dimensões da barra de vida
    const barWidth = canvas.width * 0.4; // A barra terá 60% da largura da tela
    const barHeight = 30; // 30 pixels de altura
    const barX = (canvas.width - barWidth) / 2; // Centraliza a barra no eixo X
    const barY = 100; // 20 pixels de distância do topo

    // Calcula a porcentagem de vida restante (um valor de 0.0 a 1.0)
    const healthPercentage = boss.health / boss.maxHealth;

    // 1. Desenha o fundo da barra (vida máxima)
    ctx.fillStyle = '#444'; // Um cinza escuro
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // 2. Desenha a frente da barra (vida atual)
    ctx.fillStyle = 'crimson'; // Um vermelho vivo para a vida
    // A largura da barra de vida atual é a largura máxima * a porcentagem de vida
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
    
    // 3. (Opcional) Adiciona uma borda para dar acabamento
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // 4. (Opcional) Adiciona um texto
    ctx.fillStyle = 'white';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', barX + barWidth / 2, barY + barHeight / 2 + 7);
}

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
                soundEffects.playHitSound();
                createExplosion( {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2,
                    },
                    10,
                    "#941CFF"
                );
                
                incrementScore(10);

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectilesIndex, 1);
            }
        });
    });
};

// [BOSS] Nova função para verificar colisão com o chefe
const checkShootBoss = () => {
    playerProjectiles.some((projectile, projectilesIndex) => {
        if (boss.hit(projectile)) { // Supondo que a classe Boss tenha um método hit()
            soundEffects.playHitSound();
            createExplosion( {
                    x: projectile.position.x,
                    y: projectile.position.y,
                },
                10,
                "orange"
            );
            incrementScore(50); // Mais pontos por acertar o chefe
            boss.takeDamage(10); // Causa dano ao chefe
            playerProjectiles.splice(projectilesIndex, 1);
        }
    });
};


const checkShootPlayer = () => {
    invaderProjectiles.some((projectile, index) => {
        if (player.hit(projectile)) {
            soundEffects.playExplosionSound();
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
    // [BOSS] A lógica de spawn agora também decide se é hora do chefe
    if (grid.invaders.length === 0 && !bossFightActive) {
        soundEffects.playNextLevelSound();
        gameData.level += 1;

        // [BOSS] Verifica se é um nível de chefe
        if (gameData.level > 0 && gameData.level % 5 === 0) {
            bossFightActive = true;
            boss = new Boss(canvas.width, canvas.height);
        } else {
            // [BOSS] Se não for, cria inimigos normais
            grid.rows = Math.round(Math.random() * 4 + 1); // Garante pelo menos 1 linha
            grid.cols = Math.round(Math.random() * 4 + 1); // Garante pelo menos 1 coluna
            grid.restart();
        }
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

        showGameData();

        drawParticles();
        drawProjectiles(); // Desenha os projéteis
        drawObstacles(); // Desenha os obstáculos

        clearProjectiles(); // Limpa os projéteis que saíram da tela
        clearParticles(); // Limpa as partículas que desapareceram

        checkShootPlayer();
        checkShootObstacles();
        
        // [BOSS] Lógica condicional para o que acontece no jogo
         if (bossFightActive) {
            if (boss && boss.alive) {
                boss.update(invaderProjectiles);
                boss.draw(ctx);
                checkShootBoss();

                // [BARRA DE VIDA] Chamada para desenhar a barra de vida
                drawBossHealthBar(ctx);
            } else if (boss) {
                bossFightActive = false;
                boss = null;
                incrementScore(1000);
                spawnGrid();
            }
        } else {
            spawnGrid();
            checkShootInvaders();
            grid.draw(ctx);
            grid.update(player.alive);
        }

        ctx.save(); // Salva o estado atual do canvas

        ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2); // Move o ponto de origem para o centro do jogador

        if (keys.shoot.pressed && keys.shoot.released) { // Verifique .pressed e .released
            player.shoot(playerProjectiles); // O jogador atira
            soundEffects.playShootSound();
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
        // [BOSS] Inimigos normais só atiram se não for uma luta de chefe
        if (!bossFightActive) {
            const invader = grid.getRandomInvader();
            if (invader) {
                invader.shoot(invaderProjectiles);
            }
        }
}, 1000 );

buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    // Este setInterval aqui está duplicado, removi o conteúdo para evitar tiros em dobro.
    // O setInterval que está fora já controla os tiros.
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    player.alive = true;

    grid.restart();
    grid.invadersVelocity = 1;
    
    // [BOSS] Reseta o estado do chefe ao reiniciar
    boss = null;
    bossFightActive = false;

    invaderProjectiles.length = 0; 
    
    gameData.score = 0
    gameData.level = 1; // [BOSS] Nível deve reiniciar em 1, não 0

    gameOverScreen.remove();
});

  gameLoop(); // Inicia o loop do jogo