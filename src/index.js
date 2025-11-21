import Player from "./classes/Player.js"; 
import Projectile from "./classes/Projectile.js"; 
import Grid from "./classes/Grid.js"; 
import Invader from "./classes/Invader.js"; 
import Particle from "./classes/Particle.js"; 
import { GameState } from "./utils/constants.js";
import Obstacle from "./classes/Obstacle.js"; 
import SoundEffects from "./classes/SoundEffects.js";
import Boss from "./classes/Boss.js";
import PowerUp from "./classes/PowerUp.js";
import { t, setLanguage } from './utils/translations.js';

import { PATH_BACKGROUND_IMAGE, PATH_BACKGROUND_IMAGE_2, PATH_BACKGROUND_IMAGE_3 } from "./utils/constants.js";

const soundEffects = new SoundEffects();

// Seletores de tela
const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const killsUi = document.querySelector(".kills-ui"); 
const killsInvadersElement = killsUi.querySelector(".kills-invaders > span");
const killsBossElement = killsUi.querySelector(".kills-boss > span");

// Botões e Menus
const buttonPlay = document.querySelector(".button-play");
const pauseButton = document.querySelector("#pause-button");
const buttonRestart = document.querySelector(".button-restart");
const settingsScreen = document.querySelector("#settings-screen");
const instructionsScreen = document.querySelector("#instructions-screen");
const optionsBtn = document.querySelector("#options-btn");
const instructionsBtn = document.querySelector("#instructions-btn");
const backToStartButtons = document.querySelectorAll(".button-back-to-start");

// --- SELETOR DE IDIOMA (Menu Customizado) ---
const languageContainer = document.querySelector(".language-container");
const langOptionsList = document.getElementById("lang-options-list");
const currentFlagImg = document.getElementById("current-flag-img");
const currentLangText = document.getElementById("current-lang-text");

// --- NOVA LÓGICA DE SELEÇÃO DE SKIN ---
const skinSelectionScreen = document.querySelector("#skin-selection-screen");
const skinButtons = document.querySelectorAll(".skin-btn");
// --------------------------------------

const bgm = document.querySelector("#bgm"); 

// Configurações de Áudio
const musicVolumeSlider = document.querySelector("#music-volume");
const musicVolumeLabel = document.querySelector("#music-volume-label");
const fxVolumeSlider = document.querySelector("#fx-volume");
const fxVolumeLabel = document.querySelector("#fx-volume-label");
const resetSettingsBtn = document.querySelector("#reset-settings-btn");

const pauseScreen = document.querySelector("#pause-screen");
const buttonResume = document.querySelector("#button-resume");
const buttonPauseRestart = document.querySelector("#button-pause-restart");
const buttonPauseQuit = document.querySelector("#button-pause-quit");
const pauseMusicVolumeSlider = document.querySelector("#pause-music-volume");
const pauseMusicVolumeLabel = document.querySelector("#pause-music-volume-label");
const pauseFxVolumeSlider = document.querySelector("#pause-fx-volume");
const pauseFxVolumeLabel = document.querySelector("#pause-fx-volume-label");
const pauseResetSettingsBtn = document.querySelector("#pause-reset-settings-btn");

// Background Animado
const bgDiv1 = document.querySelector("#bg1");
const bgDiv2 = document.querySelector("#bg2");

const fundosAnimados = [
    PATH_BACKGROUND_IMAGE,
    PATH_BACKGROUND_IMAGE_2,
    PATH_BACKGROUND_IMAGE_3
];

let intervaloDoFundo;
let bgAtivo = 1; 
let indiceFundoAtual = 0;

// Dados das bandeiras
const FLAG_DATA = {
    'pt': { src: "https://flagcdn.com/w40/br.png", label: "PT" },
    'en': { src: "https://flagcdn.com/w40/us.png", label: "EN" },
    'es': { src: "https://flagcdn.com/w40/es.png", label: "ES" }
};

// --- LÓGICA DO MENU CUSTOMIZADO ---

window.toggleLangMenu = () => {
    if (langOptionsList) {
        langOptionsList.classList.toggle("open");
    }
};

window.changeGameLanguage = (lang) => {
    setLanguage(lang);
    
    if (FLAG_DATA[lang]) {
        if(currentFlagImg) currentFlagImg.src = FLAG_DATA[lang].src;
        if(currentLangText) currentLangText.innerText = FLAG_DATA[lang].label;
    }

    if (langOptionsList) {
        langOptionsList.classList.remove("open");
    }
};

