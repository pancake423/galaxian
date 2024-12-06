class Player {
  constructor() {
    this.x = 0;
    this.y = -GAME_Z_PLANE + 2;
    this.z = GAME_Z_PLANE;

    this.mx = 0;
    this.maxSpeed = 8;
    this.accel = 50;
    this.fric = 15;

    this.maxYaw = -20;
    this.maxRoll = -20;

    this.firingDelay = 1000;
    this.tFire = Date.now() - 500;
    this.bulletYSpeed = 15;

    this.maxPos = GAME_Z_PLANE;

    this.roll = 0;
    this.pitch = 20;
    this.yaw = 0;

    this.scale = [1, 1, 1];

    this.isDespawned = false;
    this.isRespawning = false;

    this.t = Date.now();
  }

  update() {
    if (this.isRespawning) {
      const dt = Date.now() - this.t;
      this.mx = 0;
      // needs to fly 4 z units, +4 y units
      this.z += dt / 500;
      //this.yaw += (dt / 1000) * 180;
      this.roll += (dt / 1000) * 180;
      if (this.z > GAME_Z_PLANE) {
        this.isRespawning = false;
        this.isDespawned = false;
        this.y = -GAME_Z_PLANE + 2;
        this.z = GAME_Z_PLANE;
      }
      this.t = Date.now();
    }
    if (this.isDespawned) return;
    const dt = Date.now() - this.t;
    // shooting
    if (keys.isPressed("Space") && this.t - this.tFire > this.firingDelay) {
      this.tFire = this.t;
      const b = new Bullet(
        [this.x, this.y + this.scale[1] / 2],
        [0, this.bulletYSpeed],
        true,
      );
      bullets.push(b);
    }
    // movement
    if (keys.isPressed("KeyA") || keys.isPressed("ArrowLeft")) {
      this.mx += (this.accel * dt) / 1000;
    }
    if (keys.isPressed("KeyD") || keys.isPressed("ArrowRight")) {
      this.mx -= (this.accel * dt) / 1000;
    }
    this.mx -= (Math.sign(this.mx) * this.fric * dt) / 1000;
    if (Math.abs(this.mx) <= (this.fric * dt) / 1000) this.mx = 0;
    if (Math.abs(this.mx) > this.maxSpeed)
      this.mx = this.maxSpeed * Math.sign(this.mx);
    this.x += (this.mx * dt) / 1000;

    if (Math.abs(this.x) > this.maxPos) {
      this.x = Math.sign(this.x) * this.maxPos;
    }

    this.yaw = this.maxYaw * (this.mx / this.maxSpeed);
    this.roll = this.maxRoll * (this.mx / this.maxSpeed);

    this.t = Date.now();
  }

  draw() {
    renderer.draw(
      "ship",
      [this.x, this.y, this.z],
      [this.pitch, this.roll, this.yaw],
      this.scale,
    );
  }

  getBoundingRect() {
    return [
      this.x - this.scale[0],
      this.y - this.scale[1],
      this.scale[0] * 2,
      this.scale[1] * 2,
    ];
  }

  kill() {
    events.raiseEvent("playerKill");
  }
  despawn() {
    // move the ship out of the way and to safety.
    // wait for respawn command to move it back.
    this.isDespawned = true;
    this.x = 0;
    this.z = GAME_Z_PLANE - 4;
    this.uuid = events.addListener("KeyEnter", () => {
      events.removeListener(this.uuid);
      this.respawn();
    });
    ui.t = Date.now();
  }
  respawn() {
    //start the animation for the player's ship respawning
    this.isRespawning = true;
    this.t = Date.now();
    this.roll = 0;
    this.pitch = 20;
    this.yaw = 0;
  }
}
