class Boss {
  constructor(health) {
    this.x = 0;
    this.y = 4;
    this.z = GAME_Z_PLANE - 1.5;
    this.alive = true;

    this.dx = 0;
    this.yaw = 0;
    this.health = health;
    this.maxHealth = health;
    this.scale = [1.5, 1.5, 1.5];
    this.t = Date.now();

    this.minionInterval = (GlobalAlienControls.descentFrequency - 1) * 1000;
    this.numMinions = 3;
    this.minionTime = Date.now();
    sounds.hum.play();
  }

  update() {
    const dt = Date.now() - this.t;
    if (this.health <= 0) {
      this.kill();
    }
    this.dx =
      Math.sin(((this.t / 1000) * GlobalAlienControls.oscillateSpeed) / 2) *
      GlobalAlienControls.oscillateDist *
      2;
    this.yaw += (dt / 1000) * 30;
    if (this.t - this.minionTime >= this.minionInterval) {
      const n = utils.randRange(1, this.numMinions);
      for (let i = 0; i < n; i++) {
        const a = new Alien(
          this.x + this.dx + utils.uniform(-2, 2),
          this.y + utils.uniform(-2, 2),
          Math.random() < 0.3 ? "alien2" : "alien1",
        );
        a.bomber = true;
        a.dropIn = false;
        a.descend();
        aliens.push(a);
      }
      this.minionTime = this.t;
    }

    this.t = Date.now();
  }

  kill() {
    this.alive = false;
    sounds.hum.pause();
    sounds.playExplosion();
    sounds.playExplosion();
    sounds.playExplosion();
    events.raiseEvent("alienKill", "boss");
    particleExplosion(
      this.x + this.dx,
      this.y,
      this.z,
      ["particleGreen"],
      100,
      10,
      2,
    );
    if (aliens.length == 1) events.raiseEvent("levelCleared");
  }

  getBoundingRect() {
    return [
      this.x - this.scale[0] * 1 + this.dx,
      this.y - this.scale[1] * 1,
      this.scale[0] * 2,
      this.scale[1] * 2,
    ];
  }

  draw() {
    renderer.draw(
      "boss",
      [this.x + this.dx, this.y, this.z],
      [0, 0, this.yaw],
      this.scale,
    );
    ui.drawHealthBar(this.health / this.maxHealth);
  }
}
