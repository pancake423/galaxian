class Alien {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.z = 6;
    this.type = type;

    this.roll = 0;
    this.pitch = -10;
    this.yaw = 0;

    this.minWingAngle = -70;
    this.maxWingAngle = -10;

    this.oscillateSpeed = 1;
    this.flapSpeed = 12;

    this.r = utils.randRange(0, 1000);

    this.inFormation = true;
    this.dx = 0;
    this.dy = 0;
    this.dz = 0;

    this.scale = type == "alien1" ? [0.5, 0.5, 0.5] : [0.6, 0.6, 0.6];

    this.t = Date.now();
  }

  update() {
    const dt = Date.now() - this.t;
    this.dx = Math.sin((this.t / 1000) * this.oscillateSpeed);
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
        ((Math.cos(((this.t + this.r) / 1000) * this.flapSpeed) + 1) / 2) *
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
        Math.cos(((this.t + this.r) / 1000) * this.flapSpeed) * 30;
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
}

function computePreTransform(rotation, translation, scale) {
  const modelTransform = mat4.create();
  const q = quat.create();
  quat.fromEuler(q, ...rotation);
  mat4.fromRotationTranslationScale(modelTransform, q, translation, scale);
  return modelTransform;
}

function spawnAliens() {
  for (let x = -4; x <= 4; x += 1) {
    for (let y = 1.5; y <= 3; y += 1.5) {
      const a = new Alien(x, y, "alien1");
      aliens.push(a);
    }
  }
  const b1 = new Alien(-1.5, 4, "alien2");
  aliens.push(b1);
  const b2 = new Alien(1.5, 4, "alien2");
  aliens.push(b2);
}

function updateAliens() {
  for (const alien of aliens) alien.update();
}

function drawAliens() {
  for (const alien of aliens) alien.draw();
}
