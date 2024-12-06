class Bullet {
  constructor(pos, mtm, player = true) {
    [this.x, this.y] = pos;
    [this.mx, this.my] = mtm;
    this.z = GAME_Z_PLANE;

    this.isPlayer = player;
    this.t = Date.now();
    this.alive = true;
  }

  update() {
    const dt = Date.now() - this.t;

    this.x += (this.mx * dt) / 1000;
    this.y += (this.my * dt) / 1000;

    if (Math.abs(this.y) > GAME_Z_PLANE + 1) this.kill();

    this.t = Date.now();
  }

  draw() {
    renderer.draw(
      this.isPlayer ? "pbullet" : "abullet",
      [this.x, this.y, this.z],
      [0, 0, 0],
      [0.2, 0.2, 0.2],
    );
  }

  isColliding(x, y, w, h) {
    return this.x >= x && this.x <= x + w && this.y >= y && this.y <= y + h;
  }

  kill() {
    this.alive = false;
  }
}

function updateBullets() {
  bullets = bullets.filter((b) => b.alive);
  for (const b of bullets) {
    b.update();
    if (b.isPlayer) {
      for (const a of aliens) {
        if (a.dz == 0 && b.isColliding(...a.getBoundingRect())) {
          a.kill();
          b.kill();
        }
      }
    } else if (
      player.z == GAME_Z_PLANE &&
      b.isColliding(...player.getBoundingRect())
    ) {
      // the player has been struck!
      player.kill();
    }
  }
}

function drawBullets() {
  for (const b of bullets) {
    b.draw();
  }
}
