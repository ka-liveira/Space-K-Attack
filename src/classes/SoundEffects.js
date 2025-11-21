class SoundEffects {
    constructor() {
        this.fxVolume = 1.0; // volume master dos efeitos (0.0 a 1.0)

        this.shootSounds = [ // pool de sons de tiro
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
        ];

        this.hitSounds = [ // pool de sons de acerto
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
        ];

        this.explosionSound = new Audio("src/assets/audios/explosion.mp3"); // som de explosão
        this.nextLevelSound = new Audio("src/assets/audios/next_level.mp3"); // som de próximo nível

        this.currentShootSound = 0; // índice atual do pool de tiro
        this.currentHitSound = 0; // índice atual do pool de acerto

        this.adjustVolumes(); // aplica volumes iniciais
    }

    setVolume(level) { // ajusta volume master
        this.fxVolume = level; // define novo volume (0.0 a 1.0)
        this.adjustVolumes(); // reaplica volumes
    }

    playShootSound() { // toca som de tiro
        this.shootSounds[this.currentShootSound].currentTime = 0; // reinicia áudio
        this.shootSounds[this.currentShootSound].play(); // reproduz som
        this.currentShootSound = (this.currentShootSound + 1) % this.shootSounds.length; // próximo do pool
    }

    playHitSound() { // toca som de acerto
        this.hitSounds[this.currentHitSound].currentTime = 0; // reinicia áudio
        this.hitSounds[this.currentHitSound].play(); // reproduz som
        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length; // próximo do pool
    }

    playExplosionSound() { // toca som de explosão
        this.explosionSound.currentTime = 0; // reinicia áudio
        this.explosionSound.play(); // reproduz som
    }

    playNextLevelSound() { // toca som de próximo nível
        this.nextLevelSound.play(); // reproduz som
    }

    adjustVolumes() { // ajusta volumes individuais baseado no master
        const baseHitVolume = 0.2; // volume base de acerto
        const baseShootVolume = 0.5; // volume base de tiro
        const baseExplosionVolume = 0.2; // volume base de explosão
        const baseNextLevelVolume = 0.4; // volume base de próximo nível

        this.hitSounds.forEach((sound) => (sound.volume = baseHitVolume * this.fxVolume)); // aplica volume em acertos
        this.shootSounds.forEach((sound) => (sound.volume = baseShootVolume * this.fxVolume)); // aplica volume em tiros
        this.explosionSound.volume = baseExplosionVolume * this.fxVolume; // aplica volume em explosão
        this.nextLevelSound.volume = baseNextLevelVolume * this.fxVolume; // aplica volume em próximo nível
    }
}

export default SoundEffects;