class SoundEffects {
    constructor() {
    this.fxVolume = 1.0

        this.shootSounds = [
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
        ];

        this.hitSounds = [
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
        ];

        this.explosionSound = new Audio("src/assets/audios/explosion.mp3");
        this.nextLevelSound = new Audio("src/assets/audios/next_level.mp3");

        this.currentShootSound = 0;
        this.currentHitSound = 0;

        this.adjustVolumes();
    }

    setVolume(level) {
        // 1. Guarda o novo volume master (ex: 0.5 para 50%)
        this.fxVolume = level;
        
        // 2. Chama sua função de ajuste para re-aplicar todos os volumes
        this.adjustVolumes();
    }

    playShootSound() {
        this.shootSounds[this.currentShootSound].currentTime = 0;
        this.shootSounds[this.currentShootSound].play();
        this.currentShootSound =
            (this.currentShootSound + 1) % this.shootSounds.length;
    }

    playHitSound() {
        this.hitSounds[this.currentHitSound].currentTime = 0;
        this.hitSounds[this.currentHitSound].play();
        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length;
    }

    playExplosionSound() {
        this.explosionSound.currentTime = 0;
        this.explosionSound.play();
    }

    playNextLevelSound() {
        this.nextLevelSound.play();
    }

    adjustVolumes() {
        const baseHitVolume = 0.2;
        const baseShootVolume = 0.5;
        const baseExplosionVolume = 0.2;
        const baseNextLevelVolume = 0.4;

    this.hitSounds.forEach((sound) => (sound.volume = baseHitVolume * this.fxVolume));
    this.shootSounds.forEach((sound) => (sound.volume = baseShootVolume * this.fxVolume));
    this.explosionSound.volume = baseExplosionVolume * this.fxVolume;
    this.nextLevelSound.volume = baseNextLevelVolume * this.fxVolume;
  }
}

export default SoundEffects;