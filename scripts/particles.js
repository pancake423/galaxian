let particles = [];
class Particle {
  constructor(type, x, y, z, mx, my, mz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = 0.1;
    this.fric = 5;
    this.mx = mx;
    this.my = my;
    this.mz = mz;
    this.type = type;

    this.alive = true;

    this.t = Date.now();
  }
  draw() {
    renderer.draw(
      this.type,
      [this.x, this.y, this.z],
      [0, 0, 0],
      [this.r, this.r, this.r],
    );
  }
  update() {
    const dt = Date.now() - this.t;
    this.x += (this.mx * dt) / 1000;
    this.y += (this.my * dt) / 1000;
    this.z += (this.mz * dt) / 1000;
    this.r -= (0.2 * dt) / 1000;
    this.mx -= (Math.sign(this.mx) * this.fric * dt) / 1000;
    this.my -= (Math.sign(this.my) * this.fric * dt) / 1000;
    this.mz -= (Math.sign(this.mz) * this.fric * dt) / 1000;
    if (this.r <= 0) this.kill();
    this.t = Date.now();
  }

  kill() {
    this.alive = false;
  }
}

function drawParticles() {
  for (const p of particles) {
    p.draw();
  }
}
function updateParticles() {
  particles = particles.filter((p) => p.alive);
  for (const p of particles) {
    p.update();
  }
}

function particleExplosion(x, y, z, types, n, power = 3, radius = 0.3) {
  const randMtm = () => utils.uniform(-power, power);
  const randPos = () => utils.uniform(-radius, radius);
  for (let i = 0; i < n; i++) {
    const p = new Particle(
      utils.choice(types),
      x + randPos(),
      y + randPos(),
      z + randPos(),
      randMtm(),
      randMtm(),
      randMtm(),
    );
    particles.push(p);
  }
}
