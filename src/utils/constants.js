export const PATH_PLAYER_IMAGE = 'src/assets/images/player.png'; // sprite jogador 1
export const PATH_PLAYER_IMAGE_2 = 'src/assets/images/player2.png'; // sprite jogador 2
export const PATH_PLAYER_IMAGE_3 = 'src/assets/images/player3.png'; // sprite jogador 3
export const PATH_ENGINE_SPRITES = 'src/assets/images/engine_sprites.png'; // sprites do motor
export const PATH_INVADER_IMAGE = 'src/assets/images/invader.png'; // sprite invasor
export const PATH_BOSS_IMAGE = 'src/assets/images/Boss.png'; // sprite boss
export const PATH_LIFE_IMAGE = 'src/assets/images/life.png'; // ícone de vida
export const INITIAL_FRAMES = 8; // frames iniciais de animação
export const PATH_BACKGROUND_IMAGE = 'src/assets/images/fundo1.png'; // fundo 1
export const PATH_BACKGROUND_IMAGE_2 = 'src/assets/images/fundo2.png'; // fundo 2
export const PATH_BACKGROUND_IMAGE_3 = 'src/assets/images/fundo3.png'; // fundo 3
export const PATH_PAUSED_IMAGE = 'src/assets/images/paused.png'; // imagem de pause

export const GameState = {
    START: 'START', // tela inicial
    PLAYING: 'PLAYING', // jogo em andamento
    GAME_OVER: 'GAME_OVER', // fim de jogo
    PAUSED: 'PAUSED' // jogo pausado
}

export const POWER_TYPES = ["speed", "double_shot", "shield", "extra_life"]; // tipos de power-ups

export const POWER_IMAGES = {
    speed: "src/assets/images/speed.png", // imagem velocidade
    double_shot: "src/assets/images/projectils.png", // imagem tiro duplo
    shield: "src/assets/images/protection.png", // imagem escudo
    extra_life: "src/assets/images/life.png" // imagem vida extra
};