window.addEventListener('click', (e) => {
    const container = document.getElementById('language-custom-menu');
    if (container && !container.contains(e.target)) {
        if (langOptionsList) langOptionsList.classList.remove("open");
    }
});

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`${t('SCORE')}: ${score}`, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.fillText(t('GAME_OVER'), canvas.width/2 - 150, canvas.height/2);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(t('RESTART'), canvas.width/2 - 120, canvas.height/2 + 50);
}

function precarregarImagens() {
    fundosAnimados.forEach(caminhoDaImagem => {
        const img = new Image();
        img.src = caminhoDaImagem;
    });
}

function trocarFundo() {
    const proximoIndice = (indiceFundoAtual + 1) % fundosAnimados.length;
    const divAtivo = (bgAtivo === 1) ? bgDiv1 : bgDiv2;
    const divInativo = (bgAtivo === 1) ? bgDiv2 : bgDiv1;

    divInativo.style.backgroundImage = `url('${fundosAnimados[proximoIndice]}')`;
    divAtivo.style.opacity = 0;   
    divInativo.style.opacity = 1; 

    indiceFundoAtual = proximoIndice;
    bgAtivo = (bgAtivo === 1) ? 2 : 1; 
}

function iniciarFundo() {
    precarregarImagens(); 
    bgDiv1.style.backgroundImage = `url('${fundosAnimados[0]}')`;
    bgDiv1.style.opacity = 1;
    intervaloDoFundo = setInterval(trocarFundo, 4000);
}

// Configuração Canvas
const canvas = document.querySelector("canvas"); 
const ctx = canvas.getContext("2d"); 

// Inicia com o tamanho atual
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 

ctx.imageSmoothingEnabled = false; 

// --- SISTEMA DE REDIMENSIONAMENTO ROBUSTO ---

function handleResize() {
    // 1. Atualiza o tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;

    // 2. Avisa o Jogador (se existir) para se ajustar
    if (player && typeof player.resize === 'function') {
        player.resize(canvas.width, canvas.height);
    }

    // 3. Avisa o Chefe (se existir)
    if (boss && typeof boss.resize === 'function') {
        boss.resize(canvas.width, canvas.height);
    }

    // 4. Avisa os Inimigos (Grid)
    if (grid && typeof grid.resize === 'function') {
        grid.resize(canvas.width, canvas.height);
    }

    // 5. Reposiciona os obstáculos
    obstacles.length = 0;
    InitObstacles();
}

window.addEventListener('resize', handleResize);

let currentState = GameState.START;

// Volumes
const DEFAULT_MUSIC_VOLUME = 0.10; 
const DEFAULT_FX_VOLUME = 0.50;   
let musicVolume = DEFAULT_MUSIC_VOLUME;
let fxVolume = DEFAULT_FX_VOLUME;

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

// Instanciação
const player = new Player(canvas.width, canvas.height); 
const grid = new Grid(3, 6); 

const activePowers = {
  speed: null,
  double_shot: null,
  shield: null,
};

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];
const powers = [];

let activePower = null;
let powerTimeLeft = 0;
let invaderShootInterval;
let invaderShootTime = 1000;

let boss = null;
let bossFightActive = false;

// Partículas
const PLAYER_DEATH_PARTICLES = [
    { color: '#cccccc', radius: 5 }, 
    { color: '#FFD700', radius: 4 }, 
    { color: '#87CEEB', radius: 3 }
];

