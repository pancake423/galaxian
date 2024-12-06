class Missile {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.roll = 0;

    this.alive = true;

    this.missileSpeed = 2;
    this.explosionRadius = 3;
    this.t = Date.now();

    this.lastParticle = Date.now();
    this.particleInterval = 10;
  }
  isColliding(x, y, w, h) {
    return this.x >= x && this.x <= x + w && this.y >= y && this.y <= y + h;
  }

  update() {
    const dt = Date.now() - this.t;
    this.y += (this.missileSpeed * dt) / 1000;
    this.missileSpeed += (this.missileSpeed * dt) / 1000;
    this.roll += ((this.missileSpeed * dt) / 1000) * 90;
    // check for collision w/ aliens
    for (const alien of aliens) {
      if (this.isColliding(...alien.getBoundingRect())) {
        this.explode();
      }
    }
    if (Math.abs(this.y) > GAME_Z_PLANE + 1) this.kill();
    if (this.t - this.lastParticle >= this.particleInterval) {
      this.lastParticle = this.t;
      const p = new Particle(
        utils.choice(["particleRed", "particleRed", "particleYellow"]),
        this.x,
        this.y - 0.3,
        this.z + 0.5,
        utils.uniform(-1, 1),
        -this.missileSpeed,
        utils.uniform(-1, 1),
      );
      particles.push(p);
    }
    this.t = Date.now();
  }

  explode() {
    this.alive = false;
    sounds.warp.pause();
    particleExplosion(this.x, this.y, this.z, ["particleRed"], 100, 5);
    for (const alien of aliens) {
      const rect = alien.getBoundingRect();
      const x = rect[0] + rect[2] / 2;
      const y = rect[1] + rect[3] / 2;
      if (Math.hypot(x - this.x, y - this.y) < this.explosionRadius) {
        alien.health -= Math.max(alien.maxHealth / 2, 25);
      }
    }
  }

  kill() {
    this.alive = false;
    sounds.warp.pause();
  }

  draw() {
    renderer.draw(
      "missile",
      [this.x, this.y, this.z + 0.5],
      [0, this.roll, 0],
      [0.5, 0.5, 0.5],
    );
  }
}
