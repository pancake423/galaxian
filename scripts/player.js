class Player {
  constructor() {
    this.x = 0;
    this.y = -4;
    this.z = 6;

    this.mx = 0;
    this.maxSpeed = 5;
    this.accel = 30;
    this.fric = 10;

    this.maxYaw = -20;
    this.maxRoll = -20;

    this.roll = 0;
    this.pitch = 20;
    this.yaw = 0;

    this.scale = [1, 1, 1];

    this.t = Date.now();
  }

  update() {
    const dt = Date.now() - this.t;

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
}