const PLAYER_HIT_PARTICLES = [
    { color: 'lightgray',    radius: 4 },
    { color: '#87CEEB', radius: 4 } 
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

const InitObstacles = () => { 
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

const keys = { 
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

// Poderes
function activatePower(type) {
  const duration = 10; 
  switch (type) {
    case "speed":
      if (!activePowers.speed) player.velocity *= 1.8;
      activePowers.speed = duration;
      break;
    case "double_shot":
      if (!activePowers.double_shot) player.doubleShot = true;
      activePowers.double_shot = duration;
      break;
    case "extra_life":
        player.gainLife();
    break;
    case "shield":
      if (!activePowers.shield) player.shield = true;
      activePowers.shield = duration;
      break;
  }
}

function deactivatePower(type) {
  switch (type) {
    case "speed":
      player.velocity /= 1.8;
      break;
    case "double_shot":
      player.doubleShot = false;
      break;
    case "shield":
      player.shield = false;
      break;
  }
  activePowers[type] = null;
}

function deactivateAllPowers() {
  for (const type in activePowers) {
    if (activePowers[type] !== null) {
      deactivatePower(type);
    }
  }
}

function drawBossHealthBar(ctx) {
  if (!boss) return; 
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

// Funções de Desenho e Limpeza
const drawObstacles = () => obstacles.forEach((obstacle) => obstacle.draw(ctx));

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

const createExplosion = (position, radius, color) => {
    const particleCount = radius * 2;
    for (let i = 0; i < particleCount; i += 1) {
        particles.push(new Particle(
            { x: position.x, y: position.y },
            { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
            Math.random() * radius,
            color 
        ));
    }
};

function createExplosionEffect(target, particleDefinitions) {
    const targetCenter = {
        x: target.position.x + target.width / 2,
        y: target.position.y + target.height / 2,
    };
    particleDefinitions.forEach(particle => {
        createExplosion(targetCenter, particle.radius, particle.color);
    });
}

// Colisões
const checkShootInvaders = () => {
  grid.invaders.forEach((invader, invaderIndex) => {
    playerProjectiles.some((projectile, projectilesIndex) => {
      if (invader.hit(projectile)) {
        soundEffects.playHitSound();
         const power = invader.dropPower(player);
         if (power) powers.push(power); 

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
    if (invaderShootInterval) clearInterval(invaderShootInterval);

    invaderShootInterval = setInterval(() => {
        if (!bossFightActive && currentState === GameState.PLAYING) {
            const invader = grid.getRandomInvader();
            if (invader) invader.shoot(invaderProjectiles);
        }
    }, invaderShootTime);
};

const spawnGrid = () => {
  if (grid.invaders.length === 0 && !bossFightActive) {
    soundEffects.playNextLevelSound();
    gameData.level += 1;

    if (gameData.level > 0 && gameData.level % 3 === 0) {
        if (invaderShootTime > 250) {
            invaderShootTime -= 100; 
            startInvaderShooting(); 
        }
    }

    if (gameData.level > 0 && gameData.level % 3 === 0) {
        grid.invadersVelocity += 0.5; 
    }

    if (gameData.level > 0 && gameData.level % 5 === 0) {
        const bossHealth = (gameData.level % 10 === 0) ? 1000 : 500;
        bossFightActive = true;
        boss = new Boss(canvas.width, canvas.height, bossHealth);
    } else {
        grid.rows = Math.round(Math.random() * 4 + 1);
        grid.cols = Math.round(Math.random() * 4 + 1);
        grid.restart();
    }
  }
};

const gameOver = () => {
    player.alive = false;
    currentState = GameState.GAME_OVER;
    if (pauseButton) pauseButton.style.display = "none";
    if (gameOverScreen) gameOverScreen.classList.add('show');
    createExplosionEffect(player, PLAYER_DEATH_PARTICLES);
    
    // [LÓGICA] Esconde as bandeiras se morrer
    if (languageContainer) languageContainer.style.display = "none";
};

const resetGame = () => {
    player.restart(canvas.width, canvas.height);
    if (pauseButton) pauseButton.style.display = "none";

    killsUi.style.display = "none";
    scoreUi.style.display = "none";

    grid.restart();
    grid.invadersVelocity = 1;
    boss = null; 
    bossFightActive = false;
    invaderProjectiles.length = 0; 
    playerProjectiles.length = 0;
    particles.length = 0;
    gameData.score = 0;
    gameData.level = 1;
    gameData.invadersKilled = 0;
    gameData.bossesKilled = 0;
    invaderShootTime = 1000;
    
    if (invaderShootInterval) clearInterval(invaderShootInterval);
    if (bgm) {
        bgm.pause();
        bgm.currentTime = 0; 
    }
    if (gameOverScreen) gameOverScreen.classList.remove('show');
};

const updateGame = () => {
  if (!player.alive) gameOver();

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
};

const gameLoop = () => {
  // [CORREÇÃO FINAL] Verificação automática a cada quadro
  // Se a largura/altura da janela for diferente do canvas, redimensiona na hora.
  // Isso corrige o atraso do F11 sem precisar de F5.
  if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      handleResize();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const type in activePowers) {
    if (activePowers[type] !== null) {
      activePowers[type] -= 1 / 60;
      if (activePowers[type] <= 0) deactivatePower(type);
    }
  }

  if (currentState === GameState.PLAYING) {
    if (!player.alive) {
        deactivateAllPowers(); 
        gameOver();
    }
    updateGame();
  } else if (currentState === GameState.PAUSED) {
    drawParticles();
    drawProjectiles();
    drawObstacles();
    player.draw(ctx);
    player.drawLives(ctx);
    if (bossFightActive) {
      if(boss) boss.draw(ctx);
      drawBossHealthBar(ctx);
    } else {
      grid.draw(ctx);
    }
  } else if (currentState === GameState.GAME_OVER) {
    drawParticles();
    drawProjectiles();
    drawObstacles();
    grid.draw(ctx);
  }

  powers.forEach((power, index) => {
    power.update();
    power.draw(ctx);
    if (power.collectedBy(player)) {
      activatePower(power.type);
      powers.splice(index, 1);
    }
  });

  const powersBarContainer = document.getElementById("powers-bar-container");
  powersBarContainer.innerHTML = "";
  const powerColors = { shield: "#3498db", double_shot: "#8e44ad", speed: "#f1c40f" };

  for (const type in activePowers) {
    if (activePowers[type] !== null) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("power-bar-wrapper");
        const nameDiv = document.createElement("div");
        nameDiv.classList.add("power-bar-name");
        nameDiv.textContent = type.toUpperCase();
        const barDiv = document.createElement("div");
        barDiv.classList.add("power-bar");
        const innerDiv = document.createElement("div");
        innerDiv.classList.add("power-bar-inner");
        innerDiv.style.backgroundColor = powerColors[type] || "#ffff00"; 
        const percentage = Math.max(0, activePowers[type] / 10 * 100); 
        innerDiv.style.width = percentage + "%";
        barDiv.appendChild(innerDiv);
        wrapper.appendChild(nameDiv);
        wrapper.appendChild(barDiv);
        powersBarContainer.appendChild(wrapper);
    }
  }
  requestAnimationFrame(gameLoop); 
};

const pauseGame = () => {
  if (currentState !== GameState.PLAYING) return; 
  currentState = GameState.PAUSED;
  pauseScreen.classList.add("show");
  clearInterval(invaderShootInterval); 
  if (bgm) bgm.pause(); 
  
  // [LÓGICA] Esconde no Pause
  if (languageContainer) languageContainer.style.display = "none";
};

const resumeGame = () => {
  if (currentState !== GameState.PAUSED) return; 
  currentState = GameState.PLAYING;
  pauseScreen.classList.remove("show");
  startInvaderShooting(); 
  if (bgm) bgm.play(); 

  // [LÓGICA] Mantém escondido ao voltar do pause
  if (languageContainer) languageContainer.style.display = "none";
};

const updateVolumeDisplays = (musicVal, fxVal) => {
  musicVolumeSlider.value = musicVal;
  pauseMusicVolumeSlider.value = musicVal;
  fxVolumeSlider.value = fxVal;
  pauseFxVolumeSlider.value = fxVal;
  musicVolumeLabel.textContent = `${musicVal}%`;
  pauseMusicVolumeLabel.textContent = `${musicVal}%`;
  fxVolumeLabel.textContent = `${fxVal}%`;
  pauseFxVolumeLabel.textContent = `${fxVal}%`;
};

const handleMusicVolumeChange = (value) => {
  musicVolume = value / 100;
  if (bgm) bgm.volume = musicVolume;
  updateVolumeDisplays(value, fxVolume * 100);
};

const handleFxVolumeChange = (value) => {
  fxVolume = value / 100;
  soundEffects.setVolume(fxVolume);
  updateVolumeDisplays(musicVolume * 100, value);
};

const handleResetSettings = () => {
  musicVolume = DEFAULT_MUSIC_VOLUME;
  fxVolume = DEFAULT_FX_VOLUME;
  if (bgm) bgm.volume = musicVolume;
  soundEffects.setVolume(fxVolume);
  updateVolumeDisplays(DEFAULT_MUSIC_VOLUME * 100, DEFAULT_FX_VOLUME * 100);
};

musicVolumeSlider.addEventListener("input", (e) => handleMusicVolumeChange(e.target.value));
pauseMusicVolumeSlider.addEventListener("input", (e) => handleMusicVolumeChange(e.target.value));
fxVolumeSlider.addEventListener("input", (e) => handleFxVolumeChange(e.target.value));
pauseFxVolumeSlider.addEventListener("input", (e) => handleFxVolumeChange(e.target.value));
resetSettingsBtn.addEventListener("click", handleResetSettings);
pauseResetSettingsBtn.addEventListener("click", handleResetSettings);
updateVolumeDisplays(musicVolume * 100, fxVolume * 100);

addEventListener ("keyup", (event) => {
  const key = event.key.toLowerCase();  
  if (key === "a") keys.left.pressed = false;
  if (key === "d") keys.right.pressed = false;
  if (key === "enter" || key === ' ') {
    keys.shoot.pressed = false;
    keys.shoot.released = true; 
  }
});

addEventListener("mousedown", (event) => {
    if (event.button === 0) keys.shoot.pressed = true;
});

addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

// ----------------------------------------------------
// LÓGICA DE INTERAÇÃO DE TELAS E BOTÕES
// ----------------------------------------------------

// 1. Botão Play (Tela Principal) -> Abre Seleção de Skin
buttonPlay.addEventListener("click", () => {
    startScreen.style.display = "none"; 
    skinSelectionScreen.classList.add("show"); 
});

// 2. Botões de Seleção de Skin -> Iniciam o Jogo
skinButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const selectedSkin = btn.getAttribute("data-skin"); 

        // Atualiza a imagem usando o novo método da classe Player
        const newPath = `src/assets/images/${selectedSkin}.png`;
        player.updateSkin(newPath);

        // Inicia o jogo
        skinSelectionScreen.classList.remove("show");
        scoreUi.style.display = "block";
        killsUi.style.display = "flex";

        if (pauseButton) pauseButton.style.display = "flex";

        currentState = GameState.PLAYING;
        startInvaderShooting();

        if (bgm) {
            bgm.volume = musicVolume; 
            bgm.play();
        }

        // [LÓGICA] ESCONDE A BANDEIRA AO INICIAR
        if (languageContainer) languageContainer.style.display = "none";
    });
});

optionsBtn.addEventListener("click", () => {
  startScreen.style.display = "none"; 
  settingsScreen.classList.add("show"); 
});

instructionsBtn.addEventListener("click", () => {
  startScreen.style.display = "none";   
  instructionsScreen.classList.add("show"); 
});

backToStartButtons.forEach(button => {
    button.addEventListener("click", () => {
        startScreen.style.display = "flex"; 

        const parentMenu = button.closest(".menu-screen");
        if (parentMenu) parentMenu.classList.remove("show");

        const parentGameOver = button.closest(".game-over");
        if (parentGameOver) {
            resetGame(); 
            currentState = GameState.START; 
        }

        // [LÓGICA] MOSTRA A BANDEIRA AO VOLTAR PARA A TELA INICIAL
        if (languageContainer) languageContainer.style.display = "block";
    });
});

buttonRestart.addEventListener("click", () => {
    deactivateAllPowers(); 
    resetGame(); 
    currentState = GameState.PLAYING;
    killsUi.style.display = "flex";
    scoreUi.style.display = "block"; 
    if (pauseButton) pauseButton.style.display = "flex";
    startInvaderShooting();
    if (bgm) bgm.play();

    // [LÓGICA] GARANTE QUE ESTÁ ESCONDIDA NO REINÍCIO
    if (languageContainer) languageContainer.style.display = "none";
});

addEventListener ("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "escape") {
    if (currentState === GameState.PLAYING) pauseGame();
    else if (currentState === GameState.PAUSED) resumeGame();
  }
  if (currentState !== GameState.PLAYING) return; 
  if (key === "a") keys.left.pressed = true;
  if (key === "d") keys.right.pressed = true;
  if (key === "enter" || key === ' ') keys.shoot.pressed = true;
});

buttonResume.addEventListener("click", resumeGame);

buttonPauseRestart.addEventListener("click", () => {
  pauseScreen.classList.remove("show"); 
  resetGame(); 
  currentState = GameState.PLAYING;
  killsUi.style.display = "flex";
  scoreUi.style.display = "block"; 
  if (pauseButton) pauseButton.style.display = "flex";
  startInvaderShooting();
  if (bgm) bgm.play(); 
  
  // [LÓGICA] Esconde ao reiniciar pelo pause
  if (languageContainer) languageContainer.style.display = "none";
});

buttonPauseQuit.addEventListener("click", () => {
  pauseScreen.classList.remove("show"); 
  resetGame(); 
  currentState = GameState.START;
  startScreen.style.display = "flex"; 

  // [LÓGICA] Mostra ao sair para o menu principal
  if (languageContainer) languageContainer.style.display = "block";
});

pauseButton.addEventListener("click", () => {
    if (currentState === GameState.PLAYING) pauseGame();
});

iniciarFundo();
gameLoop();