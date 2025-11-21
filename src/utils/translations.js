export const LANGUAGES = {
    PT: 'pt',
    EN: 'en',
    ES: 'es'
};

let currentLanguage = LANGUAGES.PT;

// Dicionário de textos
const TEXTS = {
    [LANGUAGES.PT]: {
        // HUD
        SCORE: "Pontuação",
        LEVEL: "Nível",
        HIGH: "Recorde",
        INVADERS: "Invasores",
        BOSS: "Boss",

        // Menu Principal
        PLAY: "Jogar",
        OPTIONS: "Opções",
        INSTRUCTIONS: "Instruções",

        // Seleção de Skin
        CHOOSE_PILOT: "Escolha seu Jogador",
        CAT_1: "Gato 1",
        CAT_2: "Gato 2",
        CAT_3: "Gato 3",
        BACK: "Voltar",

        // Opções
        MUSIC: "Música",
        EFFECTS: "Efeitos",
        RESET: "Resetar",

        // Instruções
        HOW_TO_PLAY: "Como Jogar",
        MOVE_LEFT: "Move para a esquerda",
        MOVE_RIGHT: "Move para a direita",
        SHOOT: "Dispara",
        PAUSE_GAME: "Pausa o Jogo",
        KEY_SPACE: "Espaço",
        KEY_ENTER: "Enter",
        KEY_CLICK: "Click Esq. mouse",
        KEY_ESC: "Esc",

        // Game Over
        GAME_OVER: "Fim de Jogo",
        RESTART: "Reiniciar",
        EXIT: "Sair",

        // Pause
        PAUSED: "Pausado",
        RESUME: "Continuar"
    },
    [LANGUAGES.EN]: {
        SCORE: "Score",
        LEVEL: "Level",
        HIGH: "High",
        INVADERS: "Invaders",
        BOSS: "Boss",

        PLAY: "Play",
        OPTIONS: "Options",
        INSTRUCTIONS: "Instructions",

        CHOOSE_PILOT: "Choose your Player",
        CAT_1: "Cat 1",
        CAT_2: "Cat 2",
        CAT_3: "Cat 3",
        BACK: "Back",

        MUSIC: "Music",
        EFFECTS: "Effects",
        RESET: "Reset",

        HOW_TO_PLAY: "How to Play",
        MOVE_LEFT: "Move left",
        MOVE_RIGHT: "Move right",
        SHOOT: "Shoot",
        PAUSE_GAME: "Pause Game",
        KEY_SPACE: "Space",
        KEY_ENTER: "Enter",
        KEY_CLICK: "Left Click",
        KEY_ESC: "Esc",

        GAME_OVER: "Game Over",
        RESTART: "Restart",
        EXIT: "Exit",

        PAUSED: "Paused",
        RESUME: "Resume"
    },
    [LANGUAGES.ES]: {
        SCORE: "Puntuación",
        LEVEL: "Nivel",
        HIGH: "Récord",
        INVADERS: "Invasores",
        BOSS: "Jefe",

        PLAY: "Jugar",
        OPTIONS: "Opciones",
        INSTRUCTIONS: "Instrucciones",

        CHOOSE_PILOT: "Elige tu Jugador",
        CAT_1: "Gato 1",
        CAT_2: "Gato 2",
        CAT_3: "Gato 3",
        BACK: "Volver",

        MUSIC: "Música",
        EFFECTS: "Efectos",
        RESET: "Reiniciar",

        HOW_TO_PLAY: "Cómo Jugar",
        MOVE_LEFT: "Mover izquierda",
        MOVE_RIGHT: "Mover derecha",
        SHOOT: "Disparar",
        PAUSE_GAME: "Pausar Juego",
        KEY_SPACE: "Espacio",
        KEY_ENTER: "Enter",
        KEY_CLICK: "Click Izquierdo",
        KEY_ESC: "Esc",

        GAME_OVER: "Juego Terminado",
        RESTART: "Reiniciar",
        EXIT: "Salir",

        PAUSED: "Pausado",
        RESUME: "Continuar"
    }
};

// Função para alterar o idioma
export function setLanguage(lang) {
    if (Object.values(LANGUAGES).includes(lang)) {
        currentLanguage = lang;
        updateStaticHTML(); // Atualiza o HTML imediatamente
    }
}

// Função para pegar um texto específico no JS (se precisar)
export function t(key) {
    return TEXTS[currentLanguage][key] || key;
}

