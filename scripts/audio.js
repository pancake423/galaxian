class Sounds {
  constructor() {
    this.music = new Audio("assets/8bit-music-for-game-68698.mp3");
    this.music.loop = true;
    this.music.volume = 0.4;
    this.music.playbackRate = 0.9;
    this.death = new Audio("assets/videogame-death-sound-43894.mp3");
    this.lasers = [];
    for (let i = 0; i < 8; i++) {
      const l = new Audio("assets/8-bit-laser-151672.mp3");
      l.volume = 0.8;
      this.lasers.push(l);
    }
    this.lidx = 0;
    this.hum = new Audio("assets/power-buzz-sfx-loop-86766.mp3");
    this.hum.loop = true;
    this.hum.volume = 0.5;
    this.explosion = [];
    this.eidx = 0;
    for (let i = 0; i < 8; i++) {
      const l = new Audio("assets/8-bit-explosion-1_2-98274.mp3");
      this.explosion.push(l);
    }
    this.upgrade = new Audio("assets/arcade-ui-6-229503.mp3");
    this.warp = new Audio("assets/rocket-launch-sfx-253937.mp3");
    this.warp.volume = 0.4;
    this.level = new Audio("assets/cute-level-up-3-189853.mp3");
  }
  // allows for multiple overlapping laser sounds
  playLaser() {
    this.lasers[this.lidx].play();
    this.lidx = (this.lidx + 1) % 8;
  }
  playExplosion() {
    this.explosion[this.eidx].play();
    this.eidx = (this.eidx + 1) % 8;
  }
}
