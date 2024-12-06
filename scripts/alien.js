class Alien {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.z = GAME_Z_PLANE;
    this.type = type;
    this.alive = true;

    this.roll = 0;
    this.pitch = -10;
    this.yaw = 0;

    this.minWingAngle = -70;
    this.maxWingAngle = -10;

    this.r = utils.randRange(0, 1000);

    this.inFormation = false;
    this.dropIn = true;
    this.lowering = false;
    this.dx = 0;
    this.dy = GAME_Z_PLANE + this.y;
    this.dz = -1;

    this.scale = type == "alien1" ? [0.5, 0.5, 0.5] : [0.6, 0.6, 0.6];
    this.maxBullets = type == "alien1" ? 2 : 5;
    this.bulletInterval = type == "alien1" ? 400 : 200;
    this.shotsFired = 0;

    this.t = Date.now();
    this.descendStart = this.t;
  }

  update() {
    const dt = Date.now() - this.t;
    this.pitch = this.roll = 0;
    this.dx =
      Math.sin((this.t / 1000) * GlobalAlienControls.oscillateSpeed) *
      GlobalAlienControls.oscillateDist;
    if (!this.inFormation) {
      if (!this.dropIn && !this.lowering) {
        this.dx += this.descentFunctionX(this.t);
        this.dy = this.descentFunctionY(this.t);
        this.dz = this.descentFunctionZ(this.t);
        this.pitch = this.descentFunctionAngle(this.t);
        this.roll = this.descentFunctionAngle(this.t);
        const bulletTime = (this.t - this.descendStart) / this.bulletInterval;
        if (
          bulletTime > 0 &&
          bulletTime > this.shotsFired &&
          this.shotsFired < this.maxBullets
        ) {
          const b = new Bullet(
            [this.x + this.dx, this.y - this.scale[1] / 2 + this.dy],
            [0, -GlobalAlienControls.bulletSpeed],
            false,
          );
          bullets.push(b);
          this.shotsFired++;
        }
      }
      if (this.dropIn) {
        this.dy -= (dt / 1000) * (Math.max(1, this.dy) + 0.5);
        if (this.dy < 0) {
          this.dropIn = false;
          this.lowering = true;
        }
      }
      if (this.y + this.dy <= -GAME_Z_PLANE - 1) {
        this.dy = GAME_Z_PLANE + 1;
        this.dropIn = true;
        this.dz -= 1;
      }
    }
    if (this.lowering) {
      this.dz += dt / 1000;
      if (this.dz >= 0) {
        this.dz = 0;
        this.lowering = false;
        this.inFormation = true;
      }
    }
    this.t = Date.now();
  }

  draw() {
    renderer.draw(
      this.type,
      [this.x + this.dx, this.y + this.dy, this.z + this.dz],
      [this.pitch, this.roll, this.yaw],
      this.scale,
    );
    const transformArgs = [
      [this.x + this.dx, this.y + this.dy, this.z + this.dz],
      [this.pitch, this.roll, this.yaw],
      this.scale,
    ];
    if (this.type == "alien1") {
      const wingAngle =
        ((Math.cos(((this.t + this.r) / 1000) * GlobalAlienControls.flapSpeed) +
          1) /
          2) *
          (this.maxWingAngle - this.minWingAngle) +
        this.minWingAngle;
      const t1 = computePreTransform(
        [wingAngle, 30, 180],
        [0.2, 0.35, -0.25],
        [1, 1, 1],
      );
      const t2 = computePreTransform(
        [wingAngle, -30, 180],
        [-0.2, 0.35, -0.25],
        [1, 1, 1],
      );
      renderer.draw("wing1", ...transformArgs, t1);
      renderer.draw("wing1", ...transformArgs, t2);
    }
    if (this.type == "alien2") {
      const wingAngle =
        Math.cos(((this.t + this.r) / 1000) * GlobalAlienControls.flapSpeed) *
        30;
      const t1 = computePreTransform(
        [wingAngle, 0, -60],
        [0.1, 0.45, -0.1],
        [0.8, 0.8, 0.8],
      );
      const t2 = computePreTransform(
        [wingAngle, 0, 60],
        [-0.1, 0.45, -0.1],
        [0.8, 0.8, 0.8],
      );
      const t3 = computePreTransform(
        [-wingAngle, 0, -120],
        [0.1, 0.35, -0.1],
        [0.8, 0.8, 0.8],
      );
      const t4 = computePreTransform(
        [-wingAngle, 0, 120],
        [-0.1, 0.35, -0.1],
        [0.8, 0.8, 0.8],
      );
      renderer.draw("wing2", ...transformArgs, t1);
      renderer.draw("wing2", ...transformArgs, t2);
      renderer.draw("wing2", ...transformArgs, t3);
      renderer.draw("wing2", ...transformArgs, t4);
    }
  }
  getBoundingRect() {
    return [
      this.x - this.scale[0] + this.dx,
      this.y - this.scale[1] + this.dy,
      this.scale[0] * 2,
      this.scale[1] * 2,
    ];
  }
  kill() {
    this.alive = false;
    events.raiseEvent("alienKill", this.type);
    if (aliens.length == 1) events.raiseEvent("levelCleared");
  }
  descend() {
    this.shotsFired = 0;
    this.inFormation = false;
    const start = Date.now();
    this.descendStart = start + 1000;
    this.descentFunctionX = (t) =>
      Math.sin((3 * (t - start)) / 1000) * 2 * Math.min(1, (t - start) / 1000);
    this.descentFunctionY = (t) =>
      ((t - start) / 1000) * -GlobalAlienControls.descentSpeed;

    this.descentFunctionAngle = (t) => -Math.min(180, (t - start) / 5);
    this.descentFunctionZ = (t) => {
      if ((t - start) / 1000 < 1)
        return -Math.sin(((t - start) / 1000) * Math.PI);
      return 0;
    };
  }
}