export function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Esta função mágica procura os elementos no HTML e
 * substitui o texto sem quebrar os números ou spans.
 */
function updateStaticHTML() {
    // --- HUD (Topo) ---
    updateHUD('.score-ui .score', 'SCORE');
    updateHUD('.score-ui .level', 'LEVEL');
    updateHUD('.score-ui .high', 'HIGH');
    updateHUD('.kills-invaders', 'INVADERS');
    updateHUD('.kills-boss', 'BOSS');

    // --- Menu Principal ---
    setText('.button-play', 'PLAY');
    setText('#options-btn', 'OPTIONS');
    setText('#instructions-btn', 'INSTRUCTIONS');

    // --- Seleção de Skin ---
    setText('#skin-selection-screen h1', 'CHOOSE_PILOT');
    setText('.skin-btn[data-skin="player"] p', 'CAT_1');
    setText('.skin-btn[data-skin="player2"] p', 'CAT_2');
    setText('.skin-btn[data-skin="player3"] p', 'CAT_3');
    
    // Botões "Voltar" (Existem vários com a mesma classe)
    const backButtons = document.querySelectorAll('.button-back-to-start');
    backButtons.forEach(btn => {
        // Cuidado para não alterar o botão "Sair" do Game Over que usa essa classe
        if (btn.id !== 'button-pause-quit' && !btn.parentElement.parentElement.classList.contains('game-over')) {
             btn.innerText = t('BACK');
        }
    });

    // --- Opções ---
    setText('#settings-screen h1', 'OPTIONS');
    updateLabel('#music-volume-label', 'MUSIC');
    updateLabel('#fx-volume-label', 'EFFECTS');
    setText('#reset-settings-btn', 'RESET');

    // --- Instruções ---
    setText('#instructions-screen h1', 'HOW_TO_PLAY');
    
    // Atualiza lista de ações (ordem importa baseada no seu HTML)
    const actions = document.querySelectorAll('.action-text');
    if (actions.length >= 6) {
        actions[0].innerText = t('MOVE_LEFT');
        actions[1].innerText = t('MOVE_RIGHT');
        actions[2].innerText = t('SHOOT');
        actions[3].innerText = t('SHOOT');
        actions[4].innerText = t('SHOOT');
        actions[5].innerText = t('PAUSE_GAME');
    }
    
    // Teclas (opcional, traduzir "Espaço", "Click", etc)
    const keys = document.querySelectorAll('.key');
    // Exemplo: keys[2] é Espaço
    if(keys.length >= 6) {
        keys[2].innerText = t('KEY_SPACE');
        keys[4].innerText = t('KEY_CLICK');
    }

    // --- Game Over ---
    setText('.game-over h1', 'GAME_OVER');
    setText('.game-over .button-restart', 'RESTART');
    
    // O botão Exit do Game Over usa a classe .button-back-to-start
    const gameOverDiv = document.querySelector('.game-over div');
    if (gameOverDiv) {
        const exitBtn = gameOverDiv.querySelector('.button-back-to-start');
        if (exitBtn) exitBtn.innerText = t('EXIT');
    }

    // --- Pause Screen ---
    setText('#pause-screen h1', 'PAUSED');
    updateLabel('#pause-music-volume-label', 'MUSIC');
    updateLabel('#pause-fx-volume-label', 'EFFECTS');
    setText('#pause-reset-settings-btn', 'RESET');
    setText('#button-resume', 'RESUME');
    setText('#button-pause-restart', 'RESTART');
    setText('#button-pause-quit', 'EXIT');
}

// --- Funções Auxiliares ---

function setText(selector, key) {
    const el = document.querySelector(selector);
    if (el) el.innerText = t(key);
}

// Para HUD: "score: <span>0</span>" -> mantem o span
function updateHUD(selector, key) {
    const el = document.querySelector(selector);
    if (el) {
        const span = el.querySelector('span');
        if (span) {
            // Guarda o valor numérico
            const val = span.outerHTML; 
            // Reescreve: TEXTO: <span>VALOR</span>
            el.innerHTML = `${t(key)}: ${val}`;
        }
    }
}

// Para Labels: "Música: <span>10%</span>" -> mantem o span
function updateLabel(spanIdSelector, key) {
    const span = document.querySelector(spanIdSelector); // ex: #music-volume-label
    if (span && span.parentElement) {
        const parent = span.parentElement; // o label
        const val = span.outerHTML; // o html do span
        parent.innerHTML = `${t(key)}: ${val}`;
    }
}