function computePreTransform(rotation, translation, scale) {
  const modelTransform = mat4.create();
  const q = quat.create();
  quat.fromEuler(q, ...rotation);
  mat4.fromRotationTranslationScale(modelTransform, q, translation, scale);
  return modelTransform;
}

const GlobalAlienControls = {
  oscillateSpeed: 1,
  flapSpeed: 12,
  oscillateDist: 1,
  initialDescentDelay: -10, // bonus delay, in seconds, at the start of the wave before aliens start descending
  descentFrequency: 5, // time interval, in seconds, at which aliens descend
  descentTime: Date.now(), // time at which an alien last descended
  descentSpeed: 3, // rate at which aliens run at ya
  bulletSpeed: 10,
};

function spawnAliens() {
  GlobalAlienControls.descentTime =
    Date.now() + GlobalAlienControls.initialDescentDelay * 1000;
  const numRows = 2;
  const numCols = 10;
  const numBoss = 3;

  const height = GAME_Z_PLANE - 2;
  const xDensity = 1;
  const yDensity = 1.5;

  GlobalAlienControls.oscillateDist =
    GAME_Z_PLANE - (xDensity * numCols) / 2 - 1;
  const w = (xDensity * numCols) / 2;

  for (let x = -w; x <= w; x += xDensity) {
    for (
      let y = height - yDensity;
      y >= height - yDensity * numRows;
      y -= yDensity
    ) {
      const a = new Alien(x, y, "alien1");
      aliens.push(a);
    }
  }
  const bossOffset = (2 * w) / (numBoss + 1);
  for (let i = 0; i < numBoss; i++) {
    const b1 = new Alien(-w + bossOffset * (i + 1), height, "alien2");
    aliens.push(b1);
  }
}

function launchClosestHornet(x, y) {
  const dist = aliens.map((a) => {
    if (a.type !== "alien1" || a.inFormation == false) return Math.inf;
    return Math.hypot(a.x - x, a.y - y);
  });
  const minIdx = dist.reduce(
    (minIdx, c, i, arr) => (c < arr[minIdx] ? i : minIdx),
    0,
  );
  if (dist[minIdx] !== Math.inf) aliens[minIdx].descend();
}

function updateAliens() {
  // check for dead aliens
  aliens = aliens.filter((a) => a.alive);
  // check if we need to make an alien start descending
  if (
    (Date.now() - GlobalAlienControls.descentTime) / 1000 >=
    GlobalAlienControls.descentFrequency
  ) {
    GlobalAlienControls.descentTime = Date.now();
    // pick a random alien to send out
    const a = utils.choice(aliens.filter((a) => a.inFormation));
    if (a !== undefined && !player.isDespawned) {
      a.descend();
      if (a.type == "alien2") {
        // if it happens to be a dragonfly, send out two closest hornets
        console.log("yeeting hornets");
        launchClosestHornet(a.x, a.y);
        launchClosestHornet(a.x, a.y);
      }
    }
  }

  for (const alien of aliens) {
    alien.update();
    if (
      player.z == GAME_Z_PLANE &&
      utils.rectCollide(alien.getBoundingRect(), player.getBoundingRect())
    ) {
      player.kill();
      alien.kill();
    }
  }
}

function drawAliens() {
  for (const alien of aliens) alien.draw();
}
